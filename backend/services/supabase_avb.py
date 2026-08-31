import os
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv

from pathlib import Path
dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
    """Retorna instância singleton do Supabase AVB."""
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv("SUPABASE_URL", "")
        key = os.getenv("SUPABASE_KEY", "")
        if not url or not key:
            raise ValueError("SUPABASE_URL e SUPABASE_KEY devem estar configurados no .env")
        _supabase_client = create_client(url, key)
    return _supabase_client


# ─────────────────────────────────────────
#  MEMÓRIA CONVERSACIONAL (SUPABASE)
# ─────────────────────────────────────────

def salvar_mensagem_chat_supabase(session_id: str, role: str, content: str):
    """Grava mensagem no histórico persistente da tabela n8n_chat_avb do Supabase."""
    try:
        sb = get_supabase()
        sb.table("n8n_chat_avb").insert({
            "session_id": session_id,
            "message": {
                "role": role,
                "content": content
            }
        }).execute()
    except Exception as e:
        print(f"⚠️ Erro ao salvar mensagem no Supabase: {e}")


def obter_historico_chat_supabase(session_id: str, limit: int = 8) -> list[dict]:
    """Recupera as últimas mensagens de conversa persistidas no Supabase."""
    try:
        sb = get_supabase()
        res = (
            sb.table("n8n_chat_avb")
            .select("message")
            .eq("session_id", session_id)
            .order("id", desc=True)
            .limit(limit)
            .execute()
        )
        if not res.data:
            return []
        
        # Inverte para manter ordem cronológica
        mensagens = [item["message"] for item in reversed(res.data) if "message" in item and item["message"]]
        return mensagens
    except Exception as e:
        print(f"⚠️ Erro ao obter histórico do Supabase: {e}")
        return []


# ─────────────────────────────────────────
#  FERRAMENTAS
# ─────────────────────────────────────────

def consultar_ferramenta(nome_ferramenta: str) -> dict:
    """
    Busca uma ferramenta pelo nome (busca parcial, case-insensitive).
    Retorna disponibilidade, quem está com ela e desde quando.
    """
    try:
        sb = get_supabase()
        response = (
            sb.table("ferramentas")
            .select("nome, quantidade, saiu, funcionario_emprestado, matricula, data_emprestado, status, tag")
            .ilike("nome", f"%{nome_ferramenta}%")
            .execute()
        )

        # Se não achou com o nome completo, tenta buscar por cada palavra relevante
        if not response.data:
            palavras = [p for p in nome_ferramenta.split() if len(p) > 3 and p.lower() not in ["para", "com", "sem", "jogo", "kit"]]
            for palavra in palavras:
                res_palavra = (
                    sb.table("ferramentas")
                    .select("nome, quantidade, saiu, funcionario_emprestado, matricula, data_emprestado, status, tag")
                    .ilike("nome", f"%{palavra}%")
                    .execute()
                )
                if res_palavra.data:
                    response = res_palavra
                    break

        if not response.data:
            return {
                "encontrado": False,
                "mensagem": f"Nenhuma ferramenta encontrada com o termo '{nome_ferramenta}'. Verifique o nome correto da ferramenta."
            }

        ferramenta = response.data[0]
        nome = ferramenta.get("nome", nome_ferramenta)
        saiu = ferramenta.get("saiu", 0)
        status = ferramenta.get("status", "")
        funcionario = ferramenta.get("funcionario_emprestado")
        matricula = ferramenta.get("matricula")
        data_emprestado = ferramenta.get("data_emprestado")

        # Considera emprestada se saiu > 0 ou status indica emprestado
        esta_emprestada = saiu > 0 or status in ("emprestado", "retirado", "emprestada")
        quantidade_total = int(ferramenta.get("quantidade") or 1)
        quantidade_disponivel = max(0, quantidade_total - saiu)

        if esta_emprestada and funcionario and quantidade_disponivel == 0:
            return {
                "encontrado": True,
                "disponivel": False,
                "nome": nome,
                "quantidade_total": quantidade_total,
                "quantidade_disponivel": 0,
                "funcionario": funcionario,
                "matricula": matricula,
                "data_emprestado": data_emprestado,
                "mensagem": (
                    f"A {nome} foi retirada por {funcionario} "
                    f"(matrícula: {matricula}) em {data_emprestado} "
                    f"e ainda não foi devolvida à ferramentaria (0 unidades disponíveis)."
                )
            }
        else:
            return {
                "encontrado": True,
                "disponivel": True,
                "nome": nome,
                "quantidade_total": quantidade_total,
                "quantidade_disponivel": quantidade_disponivel,
                "mensagem": f"A {nome} está disponível na ferramentaria. Temos {quantidade_disponivel} unidade(s) disponível(is)."
            }

    except Exception as e:
        print(f"❌ Erro ao consultar ferramenta '{nome_ferramenta}': {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar o banco de dados. Tente novamente."
        }


def consultar_material(nome_material: str) -> dict:
    """
    Busca um material no estoque pelo nome (busca parcial, case-insensitive).
    Calcula estoque atual = entrada - saida.
    """
    try:
        sb = get_supabase()
        response = (
            sb.table("materiais")
            .select("nome, entrada, saida, quantidade_minima, unidade, estoque_baixo")
            .ilike("nome", f"%{nome_material}%")
            .execute()
        )

        if not response.data:
            return {
                "encontrado": False,
                "mensagem": f"Nenhum material com o nome '{nome_material}' foi encontrado no estoque."
            }

        material = response.data[0]
        nome = material.get("nome", nome_material)
        entrada = material.get("entrada", 0)
        saida = material.get("saida", 0)
        estoque_atual = entrada - saida
        minimo = material.get("quantidade_minima", 0)
        unidade = material.get("unidade", "unidade(s)")
        estoque_baixo = material.get("estoque_baixo", False)

        if estoque_atual <= 0:
            return {
                "encontrado": True,
                "estoque": 0,
                "nome": nome,
                "mensagem": f"O estoque de {nome} está zerado. Não há unidades disponíveis."
            }

        aviso_minimo = ""
        if estoque_baixo or estoque_atual <= minimo:
            aviso_minimo = f" ⚠️ Estoque abaixo do mínimo (mínimo: {minimo} {unidade})."

        return {
            "encontrado": True,
            "estoque": estoque_atual,
            "nome": nome,
            "unidade": unidade,
            "mensagem": f"Temos {estoque_atual} {unidade} de {nome} no estoque.{aviso_minimo}"
        }

    except Exception as e:
        print(f"❌ Erro ao consultar material '{nome_material}': {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar o estoque. Tente novamente."
        }


def listar_ferramentas_funcionario(nome_funcionario: str, matricula: Optional[str] = None) -> dict:
    """
    Lista todas as ferramentas que um funcionário está com posse.
    """
    try:
        sb = get_supabase()

        # Busca ferramentas emprestadas para o funcionário
        query = (
            sb.table("ferramentas")
            .select("nome, tag, data_emprestado, status")
            .ilike("funcionario_emprestado", f"%{nome_funcionario}%")
        )

        if matricula:
            query = query.eq("matricula", matricula)

        response = query.execute()

        if not response.data:
            return {
                "encontrado": True,
                "ferramentas": [],
                "mensagem": f"{nome_funcionario} não possui nenhuma ferramenta retirada atualmente."
            }

        ferramentas = response.data
        lista = "\n".join(
            [f"- {f.get('nome')} (retirada em {f.get('data_emprestado', 'data não registrada')})"
             for f in ferramentas]
        )

        return {
            "encontrado": True,
            "ferramentas": ferramentas,
            "mensagem": f"{nome_funcionario} está com {len(ferramentas)} ferramenta(s):\n{lista}"
        }

    except Exception as e:
        print(f"❌ Erro ao listar ferramentas do funcionário '{nome_funcionario}': {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar. Tente novamente."
        }
