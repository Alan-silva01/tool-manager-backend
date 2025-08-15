
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

export const useHistoricoMateriais = (refreshKey?: number) => {
  const [historico, setHistorico] = useState<HistoricoMaterialFormatado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        console.log('Buscando histórico de materiais...');
        
        // Buscar registros de funcionários usando query SQL direta
        const { data: registros, error: registrosError } = await supabase
          .from('registro_mate_funcionarios' as any)
          .select('*');

        if (registrosError) {
          console.error('Erro ao buscar registros:', registrosError);
          return;
        }

        // Buscar materiais para fazer o match das tags
        const { data: materiais, error: materiaisError } = await supabase
          .from('materiais')
          .select('tag, nome');

        if (materiaisError) {
          console.error('Erro ao buscar materiais:', materiaisError);
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
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [refreshKey]);

  return {
    historico,
    loading
  };
};
