
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCadastroFerramenta } from '@/hooks/useCadastroFerramenta';

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

  const { criarFerramenta, loading } = useCadastroFerramenta();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nome || !formData.tag || !formData.quantidade || !formData.categoria) {
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade < 0) {
      return;
    }

    const resultado = await criarFerramenta({
      nome: formData.nome,
      tag: formData.tag,
      quantidade: quantidade,
      categoria: formData.categoria,
      caracteristicas: formData.caracteristicas
    });

    if (resultado.success) {
      // Limpar formulário
      setFormData({
        nome: '',
        tag: '',
        quantidade: '',
        categoria: '',
        caracteristicas: ''
      });

      // Chamar callback de sucesso se fornecido
      onSuccess?.();
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
        />
      </div>

      <div>
        <Label htmlFor="caracteristicas">Características</Label>
        <Textarea
          id="caracteristicas"
          value={formData.caracteristicas}
          onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
          placeholder="Ex: cor: preta, tensao: 220v, potencia: 500w"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-1">
          Digite as características separadas por vírgula no formato: chave: valor
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Criando...' : 'Criar Ferramenta'}
      </Button>
    </form>
  );
};
