-- Create secure RPC function to validate employees without exposing all data
CREATE OR REPLACE FUNCTION public.validate_employee(p_matricula numeric)
RETURNS TABLE(
  nome text,
  setor text,
  posse_ferramentas jsonb
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.nome,
    f.setor::text,
    f.posse_ferramentas
  FROM funcionarios f
  WHERE f.matricula = p_matricula;
END;
$$;

-- Remove public SELECT policy on funcionarios to prevent data exposure
DROP POLICY IF EXISTS "Public can view funcionarios" ON funcionarios;