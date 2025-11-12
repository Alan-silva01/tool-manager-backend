-- Atualizar políticas para ferramentas
DROP POLICY IF EXISTS "Admins can manage ferramentas" ON public.ferramentas;

CREATE POLICY "Admins can manage ferramentas"
ON public.ferramentas
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can view ferramentas"
ON public.ferramentas
FOR SELECT
TO anon
USING (true);

-- Atualizar políticas para funcionarios
DROP POLICY IF EXISTS "Admins can manage funcionarios" ON public.funcionarios;

CREATE POLICY "Admins can manage funcionarios"
ON public.funcionarios
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can view funcionarios"
ON public.funcionarios
FOR SELECT
TO anon
USING (true);

-- Atualizar políticas para materiais
DROP POLICY IF EXISTS "Admins can manage materiais" ON public.materiais;

CREATE POLICY "Admins can manage materiais"
ON public.materiais
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Public can view materiais"
ON public.materiais
FOR SELECT
TO anon
USING (true);