
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatWhatsAppForDisplay } from '@/utils/whatsappFormatter';
import type { FuncionarioComFerramentas, Ferramenta } from '@/types';

export const useFuncionariosComFerramentas = (ferramentas: Ferramenta[], refreshKey: number) => {
  const [funcionariosComFerramentas, setFuncionariosComFerramentas] = useState<FuncionarioComFerramentas[]>([]);

  const fetchFuncionariosComFerramentas = async () => {
    try {
      console.log('Buscando funcionários com ferramentas...');
      
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, nome, matricula, setor, posse_ferramentas, numero_whatsapp')
        .not('posse_ferramentas', 'is', null);

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        console.log('Funcionários encontrados:', data);
        
        const funcionariosFormatados = data
          .filter(func => {
            const posseFerramenta = Array.isArray(func.posse_ferramentas) 
              ? func.posse_ferramentas 
              : [];
            return posseFerramenta.length > 0;
          })
          .map(func => {
            const posseFerramenta = Array.isArray(func.posse_ferramentas) 
              ? func.posse_ferramentas as string[]
              : [];

            const ferramentasDetalhadas = posseFerramenta.map((tag: string) => {
              const ferramenta = ferramentas.find(f => f.tag === tag);
              return {
                tag,
                nome: ferramenta?.nome || 'Ferramenta não encontrada'
              };
            });

            return {
              id: func.id,
              nome: func.nome,
              matricula: func.matricula?.toString() || '',
              setor: func.setor || '',
              numero_whatsapp: formatWhatsAppForDisplay(func.numero_whatsapp || ''),
              ferramentas: ferramentasDetalhadas
            };
          });

        console.log('Funcionários formatados:', funcionariosFormatados);
        setFuncionariosComFerramentas(funcionariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários com ferramentas:', error);
    }
  };

  useEffect(() => {
    if (ferramentas.length > 0) {
      fetchFuncionariosComFerramentas();
    }
  }, [ferramentas, refreshKey]);

  return {
    funcionariosComFerramentas,
    refetch: fetchFuncionariosComFerramentas
  };
};
