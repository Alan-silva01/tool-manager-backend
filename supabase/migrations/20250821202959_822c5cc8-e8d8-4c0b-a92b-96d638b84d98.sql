
-- Ajustar as políticas RLS para permitir acesso aos dados
-- Removendo as políticas muito restritivas e criando novas mais permissivas

-- Remover políticas existentes da tabela funcionarios
DROP POLICY IF EXISTS "Authenticated users can view funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Authenticated users can insert funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Authenticated users can update funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Authenticated users can delete funcionarios" ON public.funcionarios;

-- Remover políticas existentes da tabela ferramentas
DROP POLICY IF EXISTS "Authenticated users can view ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Authenticated users can insert ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Authenticated users can update ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Authenticated users can delete ferramentas" ON public.ferramentas;

-- Remover políticas existentes da tabela materiais
DROP POLICY IF EXISTS "Authenticated users can view materiais" ON public.materiais;
DROP POLICY IF EXISTS "Authenticated users can insert materiais" ON public.materiais;
DROP POLICY IF EXISTS "Authenticated users can update materiais" ON public.materiais;
DROP POLICY IF EXISTS "Authenticated users can delete materiais" ON public.materiais;

-- Remover políticas existentes da tabela registro_mate_funcionarios
DROP POLICY IF EXISTS "Authenticated users can view material usage records" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Authenticated users can insert material usage records" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Authenticated users can update material usage records" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Authenticated users can delete material usage records" ON public.registro_mate_funcionarios;

-- Criar políticas mais permissivas para funcionarios
CREATE POLICY "Allow all operations on funcionarios" ON public.funcionarios FOR ALL USING (true);

-- Criar políticas mais permissivas para ferramentas
CREATE POLICY "Allow all operations on ferramentas" ON public.ferramentas FOR ALL USING (true);

-- Criar políticas mais permissivas para materiais
CREATE POLICY "Allow all operations on materiais" ON public.materiais FOR ALL USING (true);

-- Criar políticas mais permissivas para registro_mate_funcionarios
CREATE POLICY "Allow all operations on registro_mate_funcionarios" ON public.registro_mate_funcionarios FOR ALL USING (true);
