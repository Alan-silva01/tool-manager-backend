-- ============================================================
-- Migration: Tabela Relacional de Histórico e Auditoria de Empréstimos
-- ============================================================

CREATE TABLE IF NOT EXISTS public.historico_emprestimos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    funcionario_nome TEXT NOT NULL,
    funcionario_matricula TEXT NOT NULL,
    item_nome TEXT NOT NULL,
    item_tipo TEXT NOT NULL CHECK (item_tipo IN ('ferramenta', 'material')),
    item_tag TEXT,
    quantidade INT DEFAULT 1,
    tipo_operacao TEXT NOT NULL CHECK (tipo_operacao IN ('retirada', 'devolucao')),
    data_operacao DATE DEFAULT CURRENT_DATE,
    hora_operacao TIME DEFAULT CURRENT_TIME,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para buscas ultrarrápidas por funcionário, tag e período
CREATE INDEX IF NOT EXISTS idx_historico_matricula ON public.historico_emprestimos(funcionario_matricula);
CREATE INDEX IF NOT EXISTS idx_historico_tag ON public.historico_emprestimos(item_tag);
CREATE INDEX IF NOT EXISTS idx_historico_created_at ON public.historico_emprestimos(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.historico_emprestimos ENABLE ROW LEVEL SECURITY;

-- Política de leitura e inserção
CREATE POLICY "Permitir leitura pública autenticada" ON public.historico_emprestimos
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de registros" ON public.historico_emprestimos
    FOR INSERT WITH CHECK (true);
