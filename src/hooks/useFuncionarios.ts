
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Funcionario = {
  id: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: string[];
};

export const useFuncionarios = (refreshKey?: number) => {
  const [funcionarios, setFuncionarios] = useState<Record<string, Funcionario>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        console.log('Buscando funcionários...');
        
        const { data, error } = await supabase
          .from('funcionarios')
          .select('*');

        console.log('Resposta do Supabase funcionários:', { data, error });

        if (error) {
          console.error('Erro ao buscar funcionários:', error);
          return;
        }

        if (data) {
          console.log('Funcionários encontrados:', data.length);
          
          const funcionariosMap = data.reduce((acc, func) => {
            console.log('Processando funcionário:', func);
            
            const matriculaStr = func.matricula?.toString() || '';
            if (matriculaStr) {
              // Processar posse_ferramentas - garantir que seja um array de strings
              let posseFerramenta: string[] = [];
              if (func.posse_ferramentas) {
                if (Array.isArray(func.posse_ferramentas)) {
                  // Filtrar apenas valores que são strings
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

              acc[matriculaStr] = {
                id: func.id,
                nome: func.nome || '',
                matricula: func.matricula || 0,
                setor: func.setor || '',
                numero_whatsapp: func.numero_whatsapp || '',
                posse_ferramentas: posseFerramenta
              };
            }
            return acc;
          }, {} as Record<string, Funcionario>);

          console.log('Funcionários mapeados:', funcionariosMap);
          setFuncionarios(funcionariosMap);
        }
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, [refreshKey]);

  const buscarFuncionario = (matricula: string) => {
    console.log('Buscando funcionário com matrícula:', matricula);
    console.log('Funcionários disponíveis:', Object.keys(funcionarios));
    
    const funcionario = funcionarios[matricula] || null;
    console.log('Funcionário encontrado:', funcionario);
    
    return funcionario;
  };

  const buscarNomePorMatricula = (matricula: string) => {
    const funcionario = funcionarios[matricula];
    if (!funcionario) return null;
    
    // Retornar apenas os dois primeiros nomes
    const nomes = funcionario.nome.split(' ');
    return nomes.slice(0, 2).join(' ');
  };

  const adicionarFerramentaAoFuncionario = async (matricula: string, tag: string) => {
    try {
      console.log('Adicionando ferramenta ao funcionário:', { matricula, tag });
      
      const funcionario = funcionarios[matricula];
      if (!funcionario) {
        console.error('Funcionário não encontrado para matrícula:', matricula);
        throw new Error('Funcionário não encontrado');
      }

      const novasPosseFerramenta = [...funcionario.posse_ferramentas, tag];
      console.log('Novas ferramentas em posse:', novasPosseFerramenta);

      const { error } = await supabase
        .from('funcionarios')
        .update({ posse_ferramentas: novasPosseFerramenta })
        .eq('matricula', parseInt(matricula));

      if (error) {
        console.error('Erro ao atualizar funcionário:', error);
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

      console.log('Ferramenta adicionada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar ferramenta ao funcionário:', error);
      return false;
    }
  };

  console.log('Estado atual useFuncionarios:', { 
    totalFuncionarios: Object.keys(funcionarios).length, 
    loading,
    funcionarios: Object.keys(funcionarios)
  });

  return {
    funcionarios,
    loading,
    buscarFuncionario,
    buscarNomePorMatricula,
    adicionarFerramentaAoFuncionario
  };
};
