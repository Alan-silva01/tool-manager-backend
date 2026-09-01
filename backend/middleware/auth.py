"""
middleware/auth.py — Middleware de autenticação para proteger as rotas do Backend.

Implementa 2 camadas de segurança:
  1. API_KEY — protege as rotas /api/* chamadas pelo Frontend
  2. WEBHOOK_SECRET — protege a rota /webhook/grupo chamada pela Evolution API
"""

import os
import secrets
from fastapi import Request, HTTPException, Depends
from fastapi.security import APIKeyHeader

from pathlib import Path
from dotenv import load_dotenv

dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# ─── Chaves de Segurança ──────────────────────────────
# API_KEY: validada nas rotas /api/* (Frontend → Backend)
API_KEY = os.getenv("API_KEY", "")

# WEBHOOK_SECRET: validada na rota /webhook/grupo (Evolution API → Backend)
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")


# ─── Header Extractors ────────────────────────────────
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verificar_api_key(api_key: str = Depends(api_key_header)):
    """
    Dependency para rotas /api/*. Valida o header X-API-Key.
    Se API_KEY não estiver configurada no .env, desabilita a proteção (dev mode).
    """
    if not API_KEY:
        # Modo desenvolvimento: sem chave configurada, permite tudo
        return True

    if not api_key or not secrets.compare_digest(api_key, API_KEY):
        raise HTTPException(
            status_code=401,
            detail="Acesso negado. API Key inválida ou ausente.",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return True


EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "")

async def verificar_webhook_secret(request: Request):
    """
    Dependency para rota /webhook/grupo. Valida o header X-Webhook-Secret
    ou a apikey da Evolution API.
    Se nem WEBHOOK_SECRET nem EVOLUTION_API_KEY estiverem configuradas, desabilita a proteção (dev mode).
    """
    segredos_validos = [s for s in [WEBHOOK_SECRET, EVOLUTION_API_KEY] if s]
    if not segredos_validos:
        # Modo desenvolvimento: sem chave configurada, permite tudo
        return True

    # Aceita via X-Webhook-Secret ou via apikey (padrão Evolution API)
    secret = (
        request.headers.get("X-Webhook-Secret")
        or request.headers.get("apikey")
        or ""
    )

    if not secret:
        raise HTTPException(
            status_code=403,
            detail="Acesso negado ao webhook. Header de autenticação ausente.",
        )

    # Verifica se bate com WEBHOOK_SECRET ou com a EVOLUTION_API_KEY
    if any(secrets.compare_digest(secret, chave_valida) for chave_valida in segredos_validos):
        return True

    raise HTTPException(
        status_code=403,
        detail="Acesso negado ao webhook. Secret inválido.",
    )

