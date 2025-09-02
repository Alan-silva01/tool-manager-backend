-- Remover políticas restritivas e criar políticas mais permissivas para permitir acesso aos dados

-- Remover políticas existentes para funcionarios
DROP POLICY IF EXISTS "Authenticated users can view funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Authenticated users can manage funcionarios" ON public.funcionarios;

-- Remover políticas existentes para ferramentas
DROP POLICY IF EXISTS "Authenticated users can view ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Authenticated users can manage ferramentas" ON public.ferramentas;

-- Remover políticas existentes para materiais
DROP POLICY IF EXISTS "Authenticated users can view materiais" ON public.materiais;
DROP POLICY IF EXISTS "Authenticated users can manage materiais" ON public.materiais;

-- Remover políticas existentes para registro_mate_funcionarios
DROP POLICY IF EXISTS "Authenticated users can view registro_mate_funcionarios" ON public.registro_mate_funcionarios;
DROP POLICY IF EXISTS "Authenticated users can manage registro_mate_funcionarios" ON public.registro_mate_funcionarios;

-- Criar políticas permissivas que permitem acesso público

-- Políticas para funcionarios
CREATE POLICY "Allow all operations on funcionarios" 
ON public.funcionarios 
FOR ALL 
USING (true);

-- Políticas para ferramentas
CREATE POLICY "Allow all operations on ferramentas" 
ON public.ferramentas 
FOR ALL 
USING (true);

-- Políticas para materiais
CREATE POLICY "Allow all operations on materiais" 
ON public.materiais 
FOR ALL 
USING (true);

-- Políticas para registro_mate_funcionarios
CREATE POLICY "Allow all operations on registro_mate_funcionarios" 
ON public.registro_mate_funcionarios 
FOR ALL 
USING (true);