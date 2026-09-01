"""
providers/evolution.py — Implementação do provedor Evolution API v2.
"""

import httpx

from config import EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE
from providers.base import BaseWhatsAppProvider
from utils.logger import get_logger

logger = get_logger("evolution_provider")


class EvolutionWhatsAppProvider(BaseWhatsAppProvider):
    def __init__(self):
        self.api_url = EVOLUTION_API_URL.rstrip("/")
        self.api_key = EVOLUTION_API_KEY
        self.instance = EVOLUTION_INSTANCE

    async def send_text(self, recipient: str, text: str) -> bool:

        """Envia mensagem de texto via Evolution API."""
        if not self.api_url or not self.instance:
            logger.warning(f"Evolution API não configurada. Mensagem simulada para {recipient}:\n{text}")
            return False

        url = f"{self.api_url}/message/sendText/{self.instance}"
        headers = {"apikey": self.api_key, "Content-Type": "application/json"}
        payload = {"number": recipient, "text": text}

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code in [200, 201]:
                    logger.info(f"📲 Mensagem de texto enviada com sucesso para {recipient}")
                    return True
                logger.error(f"Erro Evolution API texto ({resp.status_code}): {resp.text}")
                return False
        except Exception as e:
            logger.exception(f"Exceção ao enviar texto para {recipient}: {e}")
            return False

    async def send_image(
        self,
        recipient: str,
        media_b64_or_url: str,
        caption: str,
        mimetype: str = "image/jpeg",
        file_name: str = "foto.jpg"
    ) -> bool:
        """Envia imagem com legenda via Evolution API."""
        if not self.api_url or not self.instance:
            logger.warning(f"Evolution API não configurada. Imagem simulada para {recipient}:\n{caption}")
            return False

        url = f"{self.api_url}/message/sendMedia/{self.instance}"
        headers = {"apikey": self.api_key, "Content-Type": "application/json"}
        payload = {
            "number": recipient,
            "mediatype": "image",
            "mimetype": mimetype,
            "media": media_b64_or_url,
            "fileName": file_name,
            "caption": caption
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code in [200, 201]:
                    logger.info(f"🖼️ Imagem enviada com sucesso para {recipient}")
                    return True
                logger.error(f"Erro Evolution API imagem ({resp.status_code}): {resp.text}")
                return False
        except Exception as e:
            logger.exception(f"Exceção ao enviar imagem para {recipient}: {e}")
            return False
