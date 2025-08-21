
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
        console.log('Buscando materiais...');
        
        // Otimizar query selecionando apenas campos necessários
        const { data, error } = await supabase
          .from('materiais')
          .select('id, nome, tag, entrada, saida, quantidade_minima, data_entrada_estoque, unidade')
          .abortSignal(controller.signal);

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          return;
        }

        if (data && mounted) {
          console.log('Dados brutos:', data);
          console.log('Quantidade de materiais encontrados:', data.length);
          
          // Otimizar processamento usando map mais eficiente
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
