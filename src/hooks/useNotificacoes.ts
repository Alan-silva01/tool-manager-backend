
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificacaoSchema } from '@/utils/validationSchemas';
import { z } from 'zod';
import { apiRequest } from '@/lib/api';

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

      const response = await apiRequest('/api/notificar/solicitar-devolucao', {
        method: 'POST',
        body: JSON.stringify({
          nome: funcionario.nome,
          numero_whatsapp: numeroWhats,
          nome_ferramenta: ferramenta.nome,
          tag_ferramenta: ferramenta.tag,
          data_retirada: ferramenta.data_emprestado || null,
        }),
      });

      if (response.ok) {
        toast({
          title: "Solicitação enviada no WhatsApp",
          description: `Mensagem enviada para ${funcionario.nome} solicitando a devolução da ${ferramenta.nome}.`,
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
