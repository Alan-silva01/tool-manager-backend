
-- Habilitar RLS na tabela materiais
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir SELECT público na tabela materiais
CREATE POLICY "Enable read access for all users" ON public.materiais
FOR SELECT USING (true);

-- Criar política para permitir INSERT público na tabela materiais
CREATE POLICY "Enable insert access for all users" ON public.materiais
FOR INSERT WITH CHECK (true);

-- Criar política para permitir UPDATE público na tabela materiais
CREATE POLICY "Enable update access for all users" ON public.materiais
FOR UPDATE USING (true);

-- Criar política para permitir DELETE público na tabela materiais
CREATE POLICY "Enable delete access for all users" ON public.materiais
FOR DELETE USING (true);
