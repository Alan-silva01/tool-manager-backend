
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Material } from '@/types';

export const useMateriais = (refreshKey?: number) => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchMateriais = async () => {
      try {
        const { data, error } = await supabase
          .from('materiais')
          .select('id, nome, tag, entrada, saida, quantidade_minima, data_entrada_estoque, unidade')
          .abortSignal(controller.signal);

        if (error) throw error;

        if (data && mounted) {
          const materiaisFormatados = data.map(material => ({
            id: material.id,
            nome: material.nome || '',
            tag: material.tag?.toString() || '',
            quantidade: Number(material.entrada || 0) - Number(material.saida || 0),
            quantidade_minima: Number(material.quantidade_minima) || 0,
            entrada: Number(material.entrada) || 0,
            saida: Number(material.saida) || 0,
            data_entrada_estoque: material.data_entrada_estoque || '',
            unidade: material.unidade || 'un'
          }));

          setMateriais(materiaisFormatados);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao carregar materiais:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMateriais();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [refreshKey]);

  // Memoizar resultado para evitar recálculos
  const memoizedResult = useMemo(() => ({
    materiais,
    loading
  }), [materiais, loading]);

  return memoizedResult;
};
