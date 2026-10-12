"""
services/queue.py — Fila de mensageria assíncrona persistente com Redis e Fallback gracioso.
"""

import json
import asyncio
from typing import Optional
from redis import asyncio as aioredis
from redis import exceptions as redis_exc

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
                # Sem socket_timeout para não conflitar com blpop(timeout=N).
                # O blpop gerencia seu próprio tempo de espera e retorna None
                # quando não há mensagens, sem lançar exceção.
                socket_connect_timeout=5.0,
                retry_on_timeout=True,
            )
            # Testa conexão
            await _redis_client.ping()
            logger.info("✔ Conexão com Redis estabelecida com sucesso")
        except Exception as e:
            logger.warning(f"⚠️ Redis indisponível ({e}). Sistema usará fallback em memória.")
            _redis_client = None
    return _redis_client


async def _reset_redis_client():
    """Fecha e reseta o cliente Redis para forçar reconexão limpa."""
    global _redis_client
    if _redis_client is not None:
        try:
            await _redis_client.aclose()
        except Exception:
            pass
    _redis_client = None


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

            # BLPOP com timeout de 5s.
            # - Retorna None se a fila estiver vazia → continua normalmente
            # - Lança redis_exc.TimeoutError em alguns ambientes → também normal
            try:
                item = await r.blpop(FILA_WHATSAPP_KEY, timeout=5)
            except redis_exc.TimeoutError:
                # Fila vazia — comportamento normal, sem erros
                continue

            if not item:
                # Sem mensagens na fila — comportamento normal
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

        except (redis_exc.ConnectionError, redis_exc.BusyLoadingError, redis_exc.AuthenticationError) as e:
            # Erro REAL de conexão — reseta e reconecta
            await _reset_redis_client()
            logger.warning(f"⚠️ Conexão Redis perdida ({type(e).__name__}). Reconectando em 5s...")
            await asyncio.sleep(5.0)

        except (ConnectionError, OSError) as e:
            # Erros de rede no nível do SO
            await _reset_redis_client()
            logger.warning(f"⚠️ Erro de rede ({type(e).__name__}). Reconectando em 5s...")
            await asyncio.sleep(5.0)

        except json.JSONDecodeError as e:
            logger.error(f"Job inválido na fila (JSON corrompido): {e}")

        except Exception as e:
            # Erros verdadeiramente inesperados
            logger.error(f"Erro inesperado no worker: {type(e).__name__}: {e}")
            await asyncio.sleep(3.0)

