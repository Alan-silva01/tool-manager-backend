"""
main_avb.py — Servidor principal do Agente de IA da Ferramentaria AVB

Endpoints:
  POST /webhook/grupo          — Recebe mensagens do grupo (menções @agente) da Evolution API
  POST /api/notificar/retirada — Chamado pelo frontend ao registrar retirada
  POST /api/notificar/devolucao — Chamado pelo frontend ao registrar devolução
  GET  /                       — Health check
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.grupo_webhook import router as grupo_router
from routers.notificacoes import router as notificacoes_router

app = FastAPI(
    title="Agente IA — Ferramentaria AVB",
    description="Agente de IA para consultas e notificações da ferramentaria AVB via WhatsApp",
    version="1.0.0"
)

# CORS — permite chamadas do frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, coloque a URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os routers
app.include_router(grupo_router)
app.include_router(notificacoes_router)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "servico": "Agente IA — Ferramentaria AVB",
        "endpoints": {
            "webhook_grupo": "POST /webhook/grupo",
            "notificar_retirada": "POST /api/notificar/retirada",
            "notificar_devolucao": "POST /api/notificar/devolucao"
        }
    }


if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
