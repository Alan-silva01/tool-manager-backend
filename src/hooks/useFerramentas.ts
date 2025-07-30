
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: Json;
  saiu: number;
  reserva?: boolean | null;
  matricula_reserva?: string | null;
}

export const useFerramentas = (refreshKey: number = 0) => {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFerramentas = async () => {
    try {
      console.log('Buscando ferramentas...');
      
      // Primeira tentativa: buscar com colunas de reserva
      let { data, error } = await supabase
        .from('ferramentas')
        .select('*, reserva, matricula_reserva');

      // Se der erro por causa das colunas de reserva não existirem, buscar sem elas
      if (error && error.message?.includes("column 'reserva' does not exist")) {
        console.log('Colunas de reserva não existem, buscando sem elas...');
        const { data: dataWithoutReserva, error: errorWithoutReserva } = await supabase
          .from('ferramentas')
          .select('*');
        
        data = dataWithoutReserva;
        error = errorWithoutReserva;
      }

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        const ferramentasFormatadas = data.map((ferramenta: any) => {
          // Calcular quantidade disponível corretamente
          const quantidadeTotal = ferramenta.quantidade || 0;
          const quantidadeSaiu = ferramenta.saiu || 0;
          const quantidadeDisponivel = Math.max(0, quantidadeTotal - quantidadeSaiu);

          console.log(`Ferramenta ${ferramenta.nome}: total=${quantidadeTotal}, saiu=${quantidadeSaiu}, disponível=${quantidadeDisponivel}`);

          return {
            id: ferramenta.id,
            nome: ferramenta.nome,
            tag: ferramenta.tag,
            quantidade: quantidadeDisponivel, // Quantidade disponível
            categoria: ferramenta.categoria,
            caracteristicas: ferramenta.caracteristicas,
            saiu: quantidadeSaiu,
            reserva: ferramenta.reserva || false,
            matricula_reserva: ferramenta.matricula_reserva || null
          } as Ferramenta;
        });

        console.log('Ferramentas formatadas:', ferramentasFormatadas);
        setFerramentas(ferramentasFormatadas);
      }
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFerramentas();
  }, [refreshKey]);

  return { ferramentas, loading, refetch: fetchFerramentas };
};
