
-- Verificar se RLS está ativo na tabela ferramentas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'ferramentas';

-- Verificar políticas RLS existentes
SELECT * FROM pg_policies WHERE tablename = 'ferramentas';

-- Desabilitar temporariamente RLS para permitir acesso público aos dados
ALTER TABLE public.ferramentas DISABLE ROW LEVEL SECURITY;
