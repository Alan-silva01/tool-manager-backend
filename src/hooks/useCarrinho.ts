import { useState, useRef } from "react";

export type CartItem = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  tipo: 'ferramenta' | 'material';
  reserva?: boolean;
  matricula_reserva?: string;
};

export type UseCarrinhoReturn = {
  carrinho: CartItem[];
  addToCart: (item: {
    id: string;
    nome: string;
    tag: string | number;
    quantidade: number;
    reserva?: boolean;
    matricula_reserva?: string;
  }, tipo: 'ferramenta' | 'material') => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number, quantidadeMaxima: number) => boolean;
  isInCart: (id: string) => boolean;
  getQuantidadeNoCarrinho: (id: string) => number;
  limparCarrinho: () => void;
  totalItens: number;
  mostrarFAB: (step: string) => boolean;
};

/**
 * Hook puro de gerenciamento do carrinho.
 * Sem dependências externas — 100% testável sem mocks.
 */
export function useCarrinho(): UseCarrinhoReturn {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const carrinhoRef = useRef<CartItem[]>(carrinho);
  carrinhoRef.current = carrinho;

  const addToCart = (
    item: { id: string; nome: string; tag: string | number; quantidade: number; reserva?: boolean; matricula_reserva?: string },
    tipo: 'ferramenta' | 'material'
  ) => {
    const jaEstaNoCarrinho = carrinho.some(c => c.id === item.id);
    if (jaEstaNoCarrinho) {
      removeFromCart(item.id);
      return;
    }
    const next = [...carrinhoRef.current, {
      id: item.id,
      nome: item.nome,
      tag: String(item.tag),
      quantidade: 1,
      tipo,
      reserva: item.reserva || false,
      matricula_reserva: item.matricula_reserva || '',
    }];
    carrinhoRef.current = next;
    setCarrinho(next);
  };

  const removeFromCart = (id: string) => {
    const next = carrinhoRef.current.filter(item => item.id !== id);
    carrinhoRef.current = next;
    setCarrinho(next);
  };

  /**
   * Atualiza a quantidade de um item no carrinho.
   * Se delta levar a quantidade a 0 ou menos, remove o item do carrinho.
   * Retorna false se o incremento foi bloqueado (limite de estoque atingido).
   */
  const updateCartQuantity = (id: string, delta: number, quantidadeMaxima: number): boolean => {
    const item = carrinhoRef.current.find(i => i.id === id);
    if (!item) return false;

    const n = item.quantidade + delta;
    if (n > quantidadeMaxima) {
      return false;
    }

    let next: CartItem[];
    if (n <= 0) {
      next = carrinhoRef.current.filter(i => i.id !== id);
    } else {
      next = carrinhoRef.current.map(i => i.id === id ? { ...i, quantidade: n } : i);
    }

    carrinhoRef.current = next;
    setCarrinho(next);
    return true;
  };

  const isInCart = (id: string) => carrinho.some(c => c.id === id);

  const getQuantidadeNoCarrinho = (id: string) =>
    carrinho.find(c => c.id === id)?.quantidade ?? 0;

  const limparCarrinho = () => {
    carrinhoRef.current = [];
    setCarrinho([]);
  };

  const totalItens = carrinho.length;

  /**
   * AC-001 / AC-004 / AC-005:
   * O botão flutuante (FAB) deve aparecer APENAS na tela de lista,
   * quando há ao menos 1 item no carrinho.
   */
  const mostrarFAB = (step: string) => step === 'lista' && carrinho.length > 0;

  return {
    carrinho,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    isInCart,
    getQuantidadeNoCarrinho,
    limparCarrinho,
    totalItens,
    mostrarFAB,
  };
}
