"""
tests/test_auth.py — Testes automatizados para validação de segurança (API Key & Webhook Secret).
"""

import pytest
from httpx import AsyncClient, ASGITransport
import os
import sys

# Garante path para import do main
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from middleware.auth import API_KEY, WEBHOOK_SECRET


@pytest.mark.asyncio
async def test_health_check_publico():
    """Health check deve ser público (200 OK sem token)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_notificar_sem_api_key_retorna_401():
    """Rota de notificação sem X-API-Key deve retornar 401 Unauthorized."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "funcionario": "Carlos Teste",
            "matricula": "12345",
            "item_nome": "Alicate",
            "item_tipo": "ferramenta"
        }
        response = await ac.post("/api/notificar/retirada", json=payload)
        assert response.status_code == 401
        assert "Acesso negado" in response.json()["detail"]


@pytest.mark.asyncio
async def test_notificar_com_api_key_invalida_retorna_401():
    """Rota de notificação com X-API-Key incorreta deve retornar 401 Unauthorized."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "funcionario": "Carlos Teste",
            "matricula": "12345",
            "item_nome": "Alicate",
            "item_tipo": "ferramenta"
        }
        headers = {"X-API-Key": "chave_falsa_e_invalida"}
        response = await ac.post("/api/notificar/retirada", json=payload, headers=headers)
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_notificar_com_api_key_valida_retorna_200():
    """Rota de notificação com X-API-Key correta deve retornar 200 OK e status enfileirado."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "funcionario": "Carlos Teste",
            "matricula": "12345",
            "item_nome": "Alicate",
            "item_tipo": "ferramenta"
        }
        headers = {"X-API-Key": API_KEY}
        response = await ac.post("/api/notificar/retirada", json=payload, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "enfileirado"
        assert data["funcionario"] == "Carlos Teste"


@pytest.mark.asyncio
async def test_webhook_com_secret_invalido_retorna_403():
    """Webhook com secret incorreto no header deve retornar 403 Forbidden."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = {"X-Webhook-Secret": "secret_invalido_123"}
        response = await ac.post("/webhook/grupo", json={}, headers=headers)
        assert response.status_code == 403

