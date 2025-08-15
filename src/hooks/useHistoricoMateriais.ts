
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RegistroMateFuncionario {
  id: string;
  funcionario: string;
  material: string; // tag do material
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
    const fetchHistorico = async () => {
      try {
        console.log('Buscando histórico de materiais...');
        setError(null);
        
        // Buscar registros de funcionários usando query SQL direta
        const { data: registros, error: registrosError } = await supabase
          .from('registro_mate_funcionarios' as any)
          .select('*');

        if (registrosError) {
          console.error('Erro ao buscar registros:', registrosError);
          setError('Erro ao buscar registros de materiais');
          return;
        }

        // Buscar materiais para fazer o match das tags
        const { data: materiais, error: materiaisError } = await supabase
          .from('materiais')
          .select('tag, nome');

        if (materiaisError) {
          console.error('Erro ao buscar materiais:', materiaisError);
          setError('Erro ao buscar materiais');
          return;
        }

        if (registros && materiais) {
          console.log('Registros encontrados:', registros.length);
          console.log('Materiais para match:', materiais.length);
          
          // Criar mapa de tags para nomes de materiais
          const materiaisMap = materiais.reduce((acc, material) => {
            if (material.tag) {
              acc[material.tag.toString()] = material.nome;
            }
            return acc;
          }, {} as Record<string, string>);

          console.log('Mapa de materiais:', materiaisMap);

          // Formatar dados combinando informações
          const historicoFormatado: HistoricoMaterialFormatado[] = registros.map((registro: any) => {
            const materialNome = materiaisMap[registro.material] || 'Material não encontrado';
            
            return {
              id: registro.id,
              funcionario: registro.funcionario || '',
              matricula: registro.matricula || '',
              material_tag: registro.material || '',
              material_nome: materialNome,
              quantidade: Number(registro.quantidade) || 0,
              data: registro.data || ''
            };
          });

          console.log('Histórico formatado:', historicoFormatado);
          
          // Ordenar por nome do funcionário (ordem alfabética)
          const historicoOrdenado = historicoFormatado.sort((a, b) => 
            a.funcionario.localeCompare(b.funcionario)
          );

          setHistorico(historicoOrdenado);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de materiais:', error);
        setError('Erro ao carregar histórico de materiais');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [refreshKey]);

  // Função para agrupar histórico por funcionário
  const getHistoricoAgrupado = (): FuncionarioComMateriais[] => {
    let historicoFiltrado = [...historico];

    // Aplicar filtros
    if (filtros.funcionario) {
      historicoFiltrado = historicoFiltrado.filter(item => 
        item.funcionario.toLowerCase().includes(filtros.funcionario.toLowerCase()) ||
        item.matricula.includes(filtros.funcionario)
      );
    }

    if (filtros.material) {
      historicoFiltrado = historicoFiltrado.filter(item => 
        item.material_nome.toLowerCase().includes(filtros.material.toLowerCase()) ||
        item.material_tag.includes(filtros.material)
      );
    }

    // Agrupar por funcionário
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

    return Object.values(grupos).sort((a, b) => a.funcionario.localeCompare(b.funcionario));
  };

  return {
    historico: getHistoricoAgrupado(),
    loading,
    error,
    filtros,
    setFiltros
  };
};
