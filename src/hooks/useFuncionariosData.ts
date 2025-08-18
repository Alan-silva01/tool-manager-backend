
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Funcionario } from '@/types';

export const useFuncionariosData = (refreshKey?: number) => {
  const [funcionarios, setFuncionarios] = useState<Record<string, Funcionario>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        console.log('Buscando funcionários...');
        
        const { data, error } = await supabase
          .from('funcionarios')
          .select('*');

        if (error) {
          console.error('Erro ao buscar funcionários:', error);
          return;
        }

        if (data) {
          console.log('Funcionários encontrados:', data.length);
          
          const funcionariosMap = data.reduce((acc, func) => {
            const matriculaStr = func.matricula?.toString() || '';
            if (matriculaStr) {
              // Processar posse_ferramentas - garantir que seja um array de strings
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

  return { funcionarios, loading, setFuncionarios };
};
