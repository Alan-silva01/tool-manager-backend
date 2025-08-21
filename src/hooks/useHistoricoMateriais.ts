
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
  const [needsAuth, setNeedsAuth] = useState(false);
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
        setNeedsAuth(false);
        
        // Criar uma sessão anônima temporária para acessar os dados
        // Como não temos auth real implementado, vamos usar o client direto
        // mas com tratamento de erro adequado
        
        // Buscar dados em paralelo para melhor performance
        const [registrosResult, materiaisResult] = await Promise.all([
          supabase
            .from('registro_mate_funcionarios')
            .select('*')
            .abortSignal(controller.signal),
          supabase
            .from('materiais')
            .select('tag, nome')
            .abortSignal(controller.signal)
        ]);

        if (registrosResult.error) {
          console.error('Erro ao buscar registros:', registrosResult.error);
          
          // Se o erro for relacionado a RLS/auth, mostrar que precisa de autenticação
          if (registrosResult.error.code === 'PGRST116' || 
              registrosResult.error.message?.includes('row-level security') ||
              registrosResult.error.message?.includes('insufficient_privilege')) {
            if (mounted) {
              setNeedsAuth(true);
              setError('Acesso negado: É necessário estar autenticado para visualizar o histórico');
            }
            return;
          }
          
          if (mounted) setError('Erro ao buscar registros de materiais');
          return;
        }

        if (materiaisResult.error) {
          console.error('Erro ao buscar materiais:', materiaisResult.error);
          
          if (materiaisResult.error.code === 'PGRST116' || 
              materiaisResult.error.message?.includes('row-level security') ||
              materiaisResult.error.message?.includes('insufficient_privilege')) {
            if (mounted) {
              setNeedsAuth(true);
              setError('Acesso negado: É necessário estar autenticado para visualizar o histórico');
            }
            return;
          }
          
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
          
          // Verificar se é erro de autenticação/RLS
          const errorMessage = error?.message || '';
          if (errorMessage.includes('row-level security') || 
              errorMessage.includes('insufficient_privilege') ||
              errorMessage.includes('PGRST116')) {
            if (mounted) {
              setNeedsAuth(true);
              setError('Acesso negado: É necessário estar autenticado para visualizar o histórico');
            }
          } else if (mounted) {
            setError('Erro ao carregar histórico de materiais');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHistorico();

    return () => {
      mounted = false;
      controller.abort();
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
    needsAuth,
    filtros,
    setFiltros
  };
};
