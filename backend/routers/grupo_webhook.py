import os
import re
from fastapi import APIRouter, Request, Depends
from dotenv import load_dotenv

from middleware.auth import verificar_webhook_secret

from agents.avb_agent import processar_mensagem_grupo
from evolution import enviar_mensagem_whatsapp

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

# JID do agente no grupo — número do WhatsApp do agente (formato: 5500000000000)
AGENTE_JID = os.getenv("AGENTE_JID", "")
# ID do grupo WhatsApp (formato: 00000000000@g.us)
GRUPO_JID = os.getenv("GRUPO_JID", "")

router = APIRouter()


def extrair_dados_grupo(payload: dict) -> dict | None:
    """
    Extrai dados de mensagem de grupo da Evolution API.
    Retorna None se não for uma menção ao agente num grupo.
    """
    try:
        # Verifica se é mensagem de grupo
        data = payload.get("data", {})
        key = data.get("key", {})
        remote_jid = key.get("remoteJid", "")

        # Só processa mensagens de grupo
        if "@g.us" not in remote_jid:
            return None

        # Não processa mensagens do próprio bot
        from_me = key.get("fromMe", False)
        if from_me:
            return None

        message = data.get("message", {})
        push_name = data.get("pushName", "Colaborador")
        participant = data.get("participant", "")  # Quem enviou dentro do grupo

        # Pega o texto da mensagem (pode estar em vários formatos)
        texto = (
            message.get("conversation")
            or message.get("extendedTextMessage", {}).get("text")
            or ""
        )

        # ContextInfo pode vir no data ou dentro de extendedTextMessage
        context_info = (
            data.get("contextInfo")
            or message.get("extendedTextMessage", {}).get("contextInfo", {})
            or {}
        )
        mentioned_jids = context_info.get("mentionedJid", [])

        agente_numero = AGENTE_JID.replace("@s.whatsapp.net", "").replace("@c.us", "")
        foi_mencionado = (
            any(agente_numero in jid for jid in mentioned_jids)
            or len(mentioned_jids) > 0  # Se marcou qualquer contato
            or "@agente" in texto.lower()
            or "@assistente" in texto.lower()
            or (agente_numero and agente_numero in texto)
            or texto.startswith("@")
        )

        if not foi_mencionado:
            return None

        # Remove a menção do texto para enviar só a pergunta ao agente
        texto_limpo = re.sub(r"@\S+\s*", "", texto).strip()

        if not texto_limpo:
            return None

        return {
            "grupo_jid": remote_jid,
            "remetente": participant,
            "push_name": push_name,
            "texto": texto_limpo
        }

    except Exception as e:
        print(f"⚠️ [Grupo Webhook] Erro ao extrair dados: {e}")
        return None


@router.post("/webhook/grupo")
async def webhook_grupo(request: Request, _auth=Depends(verificar_webhook_secret)):
    """
    Endpoint chamado pela Evolution API para mensagens do grupo.
    Processa apenas menções ao @agente.
    """
    try:
        payload = await request.json()
        print(f"\n🔍 [Webhook Payload Recebido]: {payload}\n")
        dados = extrair_dados_grupo(payload)

        if not dados:
            return {"status": "ignorado", "motivo": "Não é menção ao agente ou não é grupo"}

        grupo_jid = dados["grupo_jid"]
        push_name = dados["push_name"]
        texto = dados["texto"]

        print(f"📨 [Grupo] {push_name} mencionou o agente: '{texto}'")

        # Processa com o agente de IA com memória por grupo
        resposta = await processar_mensagem_grupo(
            remetente_nome=push_name,
            texto_mensagem=texto,
            grupo_jid=grupo_jid
        )

        # Envia resposta no grupo
        await enviar_mensagem_whatsapp(telefone=grupo_jid, texto=resposta)

        return {"status": "respondido", "grupo": grupo_jid, "remetente": push_name}

    except Exception as e:
        print(f"❌ [Grupo Webhook] Erro: {e}")
        return {"status": "erro", "detalhe": str(e)}
