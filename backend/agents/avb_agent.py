import os
import json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

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

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

_openai_client: OpenAI | None = None


def get_openai_client() -> OpenAI:
    global _openai_client
    if _openai_client is None:
        key = os.getenv("OPENAI_API_KEY", OPENAI_API_KEY)
        _openai_client = OpenAI(api_key=key)
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

    return {"erro": f"Tool '{fn_name}' não reconhecida."}



def obter_historico(grupo_jid: str) -> list[dict]:
    """Obtém o histórico de mensagens gravadas no Supabase."""
    return obter_historico_chat_supabase(session_id=grupo_jid, limit=8)


def salvar_historico(grupo_jid: str, role: str, content: str):
    """Salva a mensagem no Supabase de forma persistente."""
    salvar_mensagem_chat_supabase(session_id=grupo_jid, role=role, content=content)


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

        data_hora = datetime.now().strftime("%d/%m/%Y %H:%M")
        system_prompt = AVB_SYSTEM_PROMPT.format(data_hora=data_hora)

        user_content = f"[{remetente_nome}] perguntou: {texto_mensagem}"

        # Carrega histórico recente do grupo
        historico_recente = obter_historico(grupo_jid)

        messages = [
            {"role": "system", "content": system_prompt},
            *historico_recente,
            {"role": "user", "content": user_content}
        ]

        print(f"🤖 [AVB Agent] Processando mensagem com memória de {remetente_nome}: '{texto_mensagem}'")

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

            print(f"🔧 [AVB Agent] Executando tool: {fn_name}({args})")
            resultado = executar_tool(fn_name, args)
            print(f"📊 [AVB Agent] Resultado: {resultado}")

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
        print(f"✅ [AVB Agent] Resposta gerada: '{resposta_final}'")
        return resposta_final

    except Exception as e:
        print(f"❌ [AVB Agent] Erro ao processar mensagem: {e}")
        return "Ocorreu um erro ao consultar o sistema. Por favor, tente novamente."
