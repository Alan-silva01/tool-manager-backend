
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCadastroFerramenta } from "@/hooks/useCadastroFerramenta";

interface CadastroFerramentaProps {
  onSuccess?: () => void;
}

export const CadastroFerramenta = ({ onSuccess }: CadastroFerramentaProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    tag: '',
    quantidade: '',
    categoria: '',
    caracteristicas: ''
  });

  const { cadastrarFerramenta, loading } = useCadastroFerramenta();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome.trim() || !formData.tag.trim() || !formData.quantidade || !formData.categoria.trim()) {
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (quantidade <= 0) {
      return;
    }

    const resultado = await cadastrarFerramenta({
      nome: formData.nome.trim(),
      tag: formData.tag.trim(),
      quantidade: quantidade,
      categoria: formData.categoria.trim(),
      caracteristicas: formData.caracteristicas.trim()
    });

    if (resultado) {
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        tag: '',
        quantidade: '',
        categoria: '',
        caracteristicas: ''
      });
      
      // Callback de sucesso
      onSuccess?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Nova Ferramenta</CardTitle>
        <CardDescription>
          Preencha os dados para cadastrar uma nova ferramenta no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Ferramenta *</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Furadeira"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag *</Label>
              <Input
                id="tag"
                type="text"
                value={formData.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                placeholder="Ex: FUR001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => handleInputChange('quantidade', e.target.value)}
                placeholder="Ex: 5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Input
                id="categoria"
                type="text"
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                placeholder="Ex: Elétrica"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caracteristicas">Características</Label>
            <Textarea
              id="caracteristicas"
              value={formData.caracteristicas}
              onChange={(e) => handleInputChange('caracteristicas', e.target.value)}
              placeholder="Ex: cor: preta, tensao: 220v, potencia: 500w"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Digite as características separadas por vírgula no formato: chave: valor
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Ferramenta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
