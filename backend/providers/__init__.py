"""
providers package — Exporta a instância padrão do provedor de WhatsApp.
"""

from providers.base import BaseWhatsAppProvider
from providers.evolution import EvolutionWhatsAppProvider

# Provedor singleton padrão do sistema
whatsapp_provider: BaseWhatsAppProvider = EvolutionWhatsAppProvider()

__all__ = ["BaseWhatsAppProvider", "EvolutionWhatsAppProvider", "whatsapp_provider"]
