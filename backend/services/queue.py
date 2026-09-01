"""
services/queue.py — Fila de mensageria assíncrona persistente com Redis e Fallback gracioso.
"""

import json
import asyncio
from typing import Optional
from redis import asyncio as aioredis

from config import REDIS_URL
from providers import whatsapp_provider
from utils.logger import get_logger

logger = get_logger("queue_service")

FILA_WHATSAPP_KEY = "fila:whatsapp:notificacoes"
FILA_WHATSAPP_DLQ_KEY = "fila:whatsapp:falhas_dlq"


_redis_client: Optional[aioredis.Redis] = None
_worker_running = False


async def get_redis_client() -> Optional[aioredis.Redis]:
    """Retorna o cliente Redis assíncrono singleton, ou None se indisponível."""
    global _redis_client
    if not REDIS_URL:
        return None

    if _redis_client is None:
        try:
            _redis_client = aioredis.from_url(
                REDIS_URL,
                decode_responses=True,
                socket_timeout=3.0,
                socket_connect_timeout=3.0
            )
            # Testa conexão
            await _redis_client.ping()
            logger.info("⚡ Conexão com Redis estabelecida com sucesso")
        except Exception as e:
            logger.warning(f"⚠️ Redis indisponível ({e}). Sistema usará fallback em memória.")
            _redis_client = None
    return _redis_client


async def enfileirar_mensagem_whatsapp(
    recipient: str,
    texto: str,
    media_b64_or_url: Optional[str] = None,
    mimetype: str = "image/jpeg",
    file_name: str = "foto.jpg"
) -> bool:
    """
    Enfileira uma notificação no Redis para envio assíncrono com tolerância a falhas.
    Se o Redis estiver offline, executa diretamente via async task (Fallback).
    """
    payload = {
        "recipient": recipient,
        "texto": texto,
        "media_b64_or_url": media_b64_or_url,
        "mimetype": mimetype,
        "file_name": file_name,
        "tentativas": 0
    }

    try:
        r = await get_redis_client()
        if r:
            await r.rpush(FILA_WHATSAPP_KEY, json.dumps(payload))
            logger.info(f"📥 Mensagem enfileirada no Redis para {recipient}")
            return True
    except Exception as e:
        logger.warning(f"Erro ao enfileirar no Redis ({e}). Executando fallback direto.")

    # Fallback: executa de forma assíncrona desacoplada
    asyncio.create_task(_executar_envio(payload))
    return True


async def _executar_envio(job: dict) -> bool:
    """Executa o envio do job via whatsapp_provider."""
    try:
        if job.get("media_b64_or_url"):
            return await whatsapp_provider.send_image(
                recipient=job["recipient"],
                media_b64_or_url=job["media_b64_or_url"],
                caption=job["texto"],
                mimetype=job.get("mimetype", "image/jpeg"),
                file_name=job.get("file_name", "foto.jpg")
            )
        else:
            return await whatsapp_provider.send_text(
                recipient=job["recipient"],
                text=job["texto"]
            )
    except Exception as e:
        logger.error(f"Erro no envio do job WhatsApp: {e}")
        return False


async def worker_fila_whatsapp():
    """Worker em loop contínuo que processa a fila de mensagens do Redis."""
    global _worker_running
    if _worker_running:
        return
    _worker_running = True

    logger.info("👷 Worker da fila Redis WhatsApp iniciado")

    while True:
        try:
            r = await get_redis_client()
            if not r:
                await asyncio.sleep(5.0)
                continue

            # BLPOP com timeout de 3 segundos
            item = await r.blpop(FILA_WHATSAPP_KEY, timeout=3)
            if not item:
                continue

            _, job_json = item
            job = json.loads(job_json)

            sucesso = await _executar_envio(job)
            if not sucesso:
                tentativas = job.get("tentativas", 0) + 1
                if tentativas <= 3:
                    job["tentativas"] = tentativas
                    logger.warning(f"🔁 Reenfileirando mensagem para {job['recipient']} (Tentativa {tentativas}/3)")
                    await asyncio.sleep(2.0)
                    await r.rpush(FILA_WHATSAPP_KEY, json.dumps(job))
                else:
                    logger.error(f"❌ Movendo mensagem para DLQ ({FILA_WHATSAPP_DLQ_KEY}) para {job['recipient']} após 3 tentativas falhas.")
                    try:
                        await r.rpush(FILA_WHATSAPP_DLQ_KEY, json.dumps(job))
                    except Exception as dlq_err:
                        logger.error(f"Erro ao salvar na DLQ: {dlq_err}")

        except asyncio.CancelledError:
            logger.info("Worker da fila cancelado.")
            break
        except Exception as e:
            logger.error(f"Erro no loop do worker Redis: {e}")
            await asyncio.sleep(3.0)
