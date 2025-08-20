
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Ferramenta } from '@/types';

// Linha de base do PostgREST: numeric decimais tendem a vir como string.
// Vamos tipar a linha crua para converter corretamente.
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

  const fetchFerramentas = async () => {
    try {
      const { data, error } = await supabase
        .from('ferramentas')
        .select(
          'id, nome, tag, quantidade, categoria, caracteristicas, saiu, reserva, matricula_reserva, status, funcionario_emprestado'
        );

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (Array.isArray(data)) {
        const ferramentasFormatadas: Ferramenta[] = (data as FerramentaRow[]).map((f) => {
          // Normalização robusta: garante número mesmo se vier string/null
          const quantidadeTotal = Number(f.quantidade ?? 0);
          const saiuNum = Number(f.saiu ?? 0);

          const quantidadeDisponivel = Math.max(0, quantidadeTotal - saiuNum);

          // Usa o status do banco diretamente
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

        setFerramentas(ferramentasFormatadas);
      } else {
        console.warn('Nenhum dado retornado do Supabase.');
      }
    } catch (err) {
      console.error('Erro ao carregar ferramentas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFerramentas();
  }, [refreshKey]);

  return { ferramentas, loading, refetch: fetchFerramentas };
};
