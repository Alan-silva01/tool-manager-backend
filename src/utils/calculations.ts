
import type { FuncionarioComFerramentas, Ferramenta, Material } from '@/types';

// Consolidar todas as funções de cálculo em um só lugar
export const calculateStats = (
  funcionariosComFerramentas: FuncionarioComFerramentas[],
  ferramentas: Ferramenta[],
  materiais: Material[]
) => {
  const totalFerramentasEmprestadas = funcionariosComFerramentas.reduce((total, func) => total + func.ferramentas.length, 0);
  const totalFuncionariosComFerramentas = funcionariosComFerramentas.length;
  const totalFerramentasCadastradas = ferramentas.length;
  
  // Calcular estoque baixo para materiais
  const materiaisEstoqueBaixo = materiais.filter(material => {
    const quantidadeDisponivel = material.entrada - material.saida;
    const quantidadeMinima = material.quantidade_minima;
    return quantidadeDisponivel <= quantidadeMinima;
  });
  
  // Calcular estoque baixo para ferramentas (quantidade disponível <= 2)
  const ferramentasEstoqueBaixo = ferramentas.filter(ferramenta => {
    const quantidadeDisponivel = ferramenta.quantidade;
    const quantidadeMinima = 2;
    return quantidadeDisponivel <= quantidadeMinima;
  });
  
  const itensEstoqueBaixo = materiaisEstoqueBaixo.length + ferramentasEstoqueBaixo.length;

  return {
    totalFerramentasEmprestadas,
    totalFuncionariosComFerramentas,
    totalFerramentasCadastradas,
    materiaisEstoqueBaixo,
    ferramentasEstoqueBaixo,
    itensEstoqueBaixo
  };
};
