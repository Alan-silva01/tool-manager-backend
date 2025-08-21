-- Fix security vulnerabilities by implementing proper RLS policies

-- Drop existing overly permissive policies for funcionarios table
DROP POLICY IF EXISTS "Permitir leitura de funcionários" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir inserção de funcionários" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir atualização de funcionários" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir exclusão de funcionários" ON public.funcionarios;

-- Drop existing overly permissive policies for ferramentas table
DROP POLICY IF EXISTS "Permitir leitura de ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Permitir inserção de ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Permitir atualização de ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Permitir exclusão de ferramentas" ON public.ferramentas;

-- Drop existing overly permissive policies for materiais table
DROP POLICY IF EXISTS "Permitir leitura de materiais" ON public.materiais;
DROP POLICY IF EXISTS "Permitir inserção de materiais" ON public.materiais;
DROP POLICY IF EXISTS "Permitir atualização de materiais" ON public.materiais;
DROP POLICY IF EXISTS "Permitir exclusão de materiais" ON public.materiais;

-- Drop existing overly permissive policies for registro_mate_funcionarios table
DROP POLICY IF EXISTS "Permitir leitura de registros de materiais" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Permitir inserção de registros de materiais" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Permitir atualização de registros de materiais" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Permitir exclusão de registros de materiais" ON public.registro_mate_funcionarios;

-- Create secure RLS policies for funcionarios table
-- Only authenticated users can view employee data
CREATE POLICY "Authenticated users can view funcionarios"
ON public.funcionarios
FOR SELECT
USING (auth.role() = 'authenticated');

-- Only authenticated users can insert new employees
CREATE POLICY "Authenticated users can insert funcionarios"
ON public.funcionarios
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update employee data
CREATE POLICY "Authenticated users can update funcionarios"
ON public.funcionarios
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Only authenticated users can delete employees
CREATE POLICY "Authenticated users can delete funcionarios"
ON public.funcionarios
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create secure RLS policies for ferramentas table
CREATE POLICY "Authenticated users can view ferramentas"
ON public.ferramentas
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert ferramentas"
ON public.ferramentas
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ferramentas"
ON public.ferramentas
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete ferramentas"
ON public.ferramentas
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create secure RLS policies for materiais table
CREATE POLICY "Authenticated users can view materiais"
ON public.materiais
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert materiais"
ON public.materiais
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update materiais"
ON public.materiais
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete materiais"
ON public.materiais
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create secure RLS policies for registro_mate_funcionarios table
CREATE POLICY "Authenticated users can view material usage records"
ON public.registro_mate_funcionarios
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert material usage records"
ON public.registro_mate_funcionarios
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update material usage records"
ON public.registro_mate_funcionarios
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete material usage records"
ON public.registro_mate_funcionarios
FOR DELETE
USING (auth.role() = 'authenticated');