

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

      console.log('Resposta do Supabase ferramentas:', { data, error });

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        console.log('Dados brutos do Supabase:', data);
        
        const ferramentasFormatadas = data.map((ferramenta: any) => {
          const quantidadeTotal = ferramenta.quantidade ?? 0;
          const quantidadeSaiu = ferramenta.saiu ?? 0;
          const quantidadeDisponivel = Math.max(0, quantidadeTotal - quantidadeSaiu);

          // Log detalhado para debug do status
          console.log(`Ferramenta ${ferramenta.nome}:`, {
            'ID': ferramenta.id,
            'Status original no DB': ferramenta.status,
            'Tipo do status': typeof ferramenta.status,
            'Quantidade total': quantidadeTotal,
            'Quantidade saiu': quantidadeSaiu,
            'Quantidade disponível': quantidadeDisponivel
          });

          // Determinar o status correto baseado nos dados
          let statusFinal = ferramenta.status || "disponivel";
          
          // Se não há status definido ou está null, determinar baseado na quantidade
          if (!ferramenta.status || ferramenta.status === null) {
            statusFinal = quantidadeDisponivel > 0 ? "disponivel" : "emprestada";
            console.log(`Status inferido para ${ferramenta.nome}: ${statusFinal}`);
          }

          const ferramentaFormatada = {
            id: ferramenta.id,
            nome: ferramenta.nome,
            tag: ferramenta.tag,
            quantidade: quantidadeDisponivel,
            categoria: ferramenta.categoria || '',
            caracteristicas: ferramenta.caracteristicas || {},
            saiu: quantidadeSaiu,
            reserva: ferramenta.reserva ?? false,
            matricula_reserva: ferramenta.matricula_reserva ?? undefined,
            status: statusFinal
          } as Ferramenta;

          console.log(`Ferramenta ${ferramenta.nome} processada:`, ferramentaFormatada);
          
          return ferramentaFormatada;
        });

        console.log("Total de ferramentas carregadas:", ferramentasFormatadas.length);
        console.log("Ferramentas com status:", ferramentasFormatadas.map(f => ({
          nome: f.nome, 
          id: f.id, 
          status: f.status,
          quantidade: f.quantidade
        })));

        setFerramentas(ferramentasFormatadas);
      } else {
        console.log('Nenhum dado retornado do Supabase');
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

