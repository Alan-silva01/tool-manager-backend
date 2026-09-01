from typing import Optional
from supabase import create_client, Client

from config import SUPABASE_URL, SUPABASE_KEY
from utils.logger import get_logger

logger = get_logger("supabase_avb")

_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
    """Retorna instância singleton do Supabase AVB."""
    global _supabase_client
    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL e SUPABASE_KEY devem estar configurados no .env")
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
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
        logger.warning(f"Erro ao salvar mensagem no Supabase: {e}")


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
        logger.warning(f"Erro ao obter histórico do Supabase: {e}")
        return []


# ─────────────────────────────────────────
#  FERRAMENTAS
# ─────────────────────────────────────────
# ─────────────────────────────────────────
#  AUXILIARES
# ─────────────────────────────────────────

def _obter_tags_funcionario(posse_raw) -> list[str]:
    """Normaliza o campo posse_ferramentas que pode vir como lista ou string JSON."""
    if not posse_raw:
        return []
    if isinstance(posse_raw, list):
        return [str(t) for t in posse_raw if t]
    if isinstance(posse_raw, str):
        try:
            import json
            parsed = json.loads(posse_raw)
            if isinstance(parsed, list):
                return [str(t) for t in parsed if t]
        except Exception:
            pass
    return []


# ─────────────────────────────────────────
#  FERRAMENTAS
# ─────────────────────────────────────────

def consultar_ferramenta(nome_ferramenta: str) -> dict:
    """
    Busca uma ferramenta pelo nome (busca parcial, case-insensitive).
    Verifica no cadastro de ferramentas e cruza com a posse_ferramentas dos funcionários.
    """
    try:
        sb = get_supabase()
        termo = nome_ferramenta.strip()
        response = (
            sb.table("ferramentas")
            .select("tag, nome, quantidade, status")
            .ilike("nome", f"%{termo}%")
            .execute()
        )

        # Se não achou com o nome completo, tenta buscar por cada palavra relevante
        if not response.data:
            palavras = [p for p in termo.split() if len(p) > 3 and p.lower() not in ["para", "com", "sem", "jogo", "kit", "das", "dos", "uma", "uns"]]
            for palavra in palavras:
                res_palavra = (
                    sb.table("ferramentas")
                    .select("tag, nome, quantidade, status")
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

        ferramentas_encontradas = response.data

        # Busca todos os funcionários que possuem alguma ferramenta em posse
        res_funcs = (
            sb.table("funcionarios")
            .select("nome, matricula, setor, posse_ferramentas")
            .not_.is_("posse_ferramentas", "null")
            .execute()
        )

        # Mapeia qual tag está com qual funcionário
        tag_para_funcionario = {}
        for func in (res_funcs.data or []):
            tags_func = _obter_tags_funcionario(func.get("posse_ferramentas"))
            for t in tags_func:
                tag_para_funcionario[t] = {
                    "nome": func.get("nome"),
                    "matricula": func.get("matricula"),
                    "setor": func.get("setor")
                }

        # Analisa cada ferramenta encontrada
        emprestadas = []
        disponiveis = []

        for f in ferramentas_encontradas:
            tag = f.get("tag")
            nome = f.get("nome")
            if tag in tag_para_funcionario:
                func_info = tag_para_funcionario[tag]
                emprestadas.append({
                    "nome": nome,
                    "tag": tag,
                    "funcionario": func_info["nome"],
                    "matricula": func_info["matricula"]
                })
            else:
                disponiveis.append(f)

        if emprestadas and not disponiveis:
            detalhes = "\n".join([f"- {e['nome']} (tag: {e['tag']}): em posse de *{e['funcionario']}* (matrícula: {e['matricula']})" for e in emprestadas])
            return {
                "encontrado": True,
                "disponivel": False,
                "mensagem": f"A(s) ferramenta(s) solicitada(s) está(ão) emprestada(s) no momento:\n{detalhes}"
            }
        elif emprestadas and disponiveis:
            detalhes_emp = "\n".join([f"- {e['nome']} (tag: {e['tag']}): com *{e['funcionario']}* (matrícula: {e['matricula']})" for e in emprestadas])
            return {
                "encontrado": True,
                "disponivel": True,
                "mensagem": f"Temos {len(disponiveis)} unidade(s) disponível(is) na ferramentaria.\n\n⚠️ Emprestada(s) no momento:\n{detalhes_emp}"
            }
        else:
            primeiro_nome = ferramentas_encontradas[0].get("nome", nome_ferramenta)
            return {
                "encontrado": True,
                "disponivel": True,
                "mensagem": f"A *{primeiro_nome}* está disponível na ferramentaria ({len(disponiveis)} unidade(s)). Nenhuma está emprestada no momento."
            }

    except Exception as e:
        logger.error(f"Erro ao consultar ferramenta '{nome_ferramenta}': {e}")
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
                "mensagem": f"O estoque de *{nome}* está zerado. Não há unidades disponíveis."
            }

        aviso_minimo = ""
        if estoque_baixo or estoque_atual <= minimo:
            aviso_minimo = f" ⚠️ Estoque abaixo do mínimo (mínimo: {minimo} {unidade})."

        return {
            "encontrado": True,
            "estoque": estoque_atual,
            "nome": nome,
            "unidade": unidade,
            "mensagem": f"Temos *{estoque_atual} {unidade}* de *{nome}* no estoque.{aviso_minimo}"
        }

    except Exception as e:
        logger.error(f"Erro ao consultar material '{nome_material}': {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar o estoque. Tente novamente."
        }


def listar_ferramentas_funcionario(nome_funcionario: str, matricula: Optional[str] = None) -> dict:
    """
    Lista todas as ferramentas que um funcionário está com posse consultando posse_ferramentas na tabela funcionarios.
    """
    try:
        sb = get_supabase()
        query = sb.table("funcionarios").select("id, nome, matricula, setor, posse_ferramentas, numero_whatsapp")
        
        if matricula:
            res_func = query.eq("matricula", matricula).execute()
        else:
            res_func = query.ilike("nome", f"%{nome_funcionario.strip()}%").execute()
            if not res_func.data:
                # Tenta pelo primeiro nome se o usuário digitou só 'alan' ou similar
                primeiro_nome = nome_funcionario.strip().split()[0]
                if len(primeiro_nome) >= 3:
                    res_func = sb.table("funcionarios").select("id, nome, matricula, setor, posse_ferramentas, numero_whatsapp").ilike("nome", f"%{primeiro_nome}%").execute()

        if not res_func.data:
            return {
                "encontrado": False,
                "mensagem": f"Funcionário '{nome_funcionario}' não foi encontrado no cadastro."
            }

        funcionario = res_func.data[0]
        nome_completo = funcionario.get("nome", nome_funcionario)
        mat = funcionario.get("matricula", "")
        tags = _obter_tags_funcionario(funcionario.get("posse_ferramentas"))

        if not tags:
            return {
                "encontrado": True,
                "ferramentas": [],
                "mensagem": f"O colaborador *{nome_completo}* (matrícula: {mat}) não possui nenhuma ferramenta em posse no momento."
            }

        # Busca os nomes das ferramentas pelas tags
        res_ferramentas = sb.table("ferramentas").select("tag, nome, status").in_("tag", tags).execute()
        ferramentas_map = {f["tag"]: f.get("nome", "Ferramenta") for f in (res_ferramentas.data or [])}

        itens = [f"- {ferramentas_map.get(tag, 'Ferramenta')} (tag: `{tag}`)" for tag in tags]
        lista_str = "\n".join(itens)

        return {
            "encontrado": True,
            "ferramentas": [{"tag": t, "nome": ferramentas_map.get(t, "Ferramenta")} for t in tags],
            "mensagem": f"*{nome_completo}* (matrícula: {mat}) está atualmente em posse de {len(tags)} ferramenta(s):\n{lista_str}"
        }

    except Exception as e:
        logger.error(f"Erro ao listar ferramentas do funcionário '{nome_funcionario}': {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar as ferramentas do funcionário."
        }


def listar_todas_ferramentas() -> dict:
    """
    Lista todas as ferramentas cadastradas na ferramentaria com Tag, Nome, Quantidade e Status de disponibilidade.
    """
    try:
        sb = get_supabase()
        
        # 1. Busca todas as ferramentas cadastradas
        res_ferramentas = sb.table("ferramentas").select("tag, nome, quantidade, status").order("nome").execute()
        ferramentas = res_ferramentas.data or []
        
        if not ferramentas:
            return {
                "encontrado": False,
                "mensagem": "Não há ferramentas cadastradas no sistema no momento."
            }
            
        # 2. Busca todos os funcionários com posse de ferramentas
        res_funcs = (
            sb.table("funcionarios")
            .select("nome, matricula, posse_ferramentas")
            .not_.is_("posse_ferramentas", "null")
            .execute()
        )
        
        tag_para_funcionario = {}
        for func in (res_funcs.data or []):
            tags_func = _obter_tags_funcionario(func.get("posse_ferramentas"))
            for t in tags_func:
                tag_para_funcionario[t] = {
                    "nome": func.get("nome"),
                    "matricula": func.get("matricula")
                }
                
        total_cadastradas = len(ferramentas)
        total_emprestadas = 0
        linhas = []
        
        for f in ferramentas:
            tag = f.get("tag", "S/TAG")
            nome = f.get("nome", "Sem Nome")
            qtd = f.get("quantidade", 1)
            
            if tag in tag_para_funcionario:
                total_emprestadas += 1
                func_info = tag_para_funcionario[tag]
                status_str = f"🔴 *Emprestada* ({func_info['nome']} - #{func_info['matricula']})"
            else:
                status_str = f"🟢 *Disponível* (Qtd: {qtd})"
                
            linhas.append(f"🔧 *{nome}*\n🏷️ Tag: `{tag}` | {status_str}")
            
        total_disponiveis = total_cadastradas - total_emprestadas
        resumo_header = (
            f"📋 *CATÁLOGO DE FERRAMENTAS — Ferramentaria AVB*\n\n"
            f"📊 *Total:* {total_cadastradas} itens | 🟢 Disponíveis: {total_disponiveis} | 🔴 Emprestadas: {total_emprestadas}\n"
            f"────────────────────────────"
        )
        
        corpo = "\n\n".join(linhas)
        mensagem_final = f"{resumo_header}\n\n{corpo}"
        
        return {
            "encontrado": True,
            "total": total_cadastradas,
            "disponiveis": total_disponiveis,
            "emprestadas": total_emprestadas,
            "mensagem": mensagem_final
        }
        
    except Exception as e:
        logger.error(f"Erro ao listar todas as ferramentas: {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar as ferramentas no banco de dados."
        }


def listar_todos_materiais() -> dict:
    """
    Lista todos os materiais de consumo cadastrados organizados por status (Em Estoque, Estoque Baixo, Zerado).
    """
    try:
        sb = get_supabase()
        res_mat = sb.table("materiais").select("nome, entrada, saida, unidade, quantidade_minima, estoque_baixo").order("nome").execute()
        materiais = res_mat.data or []
        
        if not materiais:
            return {
                "encontrado": False,
                "mensagem": "Não há materiais de consumo cadastrados no estoque."
            }
            
        em_estoque = []
        estoque_baixo = []
        zerados = []
        
        for m in materiais:
            nome = m.get("nome", "Material").strip()
            entrada = m.get("entrada", 0) or 0
            saida = m.get("saida", 0) or 0
            estoque = max(0, entrada - saida)
            minimo = m.get("quantidade_minima", 0) or 0
            is_baixo = m.get("estoque_baixo", False)
            
            if estoque == 0:
                zerados.append({
                    "nome": nome,
                    "minimo": minimo
                })
            elif is_baixo or (minimo > 0 and estoque <= minimo):
                estoque_baixo.append({
                    "nome": nome,
                    "estoque": estoque,
                    "minimo": minimo
                })
            else:
                em_estoque.append({
                    "nome": nome,
                    "estoque": estoque
                })
                
        secoes = ["📦 *ESTOQUE — FERRAMENTARIA AVB*\n"]
        
        if em_estoque:
            secoes.append("🟢 *EM ESTOQUE*")
            for item in em_estoque:
                secoes.append(f"• {item['nome']} — {item['estoque']}")
                
        if estoque_baixo:
            secoes.append("\n⚠️ *ESTOQUE BAIXO*")
            for item in estoque_baixo:
                secoes.append(f"• {item['nome']} — {item['estoque']}\n  Mínimo: {item['minimo']}")
                
        if zerados:
            secoes.append("\n🔴 *ZERADO / ESGOTADO*")
            for item in zerados:
                secoes.append(f"• {item['nome']} — 0\n  Mínimo: {item['minimo']}")
                
        total_itens = len(materiais)
        total_atencao = len(estoque_baixo) + len(zerados)
        
        secoes.append(f"\n📊 *Total de itens:* {total_itens}")
        if total_atencao > 0:
            secoes.append(f"⚠️ *Itens para atenção:* {total_atencao}")
            
        mensagem_final = "\n".join(secoes)
        
        return {
            "encontrado": True,
            "total": total_itens,
            "atencao": total_atencao,
            "mensagem": mensagem_final
        }
    except Exception as e:
        logger.error(f"Erro ao listar todos os materiais: {e}")
        return {
            "encontrado": False,
            "mensagem": "Ocorreu um erro ao consultar o estoque de materiais."
        }


