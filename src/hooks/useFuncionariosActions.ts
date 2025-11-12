
import { supabase } from '@/integrations/supabase/client';
import { formatWhatsAppForSave } from '@/utils/whatsappFormatter';
import type { Funcionario } from '@/types';

export const useFuncionariosActions = (
  funcionarios: Record<string, Funcionario>,
  setFuncionarios: React.Dispatch<React.SetStateAction<Record<string, Funcionario>>>
) => {
  const adicionarFerramentaAoFuncionario = async (matricula: string, tag: string) => {
    try {
      const funcionario = funcionarios[matricula];
      if (!funcionario) {
        console.error('Funcionário não encontrado para matrícula:', matricula);
        throw new Error('Funcionário não encontrado');
      }

      const novasPosseFerramenta = [...funcionario.posse_ferramentas, tag];

      const { error } = await supabase
        .from('funcionarios')
        .update({ posse_ferramentas: novasPosseFerramenta })
        .eq('matricula', parseInt(matricula));

      if (error) {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
      }

      // Atualizar o estado local
      setFuncionarios(prev => ({
        ...prev,
        [matricula]: {
          ...prev[matricula],
          posse_ferramentas: novasPosseFerramenta
        }
      }));

      return true;
    } catch (error) {
      console.error('Erro ao adicionar ferramenta ao funcionário:', error);
      return false;
    }
  };

  const atualizarNumeroWhatsApp = async (matricula: string, numeroWhatsApp: string) => {
    try {
      // Formata o número para salvar no banco
      const numeroFormatadoParaSalvar = formatWhatsAppForSave(numeroWhatsApp);

      const { error } = await supabase
        .from('funcionarios')
        .update({ numero_whatsapp: numeroFormatadoParaSalvar })
        .eq('matricula', parseInt(matricula));

      if (error) {
        console.error('Erro ao atualizar número WhatsApp:', error);
        throw error;
      }

      // Atualizar o estado local
      setFuncionarios(prev => ({
        ...prev,
        [matricula]: {
          ...prev[matricula],
          numero_whatsapp: numeroFormatadoParaSalvar
        }
      }));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar número WhatsApp:', error);
      return false;
    }
  };

  return {
    adicionarFerramentaAoFuncionario,
    atualizarNumeroWhatsApp
  };
};
