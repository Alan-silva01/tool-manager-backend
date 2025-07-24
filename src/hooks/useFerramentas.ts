
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Ferramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
};

export const useFerramentas = () => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        console.log('Buscando ferramentas...');
        
        // Primeiro, vamos verificar se há dados na tabela
        const { count, error: countError } = await supabase
          .from('ferramentas')
          .select('*', { count: 'exact', head: true });
        
        console.log('Total de ferramentas na tabela:', count);
        
        if (countError) {
          console.error('Erro ao contar ferramentas:', countError);
        }

        const { data, error } = await supabase
          .from('ferramentas')
          .select('id, nome, tag, quantidade, saiu, categoria');

        console.log('Resposta do Supabase:', { data, error });

        if (error) {
          console.error('Erro ao buscar ferramentas:', error);
          return;
        }

        if (data) {
          console.log('Dados brutos:', data);
          console.log('Quantidade de ferramentas encontradas:', data.length);
          
          const ferramentasFormatadas = data.map(ferramenta => {
            const quantidadeTotal = Number(ferramenta.quantidade) || 0;
            const quantidadeSaiu = Number(ferramenta.saiu) || 0;
            const quantidadeDisponivel = quantidadeTotal - quantidadeSaiu;
            
            console.log(`${ferramenta.nome}: total=${quantidadeTotal}, saiu=${quantidadeSaiu}, disponível=${quantidadeDisponivel}`);
            
            return {
              id: ferramenta.id,
              nome: ferramenta.nome || '',
              tag: ferramenta.tag || '',
              quantidade: quantidadeDisponivel,
              categoria: ferramenta.categoria || ''
            };
          });

          console.log('Ferramentas formatadas:', ferramentasFormatadas);
          setFerramentas(ferramentasFormatadas);
        }
      } catch (error) {
        console.error('Erro ao carregar ferramentas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFerramentas();
  }, []);

  console.log('Estado atual - ferramentas:', ferramentas, 'loading:', loading);

  return {
    ferramentas,
    loading
  };
};
