
-- Add the caracteristicas column to the ferramentas table
ALTER TABLE public.ferramentas 
ADD COLUMN IF NOT EXISTS caracteristicas jsonb DEFAULT '{}'::jsonb;
