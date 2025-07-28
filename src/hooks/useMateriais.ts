
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

export const useMateriais = (refreshKey?: number) => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        console.log('Buscando materiais...');
        
        const { data, error } = await supabase
          .from('materiais')
          .select('*');

        console.log('Resposta do Supabase:', { data, error });

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          return;
        }

        if (data) {
          console.log('Dados brutos:', data);
          console.log('Quantidade de materiais encontrados:', data.length);
          
          const materiaisFormatados = data.map(material => {
            const quantidadeEntrada = Number(material.entrada) || 0;
            const quantidadeSaida = Number(material.saida) || 0;
            const quantidadeDisponivel = quantidadeEntrada - quantidadeSaida;
            
            console.log(`${material.nome}: entrada=${quantidadeEntrada}, saida=${quantidadeSaida}, disponível=${quantidadeDisponivel}`);
            
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

          console.log('Materiais formatados:', materiaisFormatados);
          setMateriais(materiaisFormatados);
        }
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriais();
  }, [refreshKey]);

  console.log('Estado atual - materiais:', materiais, 'loading:', loading);

  return {
    materiais,
    loading
  };
};
