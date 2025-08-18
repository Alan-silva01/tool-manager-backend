import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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

  // Nova função dedicada a enviar dados ao webhook (sem qualquer interação com banco)
  const enviarParaWebhook = async (payload: {
    nome: string;
    tag: string;
    quantidade: number;
    categoria: string;
    caracteristicas?: string;
  }) => {
    const url = 'https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/salvar-ferramenta';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Erro no webhook: ${response.status} - ${errorText}`);
    }
  };

  // Nova função de submit (recriada) que usa apenas o webhook
  const onSubmitFerramenta = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples (mantida)
    if (!formData.nome || !formData.tag || !formData.quantidade || !formData.categoria) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        tag: formData.tag,
        quantidade: parseInt(formData.quantidade, 10) || 0,
        categoria: formData.categoria,
        caracteristicas: formData.caracteristicas || '',
      };

      await enviarParaWebhook(payload);

      // Reset do formulário
      setFormData({
        nome: '',
        tag: '',
        quantidade: '',
        categoria: '',
        caracteristicas: ''
      });

      // Mensagem de sucesso solicitada
      toast({
        title: 'Sucesso',
        description: 'Ferramenta adicionada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao enviar ferramenta para o webhook:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar ferramenta. Tente novamente.',
        variant: 'destructive',
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

  console.log('=== RENDER CriarFerramenta ===');
  console.log('Loading state:', loading);

  return (
    <form onSubmit={onSubmitFerramenta} className="space-y-4">
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
