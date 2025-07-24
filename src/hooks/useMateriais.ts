
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Material = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  quantidade_minima: number;
  entrada: number;
  saida: number;
  data_entrada_estoque: string;
  unidade: string;
};

export const useMateriais = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const { data, error } = await supabase
          .from('materiais')
          .select('*');

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          return;
        }

        if (data) {
          const materiaisFormatados = data.map(material => ({
            id: material.id,
            nome: material.nome || '',
            tag: material.tag?.toString() || '',
            quantidade: Number(material.entrada) || 0,
            quantidade_minima: Number(material.quantidade_minima) || 0,
            entrada: Number(material.entrada) || 0,
            saida: Number(material.saida) || 0,
            data_entrada_estoque: material.data_entrada_estoque || '',
            unidade: 'un' // Valor padrão, pode ser ajustado conforme necessário
          }));

          setMateriais(materiaisFormatados);
        }
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriais();
  }, []);

  return {
    materiais,
    loading
  };
};
