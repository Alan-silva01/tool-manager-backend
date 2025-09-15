-- Atualizar função que contém webhook para novo domínio
CREATE OR REPLACE FUNCTION public.atualizar_estoque_baixo()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
      'https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/estoque-baixo',
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
$function$