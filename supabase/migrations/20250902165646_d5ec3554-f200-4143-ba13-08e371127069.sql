-- Primeiro, vamos criar uma tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para profiles: usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Política para profiles: usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin');
  RETURN new;
END;
$$;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para verificar se usuário está autenticado
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Agora vamos atualizar as políticas das tabelas existentes
-- Remover políticas antigas
DROP POLICY IF EXISTS "Allow all operations on funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Allow all operations on ferramentas" ON public.ferramentas;
DROP POLICY IF EXISTS "Allow all operations on materiais" ON public.materiais;
DROP POLICY IF EXISTS "Allow all operations on registro_mate_funcionarios" ON public.registro_mate_funcionarios;

-- Criar políticas seguras para funcionarios
CREATE POLICY "Authenticated users can view funcionarios" 
ON public.funcionarios 
FOR SELECT 
USING (public.is_authenticated());

CREATE POLICY "Authenticated users can manage funcionarios" 
ON public.funcionarios 
FOR ALL 
USING (public.is_authenticated());

-- Criar políticas seguras para ferramentas
CREATE POLICY "Authenticated users can view ferramentas" 
ON public.ferramentas 
FOR SELECT 
USING (public.is_authenticated());

CREATE POLICY "Authenticated users can manage ferramentas" 
ON public.ferramentas 
FOR ALL 
USING (public.is_authenticated());

-- Criar políticas seguras para materiais
CREATE POLICY "Authenticated users can view materiais" 
ON public.materiais 
FOR SELECT 
USING (public.is_authenticated());

CREATE POLICY "Authenticated users can manage materiais" 
ON public.materiais 
FOR ALL 
USING (public.is_authenticated());

-- Criar políticas seguras para registro_mate_funcionarios
CREATE POLICY "Authenticated users can view registro_mate_funcionarios" 
ON public.registro_mate_funcionarios 
FOR SELECT 
USING (public.is_authenticated());

CREATE POLICY "Authenticated users can manage registro_mate_funcionarios" 
ON public.registro_mate_funcionarios 
FOR ALL 
USING (public.is_authenticated());

-- Corrigir search_path das funções existentes
CREATE OR REPLACE FUNCTION public.atualizar_estoque_baixo()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  novo_estoque_baixo BOOLEAN;
BEGIN
  -- Calcula se o estoque está baixo
  novo_estoque_baixo := (NEW.entrada - NEW.saida) <= NEW.quantidade_minima;

  -- Atualiza a coluna estoque_baixo
  NEW.estoque_baixo := novo_estoque_baixo;

  -- Se o novo estoque_baixo for true e antes era false, envia para o webhook
  IF novo_estoque_baixo = TRUE AND (OLD.estoque_baixo IS DISTINCT FROM TRUE) THEN
    PERFORM http_post(
      'https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/estoque-baixo',
      'application/json',
      json_build_object(
        'id', NEW.id,
        'entrada', NEW.entrada,
        'saida', NEW.saida,
        'quantidade_minima', NEW.quantidade_minima,
        'estoque_baixo', TRUE
      )::text
    );
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.search_materiais(p_nome character varying DEFAULT NULL::character varying, p_tag numeric DEFAULT NULL::numeric, p_quant integer DEFAULT NULL::integer, p_data_entrada text DEFAULT NULL::text, p_estoque_baixo boolean DEFAULT NULL::boolean)
 RETURNS TABLE(nome text, quantidade_disponivel integer, tag numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        m.nome,
        (COALESCE(m.entrada, 0) - COALESCE(m.saida, 0))::INTEGER AS quantidade_disponivel,
        m.tag
    FROM materiais m
    WHERE
        (p_nome IS NULL OR unaccent(m.nome) ILIKE '%' || unaccent(p_nome) || '%')
        AND (p_tag IS NULL OR m.tag = p_tag)
        AND (p_data_entrada IS NULL OR m.data_entrada_estoque ILIKE '%' || p_data_entrada || '%')
        AND (p_quant IS NULL OR (m.entrada - m.saida) = p_quant)
        AND (p_estoque_baixo IS NULL OR m.estoque_baixo = p_estoque_baixo)
    ORDER BY m.nome ASC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.search_tools(p_nome character varying DEFAULT NULL::character varying, p_tipo character varying DEFAULT NULL::character varying, p_status character varying DEFAULT NULL::character varying, p_quant integer DEFAULT NULL::integer, p_tag character varying DEFAULT NULL::character varying, p_caracteristicas text[] DEFAULT NULL::text[], p_funcionario text DEFAULT NULL::text, p_matricula numeric DEFAULT NULL::numeric, p_data_emprestado text DEFAULT NULL::text, p_reserva boolean DEFAULT NULL::boolean, p_matricula_reserva text DEFAULT NULL::text, p_detalhado boolean DEFAULT false)
 RETURNS TABLE(nome text, tag text, quantidade_disponivel integer, tipo text, status text, quantidade_total integer, caracteristicas jsonb, id uuid, funcionario_emprestado text, matricula numeric, data_emprestado text, reserva boolean, matricula_reserva text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF p_detalhado THEN
        RETURN QUERY
        SELECT 
            f.nome,
            f.tag,
            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,
            f.categoria AS tipo,
            f.status,
            COALESCE(f.quantidade, 0)::INTEGER AS quantidade_total,
            f.caracteristicas,
            f.id,
            f.funcionario_emprestado,
            f.matricula,
            f.data_emprestado,
            f.reserva,
            f.matricula_reserva
        FROM ferramentas f
        WHERE
            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')
            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))
            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))
            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))
            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')
            AND (p_matricula IS NULL OR f.matricula = p_matricula)
            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')
            AND (p_reserva IS NULL OR f.reserva = p_reserva)
            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')
            AND (
                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant
            )
            AND (
                p_caracteristicas IS NULL OR (
                    array_length(p_caracteristicas, 1) > 0 AND
                    EXISTS (
                        SELECT 1
                        FROM unnest(p_caracteristicas) AS c
                        WHERE EXISTS (
                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv
                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'
                        )
                    )
                )
            )
        ORDER BY f.nome ASC;

    ELSE
        RETURN QUERY
        SELECT 
            f.nome,
            f.tag,
            (COALESCE(f.quantidade, 0) - COALESCE(f.saiu, 0))::INTEGER AS quantidade_disponivel,
            NULL::TEXT AS tipo,
            NULL::TEXT AS status,
            NULL::INTEGER AS quantidade_total,
            NULL::JSONB AS caracteristicas,
            NULL::UUID AS id,
            NULL::TEXT AS funcionario_emprestado,
            NULL::NUMERIC AS matricula,
            NULL::TEXT AS data_emprestado,
            NULL::BOOLEAN AS reserva,
            NULL::TEXT AS matricula_reserva
        FROM ferramentas f
        WHERE
            (p_nome IS NULL OR unaccent(f.nome) ILIKE '%' || unaccent(p_nome) || '%')
            AND (p_tipo IS NULL OR unaccent(f.categoria) ILIKE unaccent(p_tipo))
            AND (p_status IS NULL OR unaccent(f.status) ILIKE unaccent(p_status))
            AND (p_tag IS NULL OR unaccent(f.tag) ILIKE unaccent(p_tag))
            AND (p_funcionario IS NULL OR unaccent(f.funcionario_emprestado) ILIKE '%' || unaccent(p_funcionario) || '%')
            AND (p_matricula IS NULL OR f.matricula = p_matricula)
            AND (p_data_emprestado IS NULL OR f.data_emprestado ILIKE '%' || p_data_emprestado || '%')
            AND (p_reserva IS NULL OR f.reserva = p_reserva)
            AND (p_matricula_reserva IS NULL OR f.matricula_reserva ILIKE '%' || p_matricula_reserva || '%')
            AND (
                p_quant IS NULL OR (f.quantidade - f.saiu) = p_quant
            )
            AND (
                p_caracteristicas IS NULL OR (
                    array_length(p_caracteristicas, 1) > 0 AND
                    EXISTS (
                        SELECT 1
                        FROM unnest(p_caracteristicas) AS c
                        WHERE EXISTS (
                            SELECT 1 FROM jsonb_each_text(f.caracteristicas) AS kv
                            WHERE unaccent(kv.value) ILIKE '%' || unaccent(c) || '%'
                        )
                    )
                )
            )
        ORDER BY f.nome ASC;
    END IF;
END;
$function$;