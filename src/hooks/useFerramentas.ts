
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
        const { data, error } = await supabase
          .from('ferramentas')
          .select('id, nome, tag, quantidade, categoria');

        if (error) {
          console.error('Erro ao buscar ferramentas:', error);
          return;
        }

        if (data) {
          const ferramentasFormatadas = data.map(ferramenta => ({
            id: ferramenta.id,
            nome: ferramenta.nome || '',
            tag: ferramenta.tag || '',
            quantidade: Number(ferramenta.quantidade) || 0,
            categoria: ferramenta.categoria || ''
          }));

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

  return {
    ferramentas,
    loading
  };
};
