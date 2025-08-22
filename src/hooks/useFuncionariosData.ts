
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
        console.log('Buscando funcionários...');
        
        // Query otimizada
        const { data, error } = await supabase
          .from('funcionarios')
          .select('id, nome, matricula, setor, numero_whatsapp, posse_ferramentas')
          .abortSignal(controller.signal);

        if (error) {
          console.error('Erro ao buscar funcionários:', error);
          return;
        }

        if (data && mounted) {
          console.log('Funcionários encontrados:', data.length);
          
          // Processar de forma mais eficiente
          const funcionariosMap = data.reduce((acc, func) => {
            const result = processFuncionario(func);
            if (result) {
              acc[result.key] = result.funcionario;
            }
            return acc;
          }, {} as Record<string, Funcionario>);

          console.log('Funcionários mapeados:', funcionariosMap);
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

    return () => {
      mounted = false;
      controller.abort();
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
