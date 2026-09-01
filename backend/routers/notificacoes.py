import os
import httpx
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

TZ_BRASILIA = ZoneInfo("America/Sao_Paulo")

def obter_agora_brasilia() -> datetime:
    return datetime.now(TZ_BRASILIA)

EVOLUTION_API_URL = os.getenv("EVOLUTION_API_URL", "").rstrip("/")
EVOLUTION_API_KEY = os.getenv("EVOLUTION_API_KEY", "")
EVOLUTION_INSTANCE = os.getenv("EVOLUTION_INSTANCE", "")
GRUPO_JID = os.getenv("GRUPO_JID", "")

router = APIRouter()



# ─── Schemas ───────────────────────────────────────

class RetiradaPayload(BaseModel):
    funcionario: str
    matricula: str
    item_nome: str
    item_tipo: str  # "ferramenta" ou "material"
    quantidade: Optional[int] = 1
    data: Optional[str] = None   # "31/08/2026"
    hora: Optional[str] = None   # "15:30"
    imagem_url: Optional[str] = None  # URL pública da imagem


class DevolucaoPayload(BaseModel):
    funcionario: str
    matricula: str
    item_nome: str
    item_tipo: str  # "ferramenta" ou "material"
    data: Optional[str] = None
    hora: Optional[str] = None
    imagem_url: Optional[str] = None


# ─── Helpers Evolution API ─────────────────────────

async def enviar_texto_grupo(texto: str) -> bool:
    """Envia mensagem de texto no grupo via Evolution API."""
    if not EVOLUTION_API_URL or not GRUPO_JID:
        print(f"⚠️ Evolution API ou GRUPO_JID não configurados. Mensagem simulada:\n{texto}")
        return False

    url = f"{EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCE}"
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    payload = {"number": GRUPO_JID, "text": texto}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code in [200, 201]:
                print(f"📲 Texto enviado ao grupo com sucesso")
                return True
            print(f"❌ Erro Evolution API texto ({resp.status_code}): {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Exceção ao enviar texto ao grupo: {e}")
        return False


async def enviar_imagem_grupo(media_b64_or_url: str, caption: str, mimetype: str = "image/jpeg", fileName: str = "foto.jpg") -> bool:
    """Envia imagem com legenda no grupo via Evolution API."""
    if not EVOLUTION_API_URL or not GRUPO_JID:
        print(f"⚠️ Evolution API ou GRUPO_JID não configurados. Imagem simulada:\n{caption}")
        return False

    url = f"{EVOLUTION_API_URL}/message/sendMedia/{EVOLUTION_INSTANCE}"
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    payload = {
        "number": GRUPO_JID,
        "mediatype": "image",
        "mimetype": mimetype,
        "media": media_b64_or_url,
        "fileName": fileName,
        "caption": caption
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code in [200, 201]:
                print(f"🖼️ Imagem enviada ao grupo com sucesso")
                return True
            print(f"❌ Erro Evolution API imagem ({resp.status_code}): {resp.text}")
            return False
    except Exception as e:
        print(f"❌ Exceção ao enviar imagem ao grupo: {e}")
        return False


# ─── Endpoints ─────────────────────────────────────

@router.post("/api/notificar/retirada")
async def notificar_retirada(payload: RetiradaPayload):
    """
    Chamado pelo frontend quando um funcionário retira uma ferramenta ou material.
    Envia notificação no grupo do WhatsApp com texto e imagem.
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

    sucesso = False

    if payload.imagem_url:
        # Envia imagem com o texto como legenda
        sucesso = await enviar_imagem_grupo(
            media_b64_or_url=payload.imagem_url,
            caption=texto
        )
    else:
        # Envia só o texto
        sucesso = await enviar_texto_grupo(texto)

    return {
        "status": "enviado" if sucesso else "simulado",
        "funcionario": payload.funcionario,
        "item": payload.item_nome
    }


@router.post("/api/notificar/devolucao")
async def notificar_devolucao(payload: DevolucaoPayload):
    """
    Chamado pelo frontend quando um funcionário devolve uma ferramenta.
    Envia notificação no grupo do WhatsApp.
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

    sucesso = False

    if payload.imagem_url:
        sucesso = await enviar_imagem_grupo(
            media_b64_or_url=payload.imagem_url,
            caption=texto
        )
    else:
        sucesso = await enviar_texto_grupo(texto)

from fastapi import Form, UploadFile, File
import base64

@router.post("/api/notificar/retirada-form")
async def notificar_retirada_form(
    funcionario: str = Form(...),
    matricula: str = Form(...),
    item_nome: str = Form(...),
    item_tipo: str = Form(...),
    quantidade: int = Form(1),
    data: Optional[str] = Form(None),
    hora: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None)
):
    """
    Recebe multipart/form-data com a foto tirada pelo frontend e envia ao WhatsApp.
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

    if foto:
        foto_bytes = await foto.read()
        b64_foto = base64.b64encode(foto_bytes).decode("utf-8")
        sucesso = await enviar_imagem_grupo(
            media_b64_or_url=b64_foto,
            caption=texto,
            mimetype=foto.content_type or "image/jpeg",
            fileName=foto.filename or "foto.jpg"
        )
    else:
        sucesso = await enviar_texto_grupo(texto)

    return {"status": "enviado" if sucesso else "simulado", "item": item_nome}


@router.post("/api/notificar/devolucao-form")
async def notificar_devolucao_form(
    funcionario: str = Form(...),
    matricula: str = Form(...),
    item_nome: str = Form(...),
    item_tipo: str = Form("ferramenta"),
    data: Optional[str] = Form(None),
    hora: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None)
):
    """
    Recebe multipart/form-data com a foto da devolução tirada pelo frontend e envia ao WhatsApp.
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

    if foto:
        foto_bytes = await foto.read()
        b64_foto = base64.b64encode(foto_bytes).decode("utf-8")
        sucesso = await enviar_imagem_grupo(
            media_b64_or_url=b64_foto,
            caption=texto,
            mimetype=foto.content_type or "image/jpeg",
            fileName=foto.filename or "foto.jpg"
        )
    else:
        sucesso = await enviar_texto_grupo(texto)

    return {"status": "enviado" if sucesso else "simulado", "item": item_nome}


class SolicitarDevolucaoPayload(BaseModel):
    nome: str
    numero_whatsapp: str
    nome_ferramenta: str
    tag_ferramenta: Optional[str] = None
    data_retirada: Optional[str] = None


@router.post("/api/notificar/solicitar-devolucao")
async def notificar_solicitar_devolucao(payload: SolicitarDevolucaoPayload):
    """
    Envia notificação no PV (WhatsApp privado) do colaborador solicitando a devolução da ferramenta.
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

    if not EVOLUTION_API_URL:
        print(f"⚠️ Evolution API não configurada. Mensagem PV para {numero}:\n{texto}")
        return {"status": "simulado", "mensagem": texto}

    url = f"{EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCE}"
    headers = {"apikey": EVOLUTION_API_KEY, "Content-Type": "application/json"}
    body = {"number": numero, "text": texto}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=body)
            if resp.status_code in [200, 201]:
                print(f"📲 Mensagem de solicitação enviada com sucesso no PV de {payload.nome} ({numero})")
                return {"status": "enviado", "destinatario": numero}
            else:
                print(f"❌ Erro Evolution API ao enviar no PV ({resp.status_code}): {resp.text}")
                return {"status": "erro", "detalhes": resp.text}
    except Exception as e:
        print(f"❌ Exceção ao enviar mensagem no PV: {e}")
        return {"status": "erro", "detalhes": str(e)}

