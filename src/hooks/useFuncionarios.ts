
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Funcionario = {
  id: string;
  nome: string;
  matricula: number;
  setor: string;
  posse_ferramentas: any[];
};

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Record<string, Funcionario>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const { data, error } = await supabase
          .from('funcionarios')
          .select('*');

        if (error) {
          console.error('Erro ao buscar funcionários:', error);
          return;
        }

        if (data) {
          const funcionariosMap = data.reduce((acc, func) => {
            acc[func.matricula.toString()] = {
              id: func.id,
              nome: func.nome,
              matricula: func.matricula,
              setor: func.setor,
              posse_ferramentas: func.posse_ferramentas || []
            };
            return acc;
          }, {} as Record<string, Funcionario>);

          setFuncionarios(funcionariosMap);
        }
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  const buscarFuncionario = (matricula: string) => {
    return funcionarios[matricula] || null;
  };

  const adicionarFerramentaAoFuncionario = async (matricula: string, tag: string) => {
    try {
      const funcionario = funcionarios[matricula];
      if (!funcionario) {
        throw new Error('Funcionário não encontrado');
      }

      const novasPosseFerramenta = [...funcionario.posse_ferramentas, tag];

      const { error } = await supabase
        .from('funcionarios')
        .update({ posse_ferramentas: novasPosseFerramenta })
        .eq('matricula', parseInt(matricula));

      if (error) {
        throw error;
      }

      // Atualizar o estado local
      setFuncionarios(prev => ({
        ...prev,
        [matricula]: {
          ...prev[matricula],
          posse_ferramentas: novasPosseFerramenta
        }
      }));

      return true;
    } catch (error) {
      console.error('Erro ao adicionar ferramenta ao funcionário:', error);
      return false;
    }
  };

  return {
    funcionarios,
    loading,
    buscarFuncionario,
    adicionarFerramentaAoFuncionario
  };
};
