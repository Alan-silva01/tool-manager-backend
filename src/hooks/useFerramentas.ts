
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
        const { data, error } = await supabase
          .from('ferramentas')
          .select('id, nome, tag, quantidade, categoria');

        console.log('Resposta do Supabase:', { data, error });

        if (error) {
          console.error('Erro ao buscar ferramentas:', error);
          return;
        }

        if (data) {
          console.log('Dados brutos:', data);
          const ferramentasFormatadas = data.map(ferramenta => ({
            id: ferramenta.id,
            nome: ferramenta.nome || '',
            tag: ferramenta.tag || '',
            quantidade: Number(ferramenta.quantidade) || 0,
            categoria: ferramenta.categoria || ''
          }));

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
