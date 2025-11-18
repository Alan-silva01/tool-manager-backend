
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificacaoSchema } from '@/utils/validationSchemas';
import { z } from 'zod';

export const useNotificacoes = () => {
  const { toast } = useToast();
  const [isNotifying, setIsNotifying] = useState<string | null>(null);

  const notificarFuncionario = async (funcionario: any, ferramenta: any) => {
    if (!funcionario.numero_whatsapp) {
      toast({
        title: "Erro",
        description: "Funcionário não possui número de WhatsApp cadastrado",
        variant: "destructive",
      });
      return;
    }

    const notificationKey = `${funcionario.id}-${ferramenta.tag}`;
    setIsNotifying(notificationKey);

    try {
      const numeroWhats = String(funcionario.numero_whatsapp || '').replace(/\D/g, '');
      const webhookData = {
        nome: funcionario.nome,
        setor: funcionario.setor,
        matricula: Number(funcionario.matricula),
        nome_ferramenta: ferramenta.nome,
        tag_ferramenta: ferramenta.tag,
        numero_whatsapp: numeroWhats
      };

      // Validar dados
      try {
        notificacaoSchema.parse(webhookData);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          toast({
            title: "Erro de validação",
            description: validationError.errors[0].message,
            variant: "destructive",
          });
          setIsNotifying(null);
          return;
        }
      }

      // Enviar diretamente em JSON para o webhook (formato antigo, sem autenticação)
      const response = await fetch('https://autonomia-n8n-editor.w8liji.easypanel.host/webhook/notificar-funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        toast({
          title: "Notificação enviada",
          description: `Funcionário ${funcionario.nome} foi notificado sobre a devolução da ${ferramenta.nome}`,
        });
      } else {
        throw new Error('Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao notificar funcionário:', error);
      toast({
        title: "Erro ao notificar",
        description: "Não foi possível enviar a notificação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsNotifying(null);
    }
  };

  return {
    notificarFuncionario,
    isNotifying
  };
};
