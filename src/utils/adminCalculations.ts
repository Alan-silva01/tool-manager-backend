
import type { FuncionarioComFerramentas, Ferramenta, Material, AdminStats } from '@/types';

export const calculateAdminStats = (
  funcionariosComFerramentas: FuncionarioComFerramentas[],
  ferramentas: Ferramenta[],
  materiais: Material[]
): AdminStats => {
  // Calcular estatísticas
  const totalFerramentasEmprestadas = funcionariosComFerramentas.reduce((total, func) => total + func.ferramentas.length, 0);
  const totalFuncionariosComFerramentas = funcionariosComFerramentas.length;
  const totalFerramentasCadastradas = ferramentas.length;
  
  // Calcular estoque baixo CORRETAMENTE - quantidade disponível = entrada - saída
  const materiaisEstoqueBaixo = materiais.filter(material => {
    const quantidadeDisponivel = material.entrada - material.saida;
    const quantidadeMinima = material.quantidade_minima;
    console.log(`Material ${material.nome}: entrada=${material.entrada}, saida=${material.saida}, disponível=${quantidadeDisponivel}, mínima=${quantidadeMinima}, baixo=${quantidadeDisponivel <= quantidadeMinima}`);
    return quantidadeDisponivel <= quantidadeMinima;
  });
  
  // Para ferramentas, considerar estoque baixo quando quantidade disponível <= 2
  const ferramentasEstoqueBaixo = ferramentas.filter(ferramenta => {
    const quantidadeDisponivel = ferramenta.quantidade; // Já calculado no hook
    const quantidadeMinima = 2; // Quantidade mínima padrão para ferramentas
    console.log(`Ferramenta ${ferramenta.nome}: disponível=${quantidadeDisponivel}, mínima=${quantidadeMinima}, baixo=${quantidadeDisponivel <= quantidadeMinima}`);
    return quantidadeDisponivel <= quantidadeMinima;
  });
  
  const itensEstoqueBaixo = materiaisEstoqueBaixo.length + ferramentasEstoqueBaixo.length;
  
  console.log('Materiais com estoque baixo:', materiaisEstoqueBaixo);
  console.log('Ferramentas com estoque baixo:', ferramentasEstoqueBaixo);
  console.log('Total itens com estoque baixo:', itensEstoqueBaixo);

  return {
    totalFerramentasEmprestadas,
    totalFuncionariosComFerramentas,
    totalFerramentasCadastradas,
    materiaisEstoqueBaixo,
    ferramentasEstoqueBaixo,
    itensEstoqueBaixo
  };
};
