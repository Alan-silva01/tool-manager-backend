
-- Remover tabelas existentes se houver
DROP TABLE IF EXISTS public.funcionarios CASCADE;
DROP TABLE IF EXISTS public.materiais CASCADE;
DROP TABLE IF EXISTS public.ferramentas CASCADE;

-- Criar tabela funcionarios
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  matricula INTEGER NOT NULL UNIQUE,
  setor TEXT NOT NULL,
  numero_whatsapp TEXT,
  posse_ferramentas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela ferramentas
CREATE TABLE public.ferramentas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tag TEXT NOT NULL UNIQUE,
  quantidade INTEGER NOT NULL DEFAULT 0,
  saiu INTEGER NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela materiais
CREATE TABLE public.materiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tag TEXT NOT NULL UNIQUE,
  quantidade_minima INTEGER NOT NULL DEFAULT 0,
  entrada INTEGER NOT NULL DEFAULT 0,
  saida INTEGER NOT NULL DEFAULT 0,
  data_entrada_estoque TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unidade TEXT DEFAULT 'un',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

-- Políticas para funcionarios (acesso público para leitura e escrita)
CREATE POLICY "Permitir leitura de funcionários" 
  ON public.funcionarios 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção de funcionários" 
  ON public.funcionarios 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de funcionários" 
  ON public.funcionarios 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir exclusão de funcionários" 
  ON public.funcionarios 
  FOR DELETE 
  USING (true);

-- Políticas para ferramentas (acesso público para leitura e escrita)
CREATE POLICY "Permitir leitura de ferramentas" 
  ON public.ferramentas 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção de ferramentas" 
  ON public.ferramentas 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de ferramentas" 
  ON public.ferramentas 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir exclusão de ferramentas" 
  ON public.ferramentas 
  FOR DELETE 
  USING (true);

-- Políticas para materiais (acesso público para leitura e escrita)
CREATE POLICY "Permitir leitura de materiais" 
  ON public.materiais 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção de materiais" 
  ON public.materiais 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir atualização de materiais" 
  ON public.materiais 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir exclusão de materiais" 
  ON public.materiais 
  FOR DELETE 
  USING (true);

-- Criar índices para melhor performance
CREATE INDEX idx_funcionarios_matricula ON public.funcionarios(matricula);
CREATE INDEX idx_ferramentas_tag ON public.ferramentas(tag);
CREATE INDEX idx_materiais_tag ON public.materiais(tag);

-- Inserir alguns dados de exemplo
INSERT INTO public.funcionarios (nome, matricula, setor, numero_whatsapp) VALUES 
('João Silva', 13812, 'Manutenção', '11999999999'),
('Maria Santos', 13813, 'Produção', '11888888888'),
('Carlos Oliveira', 13814, 'Qualidade', '11777777777');

INSERT INTO public.ferramentas (nome, tag, quantidade, saiu, categoria) VALUES 
('Martelo', 'MAR001', 5, 2, 'Ferramentas Manuais'),
('Chave de Fenda', 'CHV001', 10, 1, 'Ferramentas Manuais'),
('Furadeira', 'FUR001', 3, 1, 'Ferramentas Elétricas'),
('Alicate', 'ALI001', 8, 0, 'Ferramentas Manuais');

INSERT INTO public.materiais (nome, tag, quantidade_minima, entrada, saida, unidade) VALUES 
('Parafuso M6', 'PAR001', 100, 500, 120, 'un'),
('Porca M6', 'POR001', 50, 300, 80, 'un'),
('Arruela', 'ARR001', 200, 1000, 300, 'un'),
('Fita Isolante', 'FIT001', 10, 50, 35, 'un');
