"""
tests/test_queue_and_operacoes.py — Testes automatizados para a fila assíncrona e endpoints transacionais.
"""

import pytest
from httpx import AsyncClient, ASGITransport
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from config import API_KEY
from services.queue import enfileirar_mensagem_whatsapp



@pytest.mark.asyncio
async def test_enfileirar_mensagem_fallback():
    """Testa se o enfileiramento de mensagem executa sem quebrar mesmo em ambiente local."""
    sucesso = await enfileirar_mensagem_whatsapp(
        recipient="120363429173808883@g.us",
        texto="Mensagem de teste unitário"
    )
    assert sucesso is True


@pytest.mark.asyncio
async def test_operacao_retirar_sem_auth_retorna_401():
    """Endpoint de operação /api/operacoes/retirar sem API Key deve retornar 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        data = {
            "matricula": "99999",
            "item_id": "00000000-0000-0000-0000-000000000000",
            "item_tipo": "ferramenta",
            "quantidade": 1
        }
        response = await ac.post("/api/operacoes/retirar", data=data)
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_operacao_devolver_sem_auth_retorna_401():
    """Endpoint de operação /api/operacoes/devolver sem API Key deve retornar 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        data = {
            "matricula": "99999",
            "ferramenta_id": "00000000-0000-0000-0000-000000000000"
        }
        response = await ac.post("/api/operacoes/devolver", data=data)
        assert response.status_code == 401
