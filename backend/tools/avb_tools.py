from typing import List, Any

# Tools do Agente de IA da Ferramentaria AVB
# Usadas pelo agente para responder menções @agente no grupo do WhatsApp

TOOLS_AVB: List[Any] = [
    {
        "type": "function",
        "function": {
            "name": "consultar_ferramenta",
            "description": (
                "Consulta no banco de dados a disponibilidade e a QUANTIDADE de uma FERRAMENTA durável (ex: alicate, furadeira, chave, martelete, parafusadeira, trena, nível, etc). "
                "Use tanto para saber se está disponível quanto para saber a quantidade disponível ou quem está com ela."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "nome_ferramenta": {
                        "type": "string",
                        "description": "Nome da ferramenta a ser consultada (ex: 'alicate de pressão', 'furadeira', 'chave de fenda')"
                    }
                },
                "required": ["nome_ferramenta"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "consultar_material",
            "description": (
                "Consulta o estoque de um MATERIAL de consumo (ex: algodão, acetona, luva, parafuso, fita isolante, disco de corte). "
                "Use para saber a quantidade em estoque de insumos/materiais."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "nome_material": {
                        "type": "string",
                        "description": "Nome do material a ser consultado (ex: 'algodão', 'acetona', 'luva', 'disco')"
                    }
                },
                "required": ["nome_material"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "listar_ferramentas_funcionario",
            "description": (
                "Lista todas as ferramentas que um funcionário específico está com posse atualmente. "
                "Use quando alguém perguntar o que um funcionário tem em mãos."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "nome_funcionario": {
                        "type": "string",
                        "description": "Nome do funcionário para verificar suas ferramentas"
                    },
                    "matricula": {
                        "type": "string",
                        "description": "Matrícula do funcionário (opcional)"
                    }
                },
                "required": ["nome_funcionario"]
            }
        }
    }
]
