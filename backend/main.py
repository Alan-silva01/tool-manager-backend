"""
main_avb.py — Servidor principal do Agente de IA da Ferramentaria AVB

Endpoints:
  POST /webhook/grupo           — Recebe mensagens do grupo (menções @agente) da Evolution API
  POST /api/operacoes/retirar   — Retirada atômica ACID + Fila WhatsApp
  POST /api/operacoes/devolver  — Devolução atômica ACID + Fila WhatsApp
  POST /api/notificar/retirada  — Notificação WhatsApp assíncrona
  POST /api/notificar/devolucao — Notificação WhatsApp assíncrona
  GET  /                        — Health check & Métricas
"""

import os
import asyncio
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

from routers.grupo_webhook import router as grupo_router
from routers.notificacoes import router as notificacoes_router
from routers.operacoes import router as operacoes_router
from services.queue import worker_fila_whatsapp
from utils.logger import get_logger

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia ciclo de vida do FastAPI e inicializa o worker da fila Redis."""
    logger.info("🚀 Iniciando Servidor da Ferramentaria AVB...")
    worker_task = asyncio.create_task(worker_fila_whatsapp())
    yield
    logger.info("🛑 Encerrando Servidor da Ferramentaria AVB...")
    worker_task.cancel()


app = FastAPI(
    title="Agente IA — Ferramentaria AVB",
    description="Agente de IA e backend transacional para controle de ferramentaria via WhatsApp e Web",
    version="2.0.0",
    lifespan=lifespan
)

# ─── CORS — Restrito aos domínios permitidos ──────────
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
app.include_router(operacoes_router)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "servico": "Agente IA — Ferramentaria AVB (Enterprise)",
        "seguranca": "CORS restrito + X-API-Key + Webhook Secret",
        "concorrencia": "Transações ACID (PostgreSQL FOR UPDATE)",
        "mensageria": "Redis Queue Assíncrono com Fallback Gracioso",
        "endpoints": {
            "webhook_grupo": "POST /webhook/grupo",
            "operacoes_retirar": "POST /api/operacoes/retirar",
            "operacoes_devolver": "POST /api/operacoes/devolver",
            "notificar_retirada": "POST /api/notificar/retirada",
            "notificar_devolucao": "POST /api/notificar/devolucao"
        }
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
