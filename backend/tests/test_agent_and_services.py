"""
tests/test_agent_and_services.py — Testes unitários com Mocks para o Agente de IA e Serviços.
Testa o fluxo de chamada de tools e respostas sem consumir API da OpenAI nem alterar o Supabase real.
"""

import pytest
from unittest.mock import MagicMock, patch
import json

from agents.avb_agent import executar_tool, processar_mensagem_grupo
from services.supabase_avb import _obter_tags_funcionario


# ─── 1. Testes de Utilitários e Normalização ───────────────────

def test_obter_tags_funcionario_com_lista():
    """Testa se tags já em formato de lista são tratadas corretamente."""
    tags = ["TAG-001", "TAG-002"]
    resultado = _obter_tags_funcionario(tags)
    assert resultado == ["TAG-001", "TAG-002"]


def test_obter_tags_funcionario_com_json_string():
    """Testa se tags salvas como string JSON são convertidas para lista."""
    tags_json = '["TAG-100", "TAG-200"]'
    resultado = _obter_tags_funcionario(tags_json)
    assert resultado == ["TAG-100", "TAG-200"]


def test_obter_tags_funcionario_vazio_ou_nulo():
    """Testa tratamento para valores nulos ou vazios."""
    assert _obter_tags_funcionario(None) == []
    assert _obter_tags_funcionario("") == []
    assert _obter_tags_funcionario("invalid json string") == []


# ─── 2. Testes de Execução Direta de Tools ──────────────────────

@patch("agents.avb_agent.consultar_ferramenta")
def test_executar_tool_consultar_ferramenta(mock_consultar):
    mock_consultar.return_value = {"encontrado": True, "disponivel": True, "mensagem": "Furadeira disponível"}
    
    resultado = executar_tool("consultar_ferramenta", {"nome_ferramenta": "furadeira"})
    assert resultado["encontrado"] is True
    assert "Furadeira disponível" in resultado["mensagem"]
    mock_consultar.assert_called_once_with("furadeira")


@patch("agents.avb_agent.consultar_material")
def test_executar_tool_consultar_material(mock_consultar_mat):
    mock_consultar_mat.return_value = {"encontrado": True, "estoque": 10, "mensagem": "10 luvas em estoque"}
    
    resultado = executar_tool("consultar_material", {"nome_material": "luva"})
    assert resultado["encontrado"] is True
    assert resultado["estoque"] == 10
    mock_consultar_mat.assert_called_once_with("luva")


def test_executar_tool_desconhecida():
    resultado = executar_tool("tool_inexistente_xyz", {})
    assert "erro" in resultado
    assert "não reconhecida" in resultado["erro"]


# ─── 3. Teste do Fluxo Completo do Agente IA com Mock OpenAI ───

@pytest.mark.asyncio
@patch("agents.avb_agent.get_openai_client")
@patch("agents.avb_agent.obter_historico", return_value=[])
@patch("agents.avb_agent.salvar_historico")
async def test_processar_mensagem_grupo_com_chamada_de_tool(mock_salvar, mock_hist, mock_get_client):
    """
    Testa se o agente recebe uma menção, identifica a chamada de tool da OpenAI,
    executa a tool e devolve a resposta final consolidada.
    """
    mock_client = MagicMock()
    mock_get_client.return_value = mock_client

    # 1ª resposta da OpenAI: Decide chamar a tool 'consultar_ferramenta'
    mock_tool_call = MagicMock()
    mock_tool_call.id = "call_abc123"
    mock_tool_call.function.name = "consultar_ferramenta"
    mock_tool_call.function.arguments = json.dumps({"nome_ferramenta": "alicate"})

    first_choice_message = MagicMock()
    first_choice_message.tool_calls = [mock_tool_call]
    first_choice_message.content = None

    first_response = MagicMock()
    first_response.choices = [MagicMock(message=first_choice_message)]

    # 2ª resposta da OpenAI: Recebe o resultado da tool e formata a resposta final
    final_choice_message = MagicMock()
    final_choice_message.content = "O alicate está disponível na ferramentaria com 2 unidades."
    
    final_response = MagicMock()
    final_response.choices = [MagicMock(message=final_choice_message)]

    # Configura as 2 chamadas sequenciais
    mock_client.chat.completions.create.side_effect = [first_response, final_response]

    with patch("agents.avb_agent.executar_tool") as mock_exec:
        mock_exec.return_value = {"encontrado": True, "disponivel": True, "mensagem": "Disponível"}

        resposta = await processar_mensagem_grupo(
            remetente_nome="João Silva",
            texto_mensagem="Tem alicate?",
            grupo_jid="120363429173808883@g.us"
        )

        assert "alicate está disponível" in resposta
        mock_exec.assert_called_once_with("consultar_ferramenta", {"nome_ferramenta": "alicate"})
