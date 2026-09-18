/**
 * Testes de spec — feature: selecao-quantidade-lista
 * Rastreio: AC-013 · AC-008 · AC-009 · AC-010 · AC-011 · AC-012 · AC-013
 *
 * Testes unitários puros sem mocks usando @testing-library/react (renderHook).
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCarrinho } from '@/hooks/useCarrinho';

const materialComEstoque = { id: 'm1', nome: 'Detergente Neutro', tag: '10007', quantidade: 4 };

describe('selecao-quantidade-lista — controle de quantidade direto e hook useCarrinho', () => {

  it('AC-007: Item fora do carrinho inicia sem presença no carrinho @spec:AC-007', () => {
    const { result } = renderHook(() => useCarrinho());

    expect(result.current.isInCart('m1')).toBe(false);
    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(0);
  });

  it('AC-008: Ao adicionar o item, quantidade inicial no carrinho é 1 @spec:AC-008', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material');
    });

    expect(result.current.isInCart('m1')).toBe(true);
    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(1);
  });

  it('AC-009: Incrementa quantidade até o estoque disponível @spec:AC-009', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material');
    });

    act(() => {
      const ok = result.current.updateCartQuantity('m1', 1, materialComEstoque.quantidade);
      expect(ok).toBe(true);
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(2);

    act(() => {
      result.current.updateCartQuantity('m1', 1, materialComEstoque.quantidade);
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(3);
  });

  it('AC-010: Impede incremento além do estoque disponível @spec:AC-010', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material'); // qtd: 1
      result.current.updateCartQuantity('m1', 1, 4); // 2
      result.current.updateCartQuantity('m1', 1, 4); // 3
      result.current.updateCartQuantity('m1', 1, 4); // 4
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(4);

    // Tentar adicionar além do máximo (4)
    act(() => {
      const ok = result.current.updateCartQuantity('m1', 1, 4);
      expect(ok).toBe(false);
    });

    // Quantidade permanece travada em 4
    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(4);
  });

  it('AC-011: Decrementa quantidade quando maior que 1 @spec:AC-011', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material');
      result.current.updateCartQuantity('m1', 1, 4); // qtd: 2
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(2);

    act(() => {
      result.current.updateCartQuantity('m1', -1, 4);
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(1);
    expect(result.current.isInCart('m1')).toBe(true);
  });

  it('AC-012: Decrementar quando quantidade é 1 remove o item do carrinho @spec:AC-012', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material');
    });

    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(1);

    // Decrementar a partir de 1 remove o item do carrinho
    act(() => {
      result.current.updateCartQuantity('m1', -1, 4);
    });

    expect(result.current.isInCart('m1')).toBe(false);
    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(0);
    expect(result.current.carrinho.length).toBe(0);
  });

  it('AC-013: Quantidade é mantida isolada sem poluir estado visual @spec:AC-013', () => {
    const { result } = renderHook(() => useCarrinho());

    act(() => {
      result.current.addToCart(materialComEstoque, 'material');
    });

    // O hook fornece a quantidade exata para o seletor sem precisar de campos redundantes
    expect(result.current.getQuantidadeNoCarrinho('m1')).toBe(1);
  });
});
