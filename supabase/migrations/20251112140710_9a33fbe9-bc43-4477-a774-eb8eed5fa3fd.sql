-- 1. Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Criar tabela user_roles (CRÍTICO: roles em tabela separada)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 3. Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Policy para user_roles (apenas admins podem ver/gerenciar roles)
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- 5. Criar função security definer para verificar role (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 6. Criar função para verificar se usuário está autenticado
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 7. Atualizar trigger handle_new_user para adicionar role admin ao primeiro usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atualizar profiles
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  
  -- Adicionar role admin na tabela user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'admin');
  
  RETURN new;
END;
$$;

-- 8. Atualizar RLS policies para funcionarios (apenas admins autenticados)
DROP POLICY IF EXISTS "Allow all operations on funcionarios" ON public.funcionarios;

CREATE POLICY "Admins can manage funcionarios"
ON public.funcionarios
FOR ALL
USING (public.is_admin());

-- 9. Atualizar RLS policies para ferramentas (apenas admins autenticados)
DROP POLICY IF EXISTS "Allow all operations on ferramentas" ON public.ferramentas;

CREATE POLICY "Admins can manage ferramentas"
ON public.ferramentas
FOR ALL
USING (public.is_admin());

-- 10. Atualizar RLS policies para materiais (apenas admins autenticados)
DROP POLICY IF EXISTS "Allow all operations on materiais" ON public.materiais;

CREATE POLICY "Admins can manage materiais"
ON public.materiais
FOR ALL
USING (public.is_admin());

-- 11. Atualizar RLS policies para registro_mate_funcionarios (apenas admins autenticados)
DROP POLICY IF EXISTS "Allow all operations on registro_mate_funcionarios" ON public.registro_mate_funcionarios;

CREATE POLICY "Admins can manage registro_mate_funcionarios"
ON public.registro_mate_funcionarios
FOR ALL
USING (public.is_admin());