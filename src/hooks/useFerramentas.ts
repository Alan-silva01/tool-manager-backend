
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Ferramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
  reserva?: boolean;
  matricula_reserva?: string;
};

export const useFerramentas = (refreshKey?: number) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFerramentas = async () => {
      try {
        console.log('Buscando ferramentas...');
        
        // Primeiro tenta buscar com todas as colunas incluindo reserva e matricula_reserva
        let { data, error } = await supabase
          .from('ferramentas')
          .select('id, nome, tag, quantidade, categoria, caracteristicas, saiu, reserva, matricula_reserva');

        console.log('Resposta do Supabase:', { data, error });

        // Se houve erro e é relacionado às colunas de reserva, tenta buscar sem elas
        if (error && (error.message?.includes('reserva') || error.message?.includes('matricula_reserva'))) {
          console.log('Tentando buscar sem as colunas de reserva...');
          const fallbackQuery = await supabase
            .from('ferramentas')
            .select('id, nome, tag, quantidade, categoria, caracteristicas, saiu');
          
          data = fallbackQuery.data;
          error = fallbackQuery.error;
        }

        if (error) {
          console.error('Erro ao buscar ferramentas:', error);
          return;
        }

        if (data) {
          console.log('Dados brutos:', data);
          console.log('Quantidade de ferramentas encontradas:', data.length);
          
          const ferramentasFormatadas = data.map((ferramenta: any) => {
            const quantidadeTotal = Number(ferramenta.quantidade) || 0;
            const quantidadeSaiu = Number(ferramenta.saiu) || 0;
            const quantidadeDisponivel = Math.max(0, quantidadeTotal - quantidadeSaiu); // Garante que não seja negativo
            
            console.log(`${ferramenta.nome}: total=${quantidadeTotal}, saiu=${quantidadeSaiu}, disponível=${quantidadeDisponivel}`);
            
            return {
              id: ferramenta.id,
              nome: ferramenta.nome || '',
              tag: ferramenta.tag || '',
              quantidade: quantidadeDisponivel,
              categoria: ferramenta.categoria || '',
              caracteristicas: ferramenta.caracteristicas || {},
              saiu: quantidadeSaiu,
              reserva: ferramenta.reserva || false,
              matricula_reserva: ferramenta.matricula_reserva || ''
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
  }, [refreshKey]);

  console.log('Estado atual - ferramentas:', ferramentas, 'loading:', loading);

  return {
    ferramentas,
    loading
  };
};
