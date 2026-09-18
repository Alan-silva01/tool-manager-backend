/**
 * Testes de spec — feature: carrinho-agrupamento
 * Rastreio: AC-014 · AC-015 · AC-016 · AC-017
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCarrinho } from '@/hooks/useCarrinho';

const materialItem = { id: 'm1', nome: 'Acetona', tag: '10099', quantidade: 17 };
const ferramentaItem1 = { id: 'f1', nome: 'Broca de aço rápido', tag: '00807253885', quantidade: 1 };
const ferramentaItem2 = { id: 'f2', nome: 'Martelete Bosch', tag: '00807253886', quantidade: 1 };

describe('carrinho-agrupamento — separação de materiais e ferramentas no carrinho', () => {

  it('AC-014: Seção de Materiais agrupa materiais com quantidade e controle @spec:AC-014', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialItem, 'material');
      result.current.updateCartQuantity('m1', 1, materialItem.quantidade);
    });

    const materiais = result.current.carrinho.filter(i => i.tipo === 'material');
    expect(materiais.length).toBe(1);
    expect(materiais[0].nome).toBe('Acetona');
    expect(materiais[0].quantidade).toBe(2);
  });

  it('AC-015: Seção de Ferramentas lista ferramentas como itens individuais @spec:AC-015', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(ferramentaItem1, 'ferramenta');
      result.current.addToCart(ferramentaItem2, 'ferramenta');
    });

    const ferramentas = result.current.carrinho.filter(i => i.tipo === 'ferramenta');
    expect(ferramentas.length).toBe(2);
    expect(ferramentas[0].nome).toBe('Broca de aço rápido');
    expect(ferramentas[0].quantidade).toBe(1);
    expect(ferramentas[1].nome).toBe('Martelete Bosch');
    expect(ferramentas[1].quantidade).toBe(1);
  });

  it('AC-016: Oculta categoria vazia quando há itens de apenas um tipo @spec:AC-016', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(ferramentaItem1, 'ferramenta');
    });

    const ferramentas = result.current.carrinho.filter(i => i.tipo === 'ferramenta');
    const materiais = result.current.carrinho.filter(i => i.tipo === 'material');

    expect(ferramentas.length).toBe(1);
    expect(materiais.length).toBe(0);
  });

  it('AC-017: Remoção de item atualiza dinamicamente o grupo correspondente @spec:AC-017', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(ferramentaItem1, 'ferramenta');
      result.current.addToCart(materialItem, 'material');
    });

    expect(result.current.carrinho.filter(i => i.tipo === 'ferramenta').length).toBe(1);
    expect(result.current.carrinho.filter(i => i.tipo === 'material').length).toBe(1);

    act(() => {
      result.current.removeFromCart('f1');
    });

    expect(result.current.carrinho.filter(i => i.tipo === 'ferramenta').length).toBe(0);
    expect(result.current.carrinho.filter(i => i.tipo === 'material').length).toBe(1);
  });

});
