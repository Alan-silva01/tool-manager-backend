
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== INÍCIO DO HANDLESUBMIT ===');
    console.log('FormData:', formData);
    
    if (!formData.nome || !formData.tag || !formData.quantidade || !formData.categoria) {
      console.log('=== VALIDAÇÃO FALHOU ===');
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    console.log('=== VALIDAÇÃO PASSOU ===');
    setLoading(true);

    try {
      const webhookData = {
        nome: formData.nome,
        tag: formData.tag,
        quantidade: parseInt(formData.quantidade) || 0,
        categoria: formData.categoria,
        caracteristicas: formData.caracteristicas
      };

      console.log('=== ENVIANDO PARA WEBHOOK ===');
      console.log('URL:', 'https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/salvar-ferramenta');
      console.log('Data:', webhookData);

      const response = await fetch('https://autonomia-n8n-webhook.gm2doz.easypanel.host/webhook/salvar-ferramenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('=== RESPOSTA DO WEBHOOK ===');
      console.log('Status:', response.status);
      console.log('StatusText:', response.statusText);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        console.log('=== WEBHOOK SUCESSO - LIMPANDO FORM ===');
        setFormData({
          nome: '',
          tag: '',
          quantidade: '',
          categoria: '',
          caracteristicas: ''
        });

        console.log('=== MOSTRANDO TOAST DE SUCESSO ===');
        toast({
          title: "Sucesso",
          description: "Ferramenta cadastrada com sucesso!",
        });
      } else {
        const errorText = await response.text();
        console.error('=== ERRO NA RESPOSTA DO WEBHOOK ===', errorText);
        throw new Error(`Erro no webhook: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('=== ERRO NO CATCH ===', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar ferramenta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('=== FIM DO HANDLESUBMIT ===');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`=== INPUT CHANGE === ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log('=== RENDER CriarFerramenta ===');
  console.log('Loading state:', loading);

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
