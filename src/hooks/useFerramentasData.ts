
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

          // Log detalhado para debug
          console.log(`Ferramenta ${ferramenta.nome}:`, {
            'ID': ferramenta.id,
            'Status do banco (gerado)': ferramenta.status,
            'Quantidade total': quantidadeTotal,
            'Quantidade saiu': quantidadeSaiu,
            'Quantidade disponível': quantidadeDisponivel
          });

          // Usar o status gerado automaticamente pelo banco de dados
          // Não precisamos inferir o status, ele já vem calculado
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
            status: ferramenta.status || 'disponível' // Usar o status gerado pelo banco
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
