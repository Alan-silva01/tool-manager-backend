
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Ferramenta } from '@/types';

export const useFerramentasData = (refreshKey: number = 0) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFerramentas = async () => {
    try {
      console.log('Buscando ferramentas...');
      
      // Buscar todas as colunas incluindo reserva e matricula_reserva
      const { data, error } = await supabase
        .from('ferramentas')
        .select('id, nome, tag, quantidade, categoria, caracteristicas, saiu, reserva, matricula_reserva');

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        const ferramentasFormatadas = data.map((ferramenta: any) => {
          // Calcular quantidade disponível corretamente
          const quantidadeTotal = ferramenta.quantidade || 0;
          const quantidadeSaiu = ferramenta.saiu || 0;
          const quantidadeDisponivel = Math.max(0, quantidadeTotal - quantidadeSaiu);

          console.log(`Ferramenta ${ferramenta.nome}: total=${quantidadeTotal}, saiu=${quantidadeSaiu}, disponível=${quantidadeDisponivel}, reserva=${ferramenta.reserva}, matricula_reserva=${ferramenta.matricula_reserva}`);

          return {
            id: ferramenta.id,
            nome: ferramenta.nome,
            tag: ferramenta.tag,
            quantidade: quantidadeDisponivel, // Quantidade disponível
            categoria: ferramenta.categoria,
            caracteristicas: ferramenta.caracteristicas,
            saiu: quantidadeSaiu,
            reserva: ferramenta.reserva || false,
            matricula_reserva: ferramenta.matricula_reserva || undefined
          } as Ferramenta;
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

  useEffect(() => {
    fetchFerramentas();
  }, [refreshKey]);

  return { ferramentas, loading, refetch: fetchFerramentas };
};
