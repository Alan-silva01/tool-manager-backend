"""
agents/avb_agent.py — Agente de IA para a Ferramentaria AVB com OpenAI Function Calling e Memória.
"""

import json
from datetime import datetime
from zoneinfo import ZoneInfo
from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_MODEL
from tools.avb_tools import TOOLS_AVB
from prompts.avb_prompt import AVB_SYSTEM_PROMPT
from services.supabase_avb import (
    consultar_ferramenta,
    consultar_material,
    listar_ferramentas_funcionario,
    listar_todas_ferramentas,
    listar_todos_materiais,
    salvar_mensagem_chat_supabase,
    obter_historico_chat_supabase,
)
from utils.logger import get_logger

logger = get_logger("avb_agent")

TZ_BRASILIA = ZoneInfo("America/Sao_Paulo")

_openai_client: OpenAI | None = None


def get_openai_client() -> OpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAI(api_key=OPENAI_API_KEY)
    return _openai_client



def executar_tool(fn_name: str, args: dict) -> dict:
    """Executa a tool correspondente e retorna o resultado."""
    if fn_name == "consultar_ferramenta":
        return consultar_ferramenta(args.get("nome_ferramenta", ""))

    elif fn_name == "consultar_material":
        return consultar_material(args.get("nome_material", ""))

    elif fn_name == "listar_ferramentas_funcionario":
        return listar_ferramentas_funcionario(
            nome_funcionario=args.get("nome_funcionario", ""),
            matricula=args.get("matricula")
        )

    elif fn_name == "listar_todas_ferramentas":
        return listar_todas_ferramentas()

    elif fn_name == "listar_todos_materiais":
        return listar_todos_materiais()

    return {"erro": f"Tool '{fn_name}' não reconhecida"}


def obter_historico(grupo_jid: str) -> list[dict]:
    """Carrega histórico de mensagens persistidas no Supabase."""
    try:
        return obter_historico_chat_supabase(session_id=grupo_jid, limit=6)
    except Exception as e:
        logger.error(f"Erro ao carregar histórico: {e}")
        return []


def salvar_historico(grupo_jid: str, role: str, content: str):
    """Salva mensagem no histórico do Supabase."""
    try:
        salvar_mensagem_chat_supabase(session_id=grupo_jid, role=role, content=content)
    except Exception as e:
        logger.error(f"Erro ao salvar mensagem no histórico: {e}")


async def processar_mensagem_grupo(
    remetente_nome: str,
    texto_mensagem: str,
    grupo_jid: str = "default"
) -> str:
    """
    Processa uma mensagem de menção @agente no grupo WhatsApp com memória contextual.
    Usa OpenAI + tools para consultar o Supabase e responder.
    """
    try:
        client = get_openai_client()

        data_hora = datetime.now(TZ_BRASILIA).strftime("%d/%m/%Y %H:%M")
        system_prompt = AVB_SYSTEM_PROMPT.format(data_hora=data_hora)

        user_content = f"[{remetente_nome}] perguntou: {texto_mensagem}"

        # Carrega histórico recente do grupo
        historico_recente = obter_historico(grupo_jid)

        messages = [
            {"role": "system", "content": system_prompt},
            *historico_recente,
            {"role": "user", "content": user_content}
        ]

        logger.info(f"🤖 Processando mensagem com memória de {remetente_nome}: '{texto_mensagem}'")

        # Salva a mensagem do usuário no histórico
        salvar_historico(grupo_jid, "user", user_content)

        # Primeira chamada à OpenAI
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            tools=TOOLS_AVB,
            tool_choice="auto"
        )

        resposta_msg = response.choices[0].message
        tool_calls = resposta_msg.tool_calls

        # Se não chamou nenhuma tool, retorna direto
        if not tool_calls:
            texto_resp = resposta_msg.content or "Desculpe, não consegui processar sua pergunta."
            salvar_historico(grupo_jid, "assistant", texto_resp)
            return texto_resp

        # Executa as tools chamadas
        messages.append(resposta_msg)

        for tool_call in tool_calls:
            fn_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)

            logger.info(f"🔧 Executando tool: {fn_name}({args})")
            resultado = executar_tool(fn_name, args)
            logger.debug(f"📊 Resultado da tool {fn_name}: {resultado}")

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(resultado, ensure_ascii=False)
            })

        # Segunda chamada para gerar resposta amigável
        response_final = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages
        )

        resposta_final = response_final.choices[0].message.content or ""
        salvar_historico(grupo_jid, "assistant", resposta_final)
        logger.info(f"✅ Resposta gerada com sucesso para {remetente_nome}")
        return resposta_final

    except Exception as e:
        logger.exception(f"Erro ao processar mensagem do grupo: {e}")
        return "Ocorreu um erro ao consultar o sistema. Por favor, tente novamente."
