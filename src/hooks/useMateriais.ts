
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
        console.log('🔄 Iniciando busca de materiais...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('materiais')
          .select('id, nome, tag, entrada, saida, quantidade_minima, data_entrada_estoque, unidade')
          .abortSignal(controller.signal);

        if (error) {
          console.error('❌ Erro ao buscar materiais:', error);
          throw error;
        }

        if (data && mounted) {
          console.log('✅ Materiais encontrados:', data.length);
          
          const materiaisFormatados = data.map(material => {
            const quantidadeEntrada = Number(material.entrada) || 0;
            const quantidadeSaida = Number(material.saida) || 0;
            const quantidadeDisponivel = quantidadeEntrada - quantidadeSaida;
            
            return {
              id: material.id,
              nome: material.nome || '',
              tag: material.tag?.toString() || '',
              quantidade: quantidadeDisponivel,
              quantidade_minima: Number(material.quantidade_minima) || 0,
              entrada: quantidadeEntrada,
              saida: quantidadeSaida,
              data_entrada_estoque: material.data_entrada_estoque || '',
              unidade: material.unidade || 'un'
            };
          });

          console.log('✅ Materiais formatados:', materiaisFormatados.length);
          setMateriais(materiaisFormatados);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('❌ Erro ao carregar materiais:', error);
          setMateriais([]);
        }
      } finally {
        if (mounted) {
          console.log('✅ Finalizando carregamento de materiais');
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

  const memoizedResult = useMemo(() => ({
    materiais,
    loading
  }), [materiais, loading]);

  return memoizedResult;
};
