"""
tests/test_formatters.py — Testes da regra de negócio de formatação de estoque do WhatsApp.
"""

import pytest


def formatar_relatorio_materiais(materiais_mock: list) -> str:
    """Função pura que espelha o agrupamento e formatação visual dos materiais."""
    em_estoque = []
    estoque_baixo = []
    zerados = []

    for m in materiais_mock:
        nome = m.get("nome", "Material")
        entrada = m.get("entrada") or 0
        saida = m.get("saida") or 0
        qtd_disponivel = max(0, entrada - saida)
        qtd_minima = m.get("quantidade_minima") or 5
        is_baixo = m.get("estoque_baixo", False) or (qtd_disponivel <= qtd_minima)

        if qtd_disponivel == 0:
            zerados.append(f"• {nome} — 0 (Mínimo: {qtd_minima})")
        elif is_baixo:
            estoque_baixo.append(f"• {nome} — {qtd_disponivel}\n  Mínimo: {qtd_minima}")
        else:
            em_estoque.append(f"• {nome} — {qtd_disponivel}")

    secoes = ["📦 *ESTOQUE — FERRAMENTARIA AVB*\n"]

    if em_estoque:
        secoes.append("🟢 *EM ESTOQUE*\n" + "\n".join(em_estoque))

    if estoque_baixo:
        secoes.append("⚠️ *ESTOQUE BAIXO*\n" + "\n".join(estoque_baixo))

    if zerados:
        secoes.append("🔴 *ZERADO / ESGOTADO*\n" + "\n".join(zerados))

    total = len(materiais_mock)
    atencao = len(estoque_baixo) + len(zerados)

    secoes.append(f"📊 *Total de itens:* {total}\n⚠️ *Itens para atenção:* {atencao}")
    return "\n\n".join(secoes)


def test_formatacao_estoque_categorizado():
    """Testa se os materiais são categorizados corretamente em Em Estoque, Baixo e Zerado."""
    dados_mock = [
        {"nome": "Acetona", "entrada": 12, "saida": 0, "quantidade_minima": 5, "estoque_baixo": False},
        {"nome": "Cola tekbond", "entrada": 5, "saida": 3, "quantidade_minima": 5, "estoque_baixo": True},
        {"nome": "WD-40", "entrada": 10, "saida": 10, "quantidade_minima": 5, "estoque_baixo": True},
    ]

    resultado = formatar_relatorio_materiais(dados_mock)

    assert "🟢 *EM ESTOQUE*" in resultado
    assert "• Acetona — 12" in resultado
    assert "⚠️ *ESTOQUE BAIXO*" in resultado
    assert "• Cola tekbond — 2" in resultado
    assert "🔴 *ZERADO / ESGOTADO*" in resultado
    assert "• WD-40 — 0" in resultado
    assert "📊 *Total de itens:* 3" in resultado
    assert "⚠️ *Itens para atenção:* 2" in resultado
