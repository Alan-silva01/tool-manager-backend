
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CriarFerramentaProps {
  onSuccess?: () => void;
}

export const CriarFerramenta = ({ onSuccess }: CriarFerramentaProps) => {
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

    // Validações básicas
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.tag.trim()) {
      toast({
        title: "Erro",
        description: "Tag é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (!formData.quantidade.trim()) {
      toast({
        title: "Erro",
        description: "Quantidade é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria.trim()) {
      toast({
        title: "Erro",
        description: "Categoria é obrigatória",
        variant: "destructive",
      });
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade < 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser um número válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando dados para o webhook:', formData);

      // Preparar dados para envio
      const webhookData = {
        nome: formData.nome.trim(),
        tag: formData.tag.trim(),
        quantidade: quantidade,
        categoria: formData.categoria.trim(),
        caracteristicas: formData.caracteristicas.trim()
      };

      console.log('Dados do webhook:', webhookData);

      const response = await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/salvar-ferramenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('Resposta do webhook:', response.status, response.statusText);

      if (response.ok) {
        console.log('Ferramenta salva com sucesso via webhook');
        
        toast({
          title: "Sucesso",
          description: "Ferramenta criada com sucesso!",
        });

        // Limpar formulário
        setFormData({
          nome: '',
          tag: '',
          quantidade: '',
          categoria: '',
          caracteristicas: ''
        });

        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorText = await response.text();
        console.error('Erro do webhook:', response.status, errorText);
        throw new Error(`Erro do webhook: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ferramenta. Tente novamente.",
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
          required
          disabled={loading}
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
          required
          disabled={loading}
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
          required
          disabled={loading}
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
          required
          disabled={loading}
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
        <p className="text-sm text-gray-500 mt-1">
          Digite as características separadas por vírgula no formato: chave: valor (opcional)
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Salvando...' : 'Criar Ferramenta'}
      </Button>
    </form>
  );
};
