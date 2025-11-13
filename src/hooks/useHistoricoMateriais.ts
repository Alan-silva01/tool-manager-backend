
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

          // Processar dados de forma mais eficiente
          const historicoFormatado: HistoricoMaterialFormatado[] = registros.map((registro: any) => ({
            id: registro.id,
            funcionario: registro.funcionario || '',
            matricula: registro.matricula || '',
            material_tag: registro.material || '',
            material_nome: materiaisMap[registro.material] || 'Material não encontrado',
            quantidade: Number(registro.quantidade) || 0,
            data: registro.data || ''
          }));

          console.log('Histórico formatado:', historicoFormatado);
          
          // Ordenar usando localeCompare otimizado
          const historicoOrdenado = historicoFormatado.sort((a, b) => 
            a.funcionario.localeCompare(b.funcionario, undefined, { numeric: true })
          );

          setHistorico(historicoOrdenado);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao carregar histórico de materiais:', error);
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

  // Otimizar função de agrupamento com memoização
  const getHistoricoAgrupado = useCallback((): FuncionarioComMateriais[] => {
    let historicoFiltrado = historico;

    // Aplicar filtros de forma mais eficiente
    if (filtros.funcionario) {
      const termoBusca = filtros.funcionario.toLowerCase();
      historicoFiltrado = historicoFiltrado.filter(item => 
        item.funcionario.toLowerCase().includes(termoBusca) ||
        item.matricula.includes(filtros.funcionario)
      );
    }

    if (filtros.material) {
      const termoBusca = filtros.material.toLowerCase();
      historicoFiltrado = historicoFiltrado.filter(item => 
        item.material_nome.toLowerCase().includes(termoBusca) ||
        item.material_tag.includes(filtros.material)
      );
    }

    // Agrupar de forma mais eficiente
    const grupos = historicoFiltrado.reduce((acc, item) => {
      const key = `${item.matricula}-${item.funcionario}`;
      if (!acc[key]) {
        acc[key] = {
          funcionario: item.funcionario,
          matricula: item.matricula,
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
