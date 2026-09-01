"""
routers/notificacoes.py — Rotas de notificação WhatsApp com BackgroundTasks e Provedor desacoplado.
"""

import os
import base64
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, Form, UploadFile, File, BackgroundTasks
from pydantic import BaseModel

from middleware.auth import verificar_api_key
from providers import whatsapp_provider
from utils.logger import get_logger

logger = get_logger("notificacoes")

dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

TZ_BRASILIA = ZoneInfo("America/Sao_Paulo")
GRUPO_JID = os.getenv("GRUPO_JID", "")

router = APIRouter()


def obter_agora_brasilia() -> datetime:
    return datetime.now(TZ_BRASILIA)


# ─── Schemas ───────────────────────────────────────

class RetiradaPayload(BaseModel):
    funcionario: str
    matricula: str
    item_nome: str
    item_tipo: str  # "ferramenta" ou "material"
    quantidade: Optional[int] = 1
    data: Optional[str] = None   # "01/09/2026"
    hora: Optional[str] = None   # "13:30"
    imagem_url: Optional[str] = None


class DevolucaoPayload(BaseModel):
    funcionario: str
    matricula: str
    item_nome: str
    item_tipo: str = "ferramenta"
    data: Optional[str] = None
    hora: Optional[str] = None
    imagem_url: Optional[str] = None


class SolicitarDevolucaoPayload(BaseModel):
    nome: str
    numero_whatsapp: str
    nome_ferramenta: str
    tag_ferramenta: Optional[str] = None
    data_retirada: Optional[str] = None


# ─── Helpers de Envio em Background ────────────────

async def _disparar_notificacao_grupo(
    texto: str,
    media_b64_or_url: Optional[str] = None,
    mimetype: str = "image/jpeg",
    file_name: str = "foto.jpg"
):
    """Executa o envio da notificação no WhatsApp em background."""
    if not GRUPO_JID:
        logger.warning("GRUPO_JID não configurado no .env")
        return

    if media_b64_or_url:
        await whatsapp_provider.send_image(
            recipient=GRUPO_JID,
            media_b64_or_url=media_b64_or_url,
            caption=texto,
            mimetype=mimetype,
            file_name=file_name
        )
    else:
        await whatsapp_provider.send_text(
            recipient=GRUPO_JID,
            text=texto
        )


async def _disparar_pv_solicitacao(numero: str, texto: str):
    """Executa o envio de solicitação no PV do colaborador em background."""
    await whatsapp_provider.send_text(recipient=numero, text=texto)


# ─── Endpoints ─────────────────────────────────────

@router.post("/api/notificar/retirada")
async def notificar_retirada(
    payload: RetiradaPayload,
    background_tasks: BackgroundTasks,
    _auth=Depends(verificar_api_key)
):
    """
    Notifica retirada no grupo do WhatsApp via JSON (execução em background).
    """
    agora = obter_agora_brasilia()
    data = payload.data or agora.strftime("%d/%m/%Y")
    hora = payload.hora or agora.strftime("%H:%M")

    tipo_emoji = "🔧" if payload.item_tipo == "ferramenta" else "📦"
    qtd_texto = f" — Quantidade: {payload.quantidade}" if payload.item_tipo == "material" and payload.quantidade and payload.quantidade > 1 else ""

    texto = (
        f"{tipo_emoji} *RETIRADA — Ferramentaria AVB*\n\n"
        f"👤 *Funcionário:* {payload.funcionario}\n"
        f"🪪 *Matrícula:* {payload.matricula}\n"
        f"🛠️ *Item:* {payload.item_nome}{qtd_texto}\n"
        f"📅 *Data:* {data} às {hora}"
    )

    background_tasks.add_task(
        _disparar_notificacao_grupo,
        texto=texto,
        media_b64_or_url=payload.imagem_url
    )

    return {
        "status": "enfileirado",
        "funcionario": payload.funcionario,
        "item": payload.item_nome
    }


@router.post("/api/notificar/devolucao")
async def notificar_devolucao(
    payload: DevolucaoPayload,
    background_tasks: BackgroundTasks,
    _auth=Depends(verificar_api_key)
):
    """
    Notifica devolução no grupo do WhatsApp via JSON (execução em background).
    """
    agora = obter_agora_brasilia()
    data = payload.data or agora.strftime("%d/%m/%Y")
    hora = payload.hora or agora.strftime("%H:%M")

    tipo_emoji = "🔧" if payload.item_tipo == "ferramenta" else "📦"

    texto = (
        f"↩️ *DEVOLUÇÃO — Ferramentaria AVB*\n\n"
        f"👤 *Funcionário:* {payload.funcionario}\n"
        f"🪪 *Matrícula:* {payload.matricula}\n"
        f"🛠️ *Item devolvido:* {payload.item_nome}\n"
        f"📅 *Data:* {data} às {hora}"
    )

    background_tasks.add_task(
        _disparar_notificacao_grupo,
        texto=texto,
        media_b64_or_url=payload.imagem_url
    )

    return {
        "status": "enfileirado",
        "funcionario": payload.funcionario,
        "item": payload.item_nome
    }


@router.post("/api/notificar/retirada-form")
async def notificar_retirada_form(
    background_tasks: BackgroundTasks,
    funcionario: str = Form(...),
    matricula: str = Form(...),
    item_nome: str = Form(...),
    item_tipo: str = Form(...),
    quantidade: int = Form(1),
    data: Optional[str] = Form(None),
    hora: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None),
    _auth=Depends(verificar_api_key)
):
    """
    Recebe multipart/form-data com a foto tirada pelo frontend e despacha notificação em background.
    """
    agora = obter_agora_brasilia()
    data_str = data or agora.strftime("%d/%m/%Y")
    hora_str = hora or agora.strftime("%H:%M")

    tipo_emoji = "🔧" if item_tipo == "ferramenta" else "📦"
    qtd_texto = f" — Quantidade: {quantidade}" if item_tipo == "material" and quantidade > 1 else ""

    texto = (
        f"{tipo_emoji} *RETIRADA — Ferramentaria AVB*\n\n"
        f"👤 *Funcionário:* {funcionario}\n"
        f"🪪 *Matrícula:* {matricula}\n"
        f"🛠️ *Item:* {item_nome}{qtd_texto}\n"
        f"📅 *Data:* {data_str} às {hora_str}"
    )

    b64_foto = None
    mimetype = "image/jpeg"
    filename = "foto.jpg"

    if foto:
        foto_bytes = await foto.read()
        b64_foto = base64.b64encode(foto_bytes).decode("utf-8")
        mimetype = foto.content_type or "image/jpeg"
        filename = foto.filename or "foto.jpg"

    background_tasks.add_task(
        _disparar_notificacao_grupo,
        texto=texto,
        media_b64_or_url=b64_foto,
        mimetype=mimetype,
        file_name=filename
    )

    return {"status": "enfileirado", "item": item_nome}


@router.post("/api/notificar/devolucao-form")
async def notificar_devolucao_form(
    background_tasks: BackgroundTasks,
    funcionario: str = Form(...),
    matricula: str = Form(...),
    item_nome: str = Form(...),
    item_tipo: str = Form("ferramenta"),
    data: Optional[str] = Form(None),
    hora: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None),
    _auth=Depends(verificar_api_key)
):
    """
    Recebe multipart/form-data com a foto da devolução e despacha notificação em background.
    """
    agora = obter_agora_brasilia()
    data_str = data or agora.strftime("%d/%m/%Y")
    hora_str = hora or agora.strftime("%H:%M")

    tipo_emoji = "🔧" if item_tipo == "ferramenta" else "📦"

    texto = (
        f"↩️ *DEVOLUÇÃO — Ferramentaria AVB*\n\n"
        f"👤 *Funcionário:* {funcionario}\n"
        f"🪪 *Matrícula:* {matricula}\n"
        f"🛠️ *Item devolvido:* {item_nome}\n"
        f"📅 *Data:* {data_str} às {hora_str}"
    )

    b64_foto = None
    mimetype = "image/jpeg"
    filename = "foto.jpg"

    if foto:
        foto_bytes = await foto.read()
        b64_foto = base64.b64encode(foto_bytes).decode("utf-8")
        mimetype = foto.content_type or "image/jpeg"
        filename = foto.filename or "foto.jpg"

    background_tasks.add_task(
        _disparar_notificacao_grupo,
        texto=texto,
        media_b64_or_url=b64_foto,
        mimetype=mimetype,
        file_name=filename
    )

    return {"status": "enfileirado", "item": item_nome}


@router.post("/api/notificar/solicitar-devolucao")
async def notificar_solicitar_devolucao(
    payload: SolicitarDevolucaoPayload,
    background_tasks: BackgroundTasks,
    _auth=Depends(verificar_api_key)
):
    """
    Envia notificação no PV do colaborador em background.
    """
    numero = payload.numero_whatsapp.replace("+", "").replace(" ", "").replace("-", "")
    if not numero.startswith("55") and len(numero) in [10, 11]:
        numero = "55" + numero

    data_info = f" no dia {payload.data_retirada}" if payload.data_retirada else ""

    texto = (
        f"Olá, *{payload.nome}*! 👋\n\n"
        f"Estou entrando em contato pois consta a retirada da ferramenta *{payload.nome_ferramenta}*{data_info} "
        f"e ainda não consta a devolução no sistema da ferramentaria.\n\n"
        f"Caso já tenha terminado o uso, por favor devolva-a na ferramentaria. 🛠️\n\n"
        f"_Mensagem automática — Controle de Ferramentaria AVB_"
    )

    background_tasks.add_task(_disparar_pv_solicitacao, numero=numero, texto=texto)

    return {"status": "enfileirado", "destinatario": numero}
