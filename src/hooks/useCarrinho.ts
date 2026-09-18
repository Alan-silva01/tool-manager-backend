import { useState } from "react";

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

  const addToCart = (
    item: { id: string; nome: string; tag: string | number; quantidade: number; reserva?: boolean; matricula_reserva?: string },
    tipo: 'ferramenta' | 'material'
  ) => {
    const jaEstaNoCarrinho = carrinho.some(c => c.id === item.id);
    if (jaEstaNoCarrinho) {
      removeFromCart(item.id);
      return;
    }
    setCarrinho(prev => [...prev, {
      id: item.id,
      nome: item.nome,
      tag: String(item.tag),
      quantidade: 1,
      tipo,
      reserva: item.reserva || false,
      matricula_reserva: item.matricula_reserva || '',
    }]);
  };

  const removeFromCart = (id: string) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Atualiza a quantidade de um item no carrinho.
   * Retorna false se a atualização foi bloqueada (limite atingido ou quantidade < 1).
   */
  const updateCartQuantity = (id: string, delta: number, quantidadeMaxima: number): boolean => {
    let bloqueado = false;
    setCarrinho(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nova = item.quantidade + delta;
      if (nova < 1 || nova > quantidadeMaxima) {
        bloqueado = true;
        return item;
      }
      return { ...item, quantidade: nova };
    }));
    return !bloqueado;
  };

  const isInCart = (id: string) => carrinho.some(c => c.id === id);

  const getQuantidadeNoCarrinho = (id: string) =>
    carrinho.find(c => c.id === id)?.quantidade ?? 0;

  const limparCarrinho = () => setCarrinho([]);

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
