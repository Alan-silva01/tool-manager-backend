
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Funcionario } from '@/types';

export const useFuncionariosData = (refreshKey?: number) => {
  const [funcionarios, setFuncionarios] = useState<Record<string, Funcionario>>({});
  const [loading, setLoading] = useState(true);

  const processFuncionario = useCallback((func: any) => {
    const matriculaStr = func.matricula?.toString() || '';
    if (!matriculaStr) return null;

    let posseFerramenta: string[] = [];
    if (func.posse_ferramentas) {
      if (Array.isArray(func.posse_ferramentas)) {
        posseFerramenta = func.posse_ferramentas.filter(
          (item): item is string => typeof item === 'string'
        );
      } else if (typeof func.posse_ferramentas === 'string') {
        try {
          const parsed = JSON.parse(func.posse_ferramentas);
          if (Array.isArray(parsed)) {
            posseFerramenta = parsed.filter(
              (item): item is string => typeof item === 'string'
            );
          }
        } catch (e) {
          posseFerramenta = [];
        }
      }
    }

    return {
      key: matriculaStr,
      funcionario: {
        id: func.id,
        nome: func.nome || '',
        matricula: func.matricula || 0,
        setor: func.setor || '',
        numero_whatsapp: func.numero_whatsapp || '',
        posse_ferramentas: posseFerramenta
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchFuncionarios = async () => {
      try {
        const { data, error } = await supabase
          .from('funcionarios')
          .select('id, nome, matricula, setor, numero_whatsapp, posse_ferramentas')
          .abortSignal(controller.signal);

        if (error) throw error;

        if (data && mounted) {
          const funcionariosMap = data.reduce((acc, func) => {
            const result = processFuncionario(func);
            if (result) {
              acc[result.key] = result.funcionario;
            }
            return acc;
          }, {} as Record<string, Funcionario>);

          setFuncionarios(funcionariosMap);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao carregar funcionários:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFuncionarios();

    // Realtime subscription
    const channel = supabase
      .channel('funcionarios-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funcionarios'
        },
        (payload) => {
          if (!mounted) return;
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const result = processFuncionario(payload.new);
            if (result) {
              setFuncionarios(prev => ({
                ...prev,
                [result.key]: result.funcionario
              }));
            }
          } else if (payload.eventType === 'DELETE') {
            const oldFunc = payload.old as any;
            const matriculaStr = oldFunc.matricula?.toString() || '';
            setFuncionarios(prev => {
              const newState = { ...prev };
              delete newState[matriculaStr];
              return newState;
            });
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      controller.abort();
      supabase.removeChannel(channel);
    };
  }, [refreshKey, processFuncionario]);

  // Memoizar resultado
  const memoizedResult = useMemo(() => ({
    funcionarios,
    loading,
    setFuncionarios
  }), [funcionarios, loading]);

  return memoizedResult;
};
