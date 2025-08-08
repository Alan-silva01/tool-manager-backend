
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CadastroFerramentaData {
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: string;
}

export const useCadastroFerramenta = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Função para converter texto de características para JSON
  const parseCaracteristicas = (caracteristicasTexto: string) => {
    try {
      if (!caracteristicasTexto.trim()) {
        return {};
      }

      // Remove espaços extras e divide por vírgulas
      const pares = caracteristicasTexto.split(',').map(item => item.trim());
      const caracteristicasObj: { [key: string]: string } = {};

      pares.forEach(par => {
        const [chave, valor] = par.split(':').map(item => item.trim());
        if (chave && valor) {
          // Capitaliza a primeira letra do valor se for uma palavra
          const valorFormatado = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
          caracteristicasObj[chave.toLowerCase()] = valorFormatado;
        }
      });

      console.log('Características parseadas:', caracteristicasObj);
      return caracteristicasObj;
    } catch (error) {
      console.error('Erro ao parsear características:', error);
      return {};
    }
  };

  const cadastrarFerramenta = async (data: CadastroFerramentaData) => {
    setLoading(true);
    
    try {
      console.log('Iniciando cadastro de ferramenta:', data);

      // Parse das características
      const caracteristicasJson = parseCaracteristicas(data.caracteristicas);

      // Dados para inserção com valores padrão
      const dadosInsercao = {
        nome: data.nome,
        tag: data.tag,
        quantidade: data.quantidade,
        categoria: data.categoria,
        caracteristicas: caracteristicasJson,
        saiu: 0,
        funcionario_emprestado: null,
        matricula: null,
        data_emprestado: null,
        status: 'Disponível',
        reserva: false,
        matricula_reserva: null
      };

      console.log('Dados para inserção:', dadosInsercao);

      const { data: ferramenta, error } = await supabase
        .from('ferramentas')
        .insert([dadosInsercao])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível cadastrar a ferramenta. Verifique se a tag não está duplicada.",
          variant: "destructive",
        });
        return null;
      }

      console.log('Ferramenta cadastrada com sucesso:', ferramenta);
      
      toast({
        title: "Sucesso",
        description: "Ferramenta cadastrada com sucesso!",
      });

      return ferramenta;
    } catch (error) {
      console.error('Erro inesperado ao cadastrar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao cadastrar a ferramenta.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cadastrarFerramenta,
    loading,
    parseCaracteristicas
  };
};
