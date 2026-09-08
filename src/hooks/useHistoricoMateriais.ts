
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RegistroMateFuncionario {
  id: string;
  funcionario: string;
  material: string;
  data: string;
  matricula: string;
  quantidade: number;
}

export interface HistoricoMaterialFormatado {
  id: string;
  funcionario: string;
  matricula: string;
  material_tag: string;
  material_nome: string;
  quantidade: number;
  data: string;
}

export interface FuncionarioComMateriais {
  funcionario: string;
  matricula: string;
  materiais: HistoricoMaterialFormatado[];
  totalQuantidade: number;
}

export interface HistoricoFiltros {
  funcionario: string;
  material: string;
  periodo: string;
}

/**
 * Calcula a data limite com base no período selecionado.
 * Retorna null quando o período é "todos" (sem filtro de data).
 */
const calcularDataLimite = (periodo: string): Date | null => {
  const agora = new Date();

  switch (periodo) {
    case 'hoje': {
      const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      return inicio;
    }
    case 'semana': {
      const diaSemana = agora.getDay();
      const inicio = new Date(agora);
      inicio.setDate(agora.getDate() - diaSemana);
      inicio.setHours(0, 0, 0, 0);
      return inicio;
    }
    case 'mes': {
      return new Date(agora.getFullYear(), agora.getMonth(), 1);
    }
    case 'trimestre': {
      const mesInicioTrimestre = Math.floor(agora.getMonth() / 3) * 3;
      return new Date(agora.getFullYear(), mesInicioTrimestre, 1);
    }
    default:
      return null;
  }
};

/**
 * Tenta parsear uma string de data em múltiplos formatos comuns.
 * Retorna null se não conseguir parsear.
 */
const parsearData = (dataStr: string): Date | null => {
  if (!dataStr) return null;

  // Formato ISO: 2024-01-15 ou 2024-01-15T10:30:00
  const isoDate = new Date(dataStr);
  if (!isNaN(isoDate.getTime())) return isoDate;

  // Formato BR: dd/mm/yyyy
  const partesBR = dataStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (partesBR) {
    const [, dia, mes, ano] = partesBR;
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (!isNaN(data.getTime())) return data;
  }

  return null;
};

/**
 * Acessa propriedade de string de forma segura, retornando string vazia
 * caso o valor seja null/undefined.
 */
const safeStr = (value: unknown): string => {
  if (value == null) return '';
  return String(value);
};

export const useHistoricoMateriais = (refreshKey?: number) => {
  const [historico, setHistorico] = useState<HistoricoMaterialFormatado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<HistoricoFiltros>({
    funcionario: '',
    material: '',
    periodo: 'todos'
  });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchHistorico = async () => {
      try {
        console.log('Buscando histórico de materiais...');
        setError(null);
        
        // Buscar dados em paralelo para melhor performance
        const [registrosResult, materiaisResult] = await Promise.all([
          supabase
            .from('registro_mate_funcionarios' as any)
            .select('*')
            .abortSignal(controller.signal),
          supabase
            .from('materiais')
            .select('tag, nome')
            .abortSignal(controller.signal)
        ]);

        if (registrosResult.error) {
          console.error('Erro ao buscar registros:', registrosResult.error);
          if (mounted) setError('Erro ao buscar registros de materiais');
          return;
        }

        if (materiaisResult.error) {
          console.error('Erro ao buscar materiais:', materiaisResult.error);
          if (mounted) setError('Erro ao buscar materiais');
          return;
        }

        const { data: registros } = registrosResult;
        const { data: materiais } = materiaisResult;

        if (registros && materiais && mounted) {
          console.log('Registros encontrados:', registros.length);
          console.log('Materiais para match:', materiais.length);
          
          // Criar mapa otimizado para lookup de materiais
          const materiaisMap = materiais.reduce((acc, material) => {
            if (material.tag) {
              acc[material.tag.toString()] = material.nome;
            }
            return acc;
          }, {} as Record<string, string>);

          console.log('Mapa de materiais:', materiaisMap);

          // Processar dados com null-safety garantida
          const historicoFormatado: HistoricoMaterialFormatado[] = registros.map((registro: any) => ({
            id: safeStr(registro.id),
            funcionario: safeStr(registro.funcionario),
            matricula: safeStr(registro.matricula),
            material_tag: safeStr(registro.material),
            material_nome: materiaisMap[safeStr(registro.material)] || 'Material não encontrado',
            quantidade: Number(registro.quantidade) || 0,
            data: safeStr(registro.data)
          }));

          console.log('Histórico formatado:', historicoFormatado);
          
          // Ordenar usando localeCompare otimizado
          const historicoOrdenado = historicoFormatado.sort((a, b) => 
            a.funcionario.localeCompare(b.funcionario, undefined, { numeric: true })
          );

          setHistorico(historicoOrdenado);
        }
      } catch (err: unknown) {
        const isAbort = err instanceof DOMException && err.name === 'AbortError';
        if (!isAbort) {
          console.error('Erro ao carregar histórico de materiais:', err);
          if (mounted) setError('Erro ao carregar histórico de materiais');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHistorico();

    // Realtime subscription
    const channel = supabase
      .channel('registro-mate-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registro_mate_funcionarios'
        },
        () => {
          if (mounted) {
            fetchHistorico();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      controller.abort();
      supabase.removeChannel(channel);
    };
  }, [refreshKey]);

  // Filtragem e agrupamento com null-safety completa
  const getHistoricoAgrupado = useCallback((): FuncionarioComMateriais[] => {
    let historicoFiltrado = historico;

    // Filtro por funcionário (nome ou matrícula)
    if (filtros.funcionario) {
      const termoBusca = filtros.funcionario.toLowerCase();
      historicoFiltrado = historicoFiltrado.filter(item => {
        const nome = safeStr(item.funcionario).toLowerCase();
        const matricula = safeStr(item.matricula);
        return nome.includes(termoBusca) || matricula.includes(filtros.funcionario);
      });
    }

    // Filtro por material (nome ou tag)
    if (filtros.material) {
      const termoBusca = filtros.material.toLowerCase();
      historicoFiltrado = historicoFiltrado.filter(item => {
        const nome = safeStr(item.material_nome).toLowerCase();
        const tag = safeStr(item.material_tag);
        return nome.includes(termoBusca) || tag.includes(filtros.material);
      });
    }

    // Filtro por período
    if (filtros.periodo && filtros.periodo !== 'todos') {
      const dataLimite = calcularDataLimite(filtros.periodo);
      if (dataLimite) {
        historicoFiltrado = historicoFiltrado.filter(item => {
          const dataItem = parsearData(item.data);
          if (!dataItem) return false;
          return dataItem >= dataLimite;
        });
      }
    }

    // Agrupar por funcionário
    const grupos = historicoFiltrado.reduce((acc, item) => {
      const matricula = safeStr(item.matricula);
      const funcionario = safeStr(item.funcionario);
      const key = `${matricula}-${funcionario}`;

      if (!acc[key]) {
        acc[key] = {
          funcionario,
          matricula,
          materiais: [],
          totalQuantidade: 0
        };
      }
      acc[key].materiais.push(item);
      acc[key].totalQuantidade += item.quantidade;
      return acc;
    }, {} as Record<string, FuncionarioComMateriais>);

    return Object.values(grupos).sort((a, b) => 
      a.funcionario.localeCompare(b.funcionario, undefined, { numeric: true })
    );
  }, [historico, filtros]);

  // Memoizar histórico agrupado
  const historicoAgrupado = useMemo(() => getHistoricoAgrupado(), [getHistoricoAgrupado]);

  return {
    historico: historicoAgrupado,
    loading,
    error,
    filtros,
    setFiltros
  };
};
