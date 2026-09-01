"""
main_avb.py — Servidor principal do Agente de IA da Ferramentaria AVB

Endpoints:
  POST /webhook/grupo          — Recebe mensagens do grupo (menções @agente) da Evolution API
  POST /api/notificar/retirada — Chamado pelo frontend ao registrar retirada
  POST /api/notificar/devolucao — Chamado pelo frontend ao registrar devolução
  GET  /                       — Health check
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

from routers.grupo_webhook import router as grupo_router
from routers.notificacoes import router as notificacoes_router

app = FastAPI(
    title="Agente IA — Ferramentaria AVB",
    description="Agente de IA para consultas e notificações da ferramentaria AVB via WhatsApp",
    version="1.0.0"
)

# ─── CORS — Restrito aos domínios permitidos ──────────
# Lê CORS_ORIGINS do .env (separados por vírgula). Se não configurado, usa localhost (dev).
cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080")
ALLOWED_ORIGINS = [origin.strip() for origin in cors_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# Registra os routers
app.include_router(grupo_router)
app.include_router(notificacoes_router)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "servico": "Agente IA — Ferramentaria AVB",
        "segurança": "CORS restrito + API Key + Webhook Secret",
        "endpoints": {
            "webhook_grupo": "POST /webhook/grupo",
            "notificar_retirada": "POST /api/notificar/retirada",
            "notificar_devolucao": "POST /api/notificar/devolucao"
        }
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
