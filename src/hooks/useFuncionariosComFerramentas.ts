
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatWhatsAppForDisplay } from '@/utils/whatsappFormatter';
import type { FuncionarioComFerramentas, Ferramenta } from '@/types';

export const useFuncionariosComFerramentas = (ferramentas: Ferramenta[], refreshKey: number) => {
  const [funcionariosComFerramentas, setFuncionariosComFerramentas] = useState<FuncionarioComFerramentas[]>([]);

  // Criar mapa de ferramentas para lookup mais eficiente
  const ferramentasMap = useMemo(() => {
    return ferramentas.reduce((acc, ferramenta) => {
      acc[ferramenta.tag] = ferramenta;
      return acc;
    }, {} as Record<string, Ferramenta>);
  }, [ferramentas]);

  const processFuncionario = useCallback((func: any) => {
    const posseFerramenta = Array.isArray(func.posse_ferramentas) 
      ? func.posse_ferramentas as string[]
      : [];

    if (posseFerramenta.length === 0) return null;

    // Usar map para busca mais eficiente
    const ferramentasDetalhadas = posseFerramenta
      .map((tag: string) => {
        const ferramenta = ferramentasMap[tag];
        return {
          tag,
          nome: ferramenta?.nome || 'Ferramenta não encontrada'
        };
      })
      .filter(f => f.nome !== 'Ferramenta não encontrada'); // Filtrar apenas ferramentas válidas

    return {
      id: func.id,
      nome: func.nome,
      matricula: func.matricula?.toString() || '',
      setor: func.setor || '',
      numero_whatsapp: formatWhatsAppForDisplay(func.numero_whatsapp || ''),
      ferramentas: ferramentasDetalhadas
    };
  }, [ferramentasMap]);

  const fetchFuncionariosComFerramentas = useCallback(async () => {
    try {
      console.log('Buscando funcionários com ferramentas...');
      
      // Query otimizada
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, nome, matricula, setor, posse_ferramentas, numero_whatsapp')
        .not('posse_ferramentas', 'is', null)
        .neq('posse_ferramentas', '[]');

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        console.log('Funcionários encontrados:', data);
        
        // Processar dados de forma mais eficiente
        const funcionariosFormatados = data
          .map(processFuncionario)
          .filter((func): func is FuncionarioComFerramentas => func !== null);

        console.log('Funcionários formatados:', funcionariosFormatados);
        setFuncionariosComFerramentas(funcionariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários com ferramentas:', error);
    }
  }, [processFuncionario]);

  useEffect(() => {
    if (ferramentas.length > 0) {
      fetchFuncionariosComFerramentas();
    }
  }, [ferramentas.length, refreshKey, fetchFuncionariosComFerramentas]);

  // Memoizar resultado
  const memoizedResult = useMemo(() => ({
    funcionariosComFerramentas,
    refetch: fetchFuncionariosComFerramentas
  }), [funcionariosComFerramentas, fetchFuncionariosComFerramentas]);

  return memoizedResult;
};
