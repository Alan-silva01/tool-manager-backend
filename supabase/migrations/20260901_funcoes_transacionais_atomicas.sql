-- ====================================================================
-- MIGRATION: Funções Transacionais Atômicas (Prevenção de Race Conditions)
-- ====================================================================

-- 1. Função Atômica para RETIRADA de Ferramenta / Material
CREATE OR REPLACE FUNCTION public.realizar_retirada_atomica(
    p_matricula TEXT,
    p_item_id UUID,
    p_item_tipo TEXT, -- 'ferramenta' ou 'material'
    p_quantidade INT DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_func RECORD;
    v_item_ferramenta RECORD;
    v_item_material RECORD;
    v_qtd_atual INT;
    v_posse_atual JSONB;
    v_tag TEXT;
BEGIN
    -- 1. Busca e trava a linha do funcionário (FOR UPDATE)
    SELECT * INTO v_func
    FROM public.funcionarios
    WHERE matricula = p_matricula
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Funcionário não encontrado com a matrícula informada.');
    END IF;

    -- 2. Processa FERRAMENTA
    IF p_item_tipo = 'ferramenta' THEN
        SELECT * INTO v_item_ferramenta
        FROM public.ferramentas
        WHERE id = p_item_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('sucesso', false, 'erro', 'Ferramenta não encontrada.');
        END IF;

        v_tag := v_item_ferramenta.tag;
        v_qtd_atual := GREATEST(0, COALESCE(v_item_ferramenta.quantidade, 1) - COALESCE(v_item_ferramenta.saiu, 0));

        IF v_qtd_atual <= 0 THEN
            RETURN jsonb_build_object('sucesso', false, 'erro', 'Ferramenta indisponível no momento (já emprestada).');
        END IF;

        -- Incrementa saída na ferramenta
        UPDATE public.ferramentas
        SET saiu = COALESCE(saiu, 0) + 1,
            status = 'emprestada'
        WHERE id = p_item_id;

        -- Adiciona a tag na posse_ferramentas do funcionário
        v_posse_atual := COALESCE(v_func.posse_ferramentas, '[]'::jsonb);
        IF NOT (v_posse_atual ? v_tag) THEN
            UPDATE public.funcionarios
            SET posse_ferramentas = v_posse_atual || jsonb_build_array(v_tag)
            WHERE id = v_func.id;
        END IF;

    -- 3. Processa MATERIAL de consumo
    ELSIF p_item_tipo = 'material' THEN
        SELECT * INTO v_item_material
        FROM public.materiais
        WHERE id = p_item_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('sucesso', false, 'erro', 'Material não encontrado.');
        END IF;

        v_qtd_atual := GREATEST(0, COALESCE(v_item_material.entrada, 0) - COALESCE(v_item_material.saida, 0));

        IF v_qtd_atual < p_quantidade THEN
            RETURN jsonb_build_object('sucesso', false, 'erro', 'Quantidade solicitada maior que o estoque disponível.');
        END IF;

        -- Incrementa saída no material
        UPDATE public.materiais
        SET saida = COALESCE(saida, 0) + p_quantidade,
            estoque_baixo = ((COALESCE(entrada, 0) - (COALESCE(saida, 0) + p_quantidade)) <= COALESCE(quantidade_minima, 5))
        WHERE id = p_item_id;

    ELSE
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Tipo de item inválido.');
    END IF;

    -- 4. Grava na tabela de histórico de auditoria
    INSERT INTO public.historico_emprestimos (
        funcionario_id,
        funcionario_nome,
        funcionario_matricula,
        item_nome,
        item_tipo,
        item_tag,
        quantidade,
        tipo_operacao
    ) VALUES (
        v_func.id,
        v_func.nome,
        v_func.matricula,
        COALESCE(v_item_ferramenta.nome, v_item_material.nome),
        p_item_tipo,
        v_tag,
        p_quantidade,
        'retirada'
    );

    RETURN jsonb_build_object(
        'sucesso', true,
        'funcionario_nome', v_func.nome,
        'item_nome', COALESCE(v_item_ferramenta.nome, v_item_material.nome)
    );
END;
$$;


-- 2. Função Atômica para DEVOLUÇÃO de Ferramenta
CREATE OR REPLACE FUNCTION public.realizar_devolucao_atomica(
    p_matricula TEXT,
    p_ferramenta_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_func RECORD;
    v_item_ferramenta RECORD;
    v_posse_atual JSONB;
    v_nova_posse JSONB := '[]'::jsonb;
    v_elem JSONB;
    v_tag TEXT;
BEGIN
    -- 1. Trava funcionário
    SELECT * INTO v_func
    FROM public.funcionarios
    WHERE matricula = p_matricula
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Funcionário não encontrado.');
    END IF;

    -- 2. Trava ferramenta
    SELECT * INTO v_item_ferramenta
    FROM public.ferramentas
    WHERE id = p_ferramenta_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Ferramenta não encontrada.');
    END IF;

    v_tag := v_item_ferramenta.tag;

    -- Decrementa saída e altera status para disponível
    UPDATE public.ferramentas
    SET saiu = GREATEST(0, COALESCE(saiu, 1) - 1),
        status = 'disponível'
    WHERE id = p_ferramenta_id;

    -- Remove a tag do array de posse do funcionário
    v_posse_atual := COALESCE(v_func.posse_ferramentas, '[]'::jsonb);
    FOR v_elem IN SELECT * FROM jsonb_array_elements_text(v_posse_atual)
    LOOP
        IF v_elem::text <> v_tag THEN
            v_nova_posse := v_nova_posse || to_jsonb(v_elem::text);
        END IF;
    END LOOP;

    UPDATE public.funcionarios
    SET posse_ferramentas = v_nova_posse
    WHERE id = v_func.id;

    -- Grava histórico de devolução
    INSERT INTO public.historico_emprestimos (
        funcionario_id,
        funcionario_nome,
        funcionario_matricula,
        item_nome,
        item_tipo,
        item_tag,
        quantidade,
        tipo_operacao
    ) VALUES (
        v_func.id,
        v_func.nome,
        v_func.matricula,
        v_item_ferramenta.nome,
        'ferramenta',
        v_tag,
        1,
        'devolucao'
    );

    RETURN jsonb_build_object(
        'sucesso', true,
        'funcionario_nome', v_func.nome,
        'item_nome', v_item_ferramenta.nome
    );
END;
$$;
