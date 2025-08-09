
import { useFuncionariosData } from './useFuncionariosData';
import { useFuncionariosActions } from './useFuncionariosActions';
import { useFuncionariosUtils } from './useFuncionariosUtils';

export const useFuncionarios = (refreshKey?: number) => {
  const { funcionarios, loading, setFuncionarios } = useFuncionariosData(refreshKey);
  const { adicionarFerramentaAoFuncionario, atualizarNumeroWhatsApp } = useFuncionariosActions(funcionarios, setFuncionarios);
  const { buscarFuncionario, buscarNomePorMatricula } = useFuncionariosUtils(funcionarios);

  console.log('Estado atual useFuncionarios:', { 
    totalFuncionarios: Object.keys(funcionarios).length, 
    loading,
    funcionarios: Object.keys(funcionarios)
  });

  return {
    funcionarios,
    loading,
    buscarFuncionario,
    buscarNomePorMatricula,
    adicionarFerramentaAoFuncionario,
    atualizarNumeroWhatsApp
  };
};
