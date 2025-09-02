-- Corrigir a tabela n8n_chat_avb que estava sem políticas RLS
CREATE POLICY "Authenticated users can manage n8n_chat_avb" 
ON public.n8n_chat_avb 
FOR ALL 
USING (public.is_authenticated());