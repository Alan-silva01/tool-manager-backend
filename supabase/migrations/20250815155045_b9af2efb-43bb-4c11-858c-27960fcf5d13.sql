
-- Habilitar RLS na tabela registro_mate_funcionarios
ALTER TABLE public.registro_mate_funcionarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de todos os registros de materiais
CREATE POLICY "Permitir leitura de registros de materiais" 
ON public.registro_mate_funcionarios
FOR SELECT 
TO authenticated, anon
USING (true);

-- Política para permitir inserção de registros de materiais
CREATE POLICY "Permitir inserção de registros de materiais" 
ON public.registro_mate_funcionarios
FOR INSERT 
TO authenticated, anon
WITH CHECK (true);

-- Política para permitir atualização de registros de materiais
CREATE POLICY "Permitir atualização de registros de materiais" 
ON public.registro_mate_funcionarios
FOR UPDATE 
TO authenticated, anon
USING (true);

-- Política para permitir exclusão de registros de materiais
CREATE POLICY "Permitir exclusão de registros de materiais" 
ON public.registro_mate_funcionarios
FOR DELETE 
TO authenticated, anon
USING (true);
