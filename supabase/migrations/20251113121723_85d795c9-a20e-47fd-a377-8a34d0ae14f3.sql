-- Habilitar REPLICA IDENTITY FULL para capturar dados completos durante updates
ALTER TABLE public.funcionarios REPLICA IDENTITY FULL;
ALTER TABLE public.ferramentas REPLICA IDENTITY FULL;
ALTER TABLE public.materiais REPLICA IDENTITY FULL;
ALTER TABLE public.registro_mate_funcionarios REPLICA IDENTITY FULL;

-- Adicionar tabelas à publication do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.funcionarios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ferramentas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.materiais;
ALTER PUBLICATION supabase_realtime ADD TABLE public.registro_mate_funcionarios;