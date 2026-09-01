"""
routers/operacoes.py — Endpoints transacionais centralizados (Padrão BFF) com garantia ACID e Fila Redis.
"""

import base64
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional

from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from pydantic import BaseModel

from config import GRUPO_JID
from middleware.auth import verificar_api_key
from services.supabase_avb import get_supabase
from services.queue import enfileirar_mensagem_whatsapp
from utils.logger import get_logger

logger = get_logger("operacoes_bff")

TZ_BRASILIA = ZoneInfo("America/Sao_Paulo")

router = APIRouter(prefix="/api/operacoes", tags=["Operações Transacionais"])



def obter_agora_brasilia() -> datetime:
    return datetime.now(TZ_BRASILIA)


@router.post("/retirar")
async def operar_retirada_atomica(
    matricula: str = Form(...),
    item_id: str = Form(...),
    item_tipo: str = Form(...),  # 'ferramenta' ou 'material'
    quantidade: int = Form(1),
    foto: Optional[UploadFile] = File(None),
    _auth=Depends(verificar_api_key)
):
    """
    Executa retirada atômica com trava de concorrência (FOR UPDATE) no PostgreSQL
    e despacha notificação com foto via fila Redis.
    """
    try:
        sb = get_supabase()

        # 1. Executa RPC transacional atômica no Supabase
        rpc_res = sb.rpc("realizar_retirada_atomica", {
            "p_matricula": matricula,
            "p_item_id": item_id,
            "p_item_tipo": item_tipo,
            "p_quantidade": quantidade
        }).execute()

        resultado = rpc_res.data or {}

        if not resultado.get("sucesso", False):
            raise HTTPException(
                status_code=400,
                detail=resultado.get("erro", "Não foi possível realizar a retirada.")
            )

        funcionario_nome = resultado.get("funcionario_nome", "Colaborador")
        item_nome = resultado.get("item_nome", "Item")

        # 2. Prepara mensagem para o WhatsApp
        agora = obter_agora_brasilia()
        data_str = agora.strftime("%d/%m/%Y")
        hora_str = agora.strftime("%H:%M")

        tipo_emoji = "🔧" if item_tipo == "ferramenta" else "📦"
        qtd_texto = f" — Quantidade: {quantidade}" if item_tipo == "material" and quantidade > 1 else ""

        texto = (
            f"{tipo_emoji} *RETIRADA — Ferramentaria AVB*\n\n"
            f"👤 *Funcionário:* {funcionario_nome}\n"
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

        # 3. Enfileira notificação no Redis
        if GRUPO_JID:
            await enfileirar_mensagem_whatsapp(
                recipient=GRUPO_JID,
                texto=texto,
                media_b64_or_url=b64_foto,
                mimetype=mimetype,
                file_name=filename
            )

        logger.info(f"✅ Retirada atômica concluída: {item_nome} para {funcionario_nome} (Mat: {matricula})")

        return {
            "sucesso": True,
            "funcionario": funcionario_nome,
            "item": item_nome,
            "quantidade": quantidade
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Erro inesperado na operação de retirada: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/devolver")
async def operar_devolucao_atomica(
    matricula: str = Form(...),
    ferramenta_id: str = Form(...),
    foto: Optional[UploadFile] = File(None),
    _auth=Depends(verificar_api_key)
):
    """
    Executa devolução atômica com trava de concorrência no PostgreSQL
    e despacha notificação via fila Redis.
    """
    try:
        sb = get_supabase()

        # 1. Executa RPC transacional atômica no Supabase
        rpc_res = sb.rpc("realizar_devolucao_atomica", {
            "p_matricula": matricula,
            "p_ferramenta_id": ferramenta_id
        }).execute()

        resultado = rpc_res.data or {}

        if not resultado.get("sucesso", False):
            raise HTTPException(
                status_code=400,
                detail=resultado.get("erro", "Não foi possível realizar a devolução.")
            )

        funcionario_nome = resultado.get("funcionario_nome", "Colaborador")
        item_nome = resultado.get("item_nome", "Ferramenta")

        # 2. Prepara mensagem para o WhatsApp
        agora = obter_agora_brasilia()
        data_str = agora.strftime("%d/%m/%Y")
        hora_str = agora.strftime("%H:%M")

        texto = (
            f"↩️ *DEVOLUÇÃO — Ferramentaria AVB*\n\n"
            f"👤 *Funcionário:* {funcionario_nome}\n"
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

        # 3. Enfileira notificação no Redis
        if GRUPO_JID:
            await enfileirar_mensagem_whatsapp(
                recipient=GRUPO_JID,
                texto=texto,
                media_b64_or_url=b64_foto,
                mimetype=mimetype,
                file_name=filename
            )

        logger.info(f"✅ Devolução atômica concluída: {item_nome} de {funcionario_nome} (Mat: {matricula})")

        return {
            "sucesso": True,
            "funcionario": funcionario_nome,
            "item": item_nome
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Erro inesperado na operação de devolução: {e}")
        raise HTTPException(status_code=500, detail=str(e))
