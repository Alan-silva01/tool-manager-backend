
-- Verificar se RLS está habilitado na tabela ferramentas
-- Se estiver, vamos criar políticas mais permissivas para leitura

-- Desabilitar RLS temporariamente para debug (se existir)
ALTER TABLE public.ferramentas DISABLE ROW LEVEL SECURITY;

-- Ou se preferir manter RLS, criar política permissiva para SELECT
-- ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;
-- 
-- -- Criar política que permite leitura de todas as ferramentas
-- CREATE POLICY "Allow read access to ferramentas" 
--   ON public.ferramentas 
--   FOR SELECT 
--   USING (true);
