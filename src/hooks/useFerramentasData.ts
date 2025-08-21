
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Ferramenta } from '@/types';

type FerramentaRow = {
  id: string;
  nome: string | null;
  tag: string;
  quantidade: number | string | null;
  categoria: string | null;
  caracteristicas: any | null;
  saiu: number | string | null;
  reserva: boolean | null;
  matricula_reserva: string | null;
  status: string | null;
  funcionario_emprestado: string | null;
};

export const useFerramentasData = (refreshKey: number = 0) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFerramentas = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      console.log('🔄 Iniciando busca de ferramentas...');
      setLoading(true);

      const { data, error } = await supabase
        .from('ferramentas')
        .select('id, nome, tag, quantidade, categoria, caracteristicas, saiu, reserva, matricula_reserva, status, funcionario_emprestado')
        .abortSignal(controller.signal);

      if (error) {
        console.error('❌ Erro ao buscar ferramentas:', error);
        throw error;
      }

      if (Array.isArray(data)) {
        console.log('✅ Ferramentas encontradas:', data.length);
        
        const ferramentasFormatadas: Ferramenta[] = data.map((f: FerramentaRow) => {
          const quantidadeTotal = Number(f.quantidade ?? 0);
          const saiuNum = Number(f.saiu ?? 0);
          const quantidadeDisponivel = Math.max(0, quantidadeTotal - saiuNum);
          const statusBanco = f.status ?? (saiuNum === 1 ? 'emprestada' : 'disponível');

          return {
            id: f.id,
            nome: f.nome ?? '',
            tag: f.tag,
            quantidade: quantidadeDisponivel,
            categoria: f.categoria ?? undefined,
            caracteristicas: f.caracteristicas ?? undefined,
            saiu: saiuNum,
            reserva: f.reserva ?? false,
            matricula_reserva: f.matricula_reserva ?? undefined,
            status: statusBanco,
            funcionario_emprestado: f.funcionario_emprestado ?? undefined,
          };
        });

        console.log('✅ Ferramentas formatadas:', ferramentasFormatadas.length);
        setFerramentas(ferramentasFormatadas);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('❌ Erro ao carregar ferramentas:', err);
        setFerramentas([]);
      }
    } finally {
      console.log('✅ Finalizando carregamento de ferramentas');
      setLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchFerramentas();
  }, [refreshKey, fetchFerramentas]);

  const memoizedResult = useMemo(() => ({
    ferramentas,
    loading,
    refetch: fetchFerramentas
  }), [ferramentas, loading, fetchFerramentas]);

  return memoizedResult;
};
