"""
config.py — Carregamento centralizado de variáveis de ambiente.

Todas as configurações do backend devem ser importadas deste módulo.
Exemplo de uso: from config import SUPABASE_URL, OPENAI_API_KEY
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Carrega .env uma única vez na raiz do backend
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# ─── Supabase ──────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# ─── OpenAI ────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ─── Evolution API / WhatsApp ──────────────────────
EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "")
EVOLUTION_INSTANCE = os.getenv("EVOLUTION_INSTANCE", "")

# ─── IDs do WhatsApp ──────────────────────────────
GRUPO_JID = os.getenv("GRUPO_JID", "")
AGENTE_JID = os.getenv("AGENTE_JID", "")

# ─── Segurança ─────────────────────────────────────
API_KEY = os.getenv("API_KEY", "")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")

# ─── CORS ──────────────────────────────────────────
CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

# ─── Redis ─────────────────────────────────────────
def _sanitize_redis_url(url: str) -> str:
    """
    Codifica o @ da senha como %40 para evitar que o parser de URL
    interprete o @ da senha como separador entre credenciais e host.

    Ex: redis://default:Senha@123@host:6379
     -> redis://default:Senha%40123@host:6379
    """
    if not url or "://" not in url:
        return url
    try:
        scheme, rest = url.split("://", 1)
        if "@" not in rest:
            return url
        # Separa credenciais do host pelo ÚLTIMO @
        last_at = rest.rfind("@")
        credentials = rest[:last_at]   # tudo antes do último @
        host_part = rest[last_at + 1:] # host:port/db

        if ":" in credentials:
            user, password = credentials.split(":", 1)
            # Codifica @ extras na senha
            password = password.replace("@", "%40")
            credentials = f"{user}:{password}"

        return f"{scheme}://{credentials}@{host_part}"
    except Exception:
        return url

REDIS_URL = _sanitize_redis_url(os.getenv("REDIS_URL", ""))

# ─── Servidor ─────────────────────────────────────
PORT = int(os.getenv("PORT", "8001"))
