
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
        // Capitaliza a primeira letra da chave e do valor
        const chaveFormatada = chave.toLowerCase();
        const valorFormatado = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
        caracteristicas[chaveFormatada] = valorFormatado;
      }
    });

    console.log('Características processadas:', caracteristicas);
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
      console.log('=== INICIANDO CRIAÇÃO DE FERRAMENTA ===');
      console.log('Dados recebidos:', dados);

      // Formatar características para JSONB
      const caracteristicasFormatadas = formatCaracteristicas(dados.caracteristicas);
      
      console.log('Características formatadas:', caracteristicasFormatadas);

      // Dados para inserção - APENAS os campos permitidos pela tabela
      const dadosInsercao = {
        nome: dados.nome,
        tag: dados.tag,
        quantidade: dados.quantidade,
        categoria: dados.categoria,
        caracteristicas: caracteristicasFormatadas,
        saiu: 0,
        funcionario_emprestado: null,
        matricula: null,
        data_emprestado: null,
        reserva: false,
        matricula_reserva: null
      };

      console.log('=== DADOS FINAIS PARA INSERÇÃO ===');
      console.log(JSON.stringify(dadosInsercao, null, 2));

      const { data, error } = await supabase
        .from('ferramentas')
        .insert(dadosInsercao)
        .select();

      console.log('=== RESPOSTA DA API ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('=== ERRO DETALHADO ===');
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes:', error.details);
        console.error('Hint:', error.hint);
        console.error('Error completo:', JSON.stringify(error, null, 2));
        
        toast({
          title: "Erro",
          description: `Erro ao criar ferramenta: ${error.message}`,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log('=== SUCESSO ===');
      console.log('Ferramenta criada:', data);
      toast({
        title: "Sucesso",
        description: "Ferramenta criada com sucesso!",
      });
      
      return { success: true, data: data[0] };

    } catch (error) {
      console.error('=== ERRO INESPERADO ===');
      console.error('Tipo:', typeof error);
      console.error('Error:', error);
      console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
      
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
