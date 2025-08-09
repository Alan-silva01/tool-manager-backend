
import { formatWhatsAppForDisplay } from '@/utils/whatsappFormatter';
import type { Funcionario } from '@/types';

export const useFuncionariosUtils = (funcionarios: Record<string, Funcionario>) => {
  const buscarFuncionario = (matricula: string) => {
    console.log('Buscando funcionário com matrícula:', matricula);
    console.log('Funcionários disponíveis:', Object.keys(funcionarios));
    
    const funcionario = funcionarios[matricula] || null;
    console.log('Funcionário encontrado:', funcionario);
    
    // Se encontrou funcionário, formata o WhatsApp para exibição
    if (funcionario) {
      return {
        ...funcionario,
        numero_whatsapp: formatWhatsAppForDisplay(funcionario.numero_whatsapp)
      };
    }
    
    return funcionario;
  };

  const buscarNomePorMatricula = (matricula: string) => {
    const funcionario = funcionarios[matricula];
    if (!funcionario) return null;
    
    // Retornar apenas os dois primeiros nomes
    const nomes = funcionario.nome.split(' ');
    return nomes.slice(0, 2).join(' ');
  };

  return {
    buscarFuncionario,
    buscarNomePorMatricula
  };
};
