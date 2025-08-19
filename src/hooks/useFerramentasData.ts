
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Ferramenta } from '@/types';

export const useFerramentasData = (refreshKey: number = 0) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFerramentas = async () => {
    try {
      console.log('Buscando ferramentas...');

      const { data, error } = await supabase
        .from('ferramentas')
        .select(`
          id,
          nome,
          tag,
          quantidade,
          categoria,
          caracteristicas,
          saiu,
          reserva,
          matricula_reserva,
          status
        `);

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        const ferramentasFormatadas = data.map((ferramenta: any) => {
          const quantidadeTotal = ferramenta.quantidade ?? 0;
          const quantidadeSaiu = ferramenta.saiu ?? 0;
          const quantidadeDisponivel = Math.max(0, quantidadeTotal - quantidadeSaiu);

          // Mapear status corretamente do banco de dados
          let statusFormatado = ferramenta.status || "indefinido";
          
          // Log para debug do status
          console.log(`Ferramenta ${ferramenta.nome} - Status no DB:`, ferramenta.status, 'Status formatado:', statusFormatado);

          return {
            id: ferramenta.id,
            nome: ferramenta.nome,
            tag: ferramenta.tag,
            quantidade: quantidadeDisponivel,
            categoria: ferramenta.categoria,
            caracteristicas: ferramenta.caracteristicas,
            saiu: quantidadeSaiu,
            reserva: ferramenta.reserva ?? false,
            matricula_reserva: ferramenta.matricula_reserva ?? undefined,
            status: statusFormatado // Usar o status real do banco
          } as Ferramenta;
        });

        console.log("Ferramentas com status:", ferramentasFormatadas.map(f => ({
          nome: f.nome, 
          id: f.id, 
          status: f.status
        })));

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
