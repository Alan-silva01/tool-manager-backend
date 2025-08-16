import { Json } from '@/integrations/supabase/types';

export interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: Json;
  saiu: number;
  status: string;
  reserva?: boolean;
  matricula_reserva?: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: string[];
}

export interface Material {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  quantidade_minima: number;
  entrada: number;
  saida: number;
  data_entrada_estoque: string;
  unidade: string;
}

export interface FuncionarioComFerramentas {
  id: string;
  nome: string;
  matricula: string;
  setor: string;
  numero_whatsapp: string;
  ferramentas: Array<{
    tag: string;
    nome: string;
  }>;
}

export interface AdminStats {
  totalFerramentasEmprestadas: number;
  totalFuncionariosComFerramentas: number;
  totalFerramentasCadastradas: number;
  materiaisEstoqueBaixo: Material[];
  ferramentasEstoqueBaixo: Ferramenta[];
  itensEstoqueBaixo: number;
}
