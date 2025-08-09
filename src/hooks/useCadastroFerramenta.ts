
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCadastroFerramenta = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCaracteristicas = (caracteristicasText: string): Record<string, string> => {
    if (!caracteristicasText.trim()) {
      return {}; // Retorna objeto vazio se não houver características
    }

    const caracteristicas: Record<string, string> = {};
    
    // Divide por vírgula e processa cada par chave:valor
    const pares = caracteristicasText.split(',');
    
    pares.forEach(par => {
      const [chave, valor] = par.split(':').map(item => item.trim());
      if (chave && valor) {
        // Capitaliza a primeira letra do valor se for texto
        const valorFormatado = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
        caracteristicas[chave.toLowerCase()] = valorFormatado;
      }
    });

    return caracteristicas;
  };

  const criarFerramenta = async (dados: {
    nome: string;
    tag: string;
    quantidade: number;
    categoria: string;
    caracteristicas: string;
  }) => {
    setLoading(true);
    
    try {
      console.log('Criando nova ferramenta:', dados);

      // Formatar características para JSONB (permite objeto vazio)
      const caracteristicasFormatadas = formatCaracteristicas(dados.caracteristicas);
      
      console.log('Características formatadas:', caracteristicasFormatadas);

      // Dados para inserção com valores padrão obrigatórios
      const dadosInsercao = {
        nome: dados.nome,
        tag: dados.tag,
        quantidade: dados.quantidade,
        categoria: dados.categoria,
        caracteristicas: caracteristicasFormatadas, // Pode ser {} se vazio
        saiu: 0, // Valor padrão
        funcionario_emprestado: null,
        matricula: null,
        data_emprestado: null,
        status: 'disponivel',
        reserva: false,
        matricula_reserva: null
      };

      console.log('Dados para inserção:', dadosInsercao);

      const { data, error } = await supabase
        .from('ferramentas')
        .insert(dadosInsercao)
        .select();

      if (error) {
        console.error('Erro ao criar ferramenta:', error);
        toast({
          title: "Erro",
          description: `Erro ao criar ferramenta: ${error.message}`,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('Ferramenta criada com sucesso:', data);
      toast({
        title: "Sucesso",
        description: "Ferramenta criada com sucesso!",
      });
      
      return { success: true, data: data[0] };

    } catch (error) {
      console.error('Erro inesperado ao criar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar ferramenta",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    criarFerramenta,
    loading,
    formatCaracteristicas
  };
};
