
-- Habilitar RLS na tabela funcionarios
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir SELECT público na tabela funcionarios
CREATE POLICY "Enable read access for all users" ON public.funcionarios
FOR SELECT USING (true);

-- Criar política para permitir INSERT público na tabela funcionarios
CREATE POLICY "Enable insert access for all users" ON public.funcionarios
FOR INSERT WITH CHECK (true);

-- Criar política para permitir UPDATE público na tabela funcionarios
CREATE POLICY "Enable update access for all users" ON public.funcionarios
FOR UPDATE USING (true);

-- Criar política para permitir DELETE público na tabela funcionarios
CREATE POLICY "Enable delete access for all users" ON public.funcionarios
FOR DELETE USING (true);
