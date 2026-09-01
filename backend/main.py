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

import asyncio
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import CORS_ORIGINS, PORT
from routers.grupo_webhook import router as grupo_router
from routers.notificacoes import router as notificacoes_router
from routers.operacoes import router as operacoes_router
from services.queue import worker_fila_whatsapp, get_redis_client, FILA_WHATSAPP_KEY, FILA_WHATSAPP_DLQ_KEY
from utils.logger import get_logger

logger = get_logger("main")

# Limiter: 120 requisições por minuto por IP (alta margem para não interferir na operação diária)
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])


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

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS — Restrito aos domínios permitidos ──────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# Registra os routers
app.include_router(grupo_router)
app.include_router(notificacoes_router)
app.include_router(operacoes_router)



@app.get("/")
async def health_check():
    redis_status = "offline (fallback memória ativo)"
    fila_tamanho = 0
    dlq_tamanho = 0

    try:
        r = await get_redis_client()
        if r:
            redis_status = "conectado"
            fila_tamanho = await r.llen(FILA_WHATSAPP_KEY)
            dlq_tamanho = await r.llen(FILA_WHATSAPP_DLQ_KEY)
    except Exception:
        pass

    return {
        "status": "ok",
        "servico": "Agente IA — Ferramentaria AVB (Enterprise)",
        "seguranca": "CORS restrito + X-API-Key + Webhook Secret",
        "concorrencia": "Transações ACID (PostgreSQL FOR UPDATE)",
        "mensageria": {
            "redis_status": redis_status,
            "fila_pendentes": fila_tamanho,
            "fila_dlq_falhas": dlq_tamanho
        },
        "endpoints": {
            "webhook_grupo": "POST /webhook/grupo",
            "operacoes_retirar": "POST /api/operacoes/retirar",
            "operacoes_devolver": "POST /api/operacoes/devolver",
            "notificar_retirada": "POST /api/notificar/retirada",
            "notificar_devolucao": "POST /api/notificar/devolucao"
        }
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
