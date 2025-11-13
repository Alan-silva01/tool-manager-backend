import { z } from 'zod';

export const funcionarioValidationSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  setor: z.string().trim().min(1, "Setor é obrigatório").max(50, "Setor muito longo"),
  matricula: z.number().int().positive("Matrícula deve ser positiva").max(999999, "Matrícula inválida"),
  numero_whatsapp: z.string().regex(/^\+?55\d{10,11}$/, "Formato de WhatsApp inválido").optional(),
});

export const ferramentaValidationSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  tag: z.string().trim().min(1, "Tag é obrigatória").max(50, "Tag muito longa"),
  quantidade: z.number().int().positive("Quantidade deve ser positiva").max(10000, "Quantidade muito alta"),
  categoria: z.string().trim().min(1, "Categoria é obrigatória").max(50, "Categoria muito longa"),
  caracteristicas: z.string().max(500, "Características muito longas").optional(),
});

export const pegarFerramentaSchema = z.object({
  funcionario_matricula: z.string().trim().min(1, "Matrícula é obrigatória"),
  funcionario_nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  item_nome: z.string().trim().min(1, "Nome do item é obrigatório").max(100),
  item_tag: z.string().trim().min(1, "Tag é obrigatória").max(50),
  data: z.string().trim().min(1, "Data é obrigatória"),
});

export const devolverFerramentaSchema = z.object({
  funcionario_matricula: z.string().trim().min(1, "Matrícula é obrigatória"),
  funcionario_nome: z.string().trim().min(1, "Nome é obrigatório").max(100),
  item_nome: z.string().trim().min(1, "Nome do item é obrigatório").max(100),
  item_tag: z.string().trim().min(1, "Tag é obrigatória").max(50),
  data: z.string().trim().min(1, "Data é obrigatória"),
});

export const notificacaoSchema = z.object({
  nome: z.string().trim().min(1).max(100),
  setor: z.string().trim().min(1).max(50),
  matricula: z.coerce.number().int().positive(),
  nome_ferramenta: z.string().trim().min(1).max(100),
  tag_ferramenta: z.string().trim().min(1).max(50),
  numero_whatsapp: z.string().regex(/^\+?55\d{10,11}$/),
});
