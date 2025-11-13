
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificacaoSchema } from '@/utils/validationSchemas';
import { signWebhookPayload } from '@/utils/webhookAuth';
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
      const webhookData = {
        nome: funcionario.nome,
        setor: funcionario.setor,
        matricula: funcionario.matricula,
        nome_ferramenta: ferramenta.nome,
        tag_ferramenta: ferramenta.tag,
        numero_whatsapp: funcionario.numero_whatsapp
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

      // Assinar payload
      const signature = await signWebhookPayload(webhookData);

      const response = await fetch('https://yjgwfwbyzufrwbkcbtzy.supabase.co/functions/v1/send-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/notificar-funcionario',
          data: webhookData,
          signature,
        }),
      });

      const result = await response.json();
      
      if (result.ok) {
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
