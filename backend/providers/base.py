"""
providers/base.py — Interface abstrata para provedores de mensageria WhatsApp.

Permite trocar de Evolution API para Z-API, Twilio ou Meta Cloud API sem alterar as rotas.
"""

from abc import ABC, abstractmethod
from typing import Optional


class BaseWhatsAppProvider(ABC):
    @abstractmethod
    async def send_text(self, recipient: str, text: str) -> bool:
        """Envia mensagem de texto para um número ou grupo."""
        pass

    @abstractmethod
    async def send_image(
        self,
        recipient: str,
        media_b64_or_url: str,
        caption: str,
        mimetype: str = "image/jpeg",
        file_name: str = "foto.jpg"
    ) -> bool:
        """Envia imagem com legenda para um número ou grupo."""
        pass
