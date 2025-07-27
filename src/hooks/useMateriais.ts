
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Material = {
  id: string;
  nome: string;
  tag: string;
  entrada: number;
  quantidade_minima: number;
  data_entrada_estoque: string;
  saida: number;
  unidade: string;
};

export const useMateriais = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMateriais = async () => {
    try {
      console.log('Buscando materiais...');
      
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('nome');

      console.log('Resposta do Supabase materiais:', { data, error });

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        return;
      }

      if (data) {
        console.log('Materiais encontrados:', data.length);
        
        const materiaisFormatados = data.map(material => ({
          id: material.id,
          nome: material.nome || '',
          tag: material.tag?.toString() || '',
          entrada: Number(material.entrada) || 0,
          quantidade_minima: Number(material.quantidade_minima) || 0,
          data_entrada_estoque: material.data_entrada_estoque || '',
          saida: Number(material.saida) || 0,
          unidade: material.unidade || 'un'
        }));

        console.log('Materiais formatados:', materiaisFormatados);
        setMateriais(materiaisFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  console.log('Estado atual - materiais:', materiais, 'loading:', loading);

  return {
    materiais,
    loading,
    refetch: fetchMateriais
  };
};
