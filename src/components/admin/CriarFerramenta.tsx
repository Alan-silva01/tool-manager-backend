
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ferramentaValidationSchema } from '@/utils/validationSchemas';
import { signWebhookPayload, getAuthHeaders } from '@/utils/webhookAuth';
import { z } from 'zod';

export const CriarFerramenta = () => {
  const [formData, setFormData] = useState({
    nome: '',
    tag: '',
    quantidade: '',
    categoria: '',
    caracteristicas: ''
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tag || !formData.quantidade || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const webhookData = {
        nome: formData.nome,
        tag: formData.tag,
        quantidade: parseInt(formData.quantidade) || 0,
        categoria: formData.categoria,
        caracteristicas: formData.caracteristicas
      };

      // Validar dados
      try {
        ferramentaValidationSchema.parse(webhookData);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          toast({
            title: "Erro de validação",
            description: validationError.errors[0].message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Assinar payload
      const signature = await signWebhookPayload(webhookData);
      const headers = getAuthHeaders(signature);

      const response = await fetch('https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/salvar-ferramenta', {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        setFormData({
          nome: '',
          tag: '',
          quantidade: '',
          categoria: '',
          caracteristicas: ''
        });

        toast({
          title: "Sucesso",
          description: "Ferramenta cadastrada com sucesso!",
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Erro no webhook: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar ferramenta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Ferramenta</Label>
        <Input
          id="nome"
          type="text"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          placeholder="Digite o nome da ferramenta"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="tag">Tag</Label>
        <Input
          id="tag"
          type="text"
          value={formData.tag}
          onChange={(e) => handleInputChange('tag', e.target.value)}
          placeholder="Digite a tag da ferramenta"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="quantidade">Quantidade</Label>
        <Input
          id="quantidade"
          type="number"
          min="0"
          value={formData.quantidade}
          onChange={(e) => handleInputChange('quantidade', e.target.value)}
          placeholder="Digite a quantidade"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Input
          id="categoria"
          type="text"
          value={formData.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          placeholder="Digite a categoria"
          disabled={loading}
          required
        />
      </div>

      <div>
        <Label htmlFor="caracteristicas">Características (opcional)</Label>
        <Textarea
          id="caracteristicas"
          value={formData.caracteristicas}
          onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
          placeholder="Ex: cor: preta, tensao: 220v, potencia: 500w"
          rows={3}
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar Ferramenta'}
      </Button>
    </form>
  );
};
