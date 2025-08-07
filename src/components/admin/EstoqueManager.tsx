
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Wrench, 
  Users, 
  Plus,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Material {
  id: string;
  nome: string;
  tag?: number;
  entrada: number;
  saida: number;
  quantidade_minima: number;
  unidade?: string;
  data_entrada_estoque?: string;
}

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
}

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => void;
}

const EstoqueManager: React.FC<EstoqueManagerProps> = ({ materiais, ferramentas, onRefresh }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ferramentas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    tag: '',
    quantidade: '',
    caracteristicas: ''
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria: '',
      tag: '',
      quantidade: '',
      caracteristicas: ''
    });
    setEditingItem(null);
  };

  const formatarCaracteristicas = (texto: string) => {
    if (!texto || texto.trim() === '') {
      return null;
    }

    const textoLimpo = texto.trim();
    
    // Tentar parsear como JSON primeiro
    try {
      const parsed = JSON.parse(textoLimpo);
      return parsed;
    } catch (e) {
      // Se não for JSON válido, tentar converter formato chave:valor
      try {
        const obj: Record<string, string> = {};
        const linhas = textoLimpo.split(/[\n,]/);
        
        let hasValidPairs = false;
        for (const linha of linhas) {
          const partes = linha.split(':');
          if (partes.length >= 2) {
            const chave = partes[0].trim();
            const valor = partes.slice(1).join(':').trim();
            if (chave && valor) {
              obj[chave] = valor;
              hasValidPairs = true;
            }
          }
        }
        
        return hasValidPairs ? obj : null;
      } catch (error) {
        console.error('Erro ao formatar características:', error);
        return null;
      }
    }
  };

  const handleAddFerramenta = async () => {
    try {
      console.log('Dados do formulário:', formData);
      
      const caracteristicasFormatadas = formatarCaracteristicas(formData.caracteristicas);
      console.log('Características formatadas:', caracteristicasFormatadas);

      const dadosParaInserir = {
        nome: formData.nome.trim(),
        categoria: formData.categoria.trim(),
        tag: formData.tag.trim(),
        quantidade: parseInt(formData.quantidade),
        caracteristicas: caracteristicasFormatadas,
        saiu: 0,
        status: 'Disponível'
      };

      console.log('Dados para inserir:', dadosParaInserir);

      const { data, error } = await supabase
        .from('ferramentas')
        .insert([dadosParaInserir])
        .select();

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      console.log('Ferramenta inserida com sucesso:', data);

      toast({
        title: "Sucesso",
        description: "Ferramenta adicionada com sucesso",
      });

      resetForm();
      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a ferramenta",
        variant: "destructive",
      });
    }
  };

  const handleEditFerramenta = async () => {
    try {
      const caracteristicasFormatadas = formatarCaracteristicas(formData.caracteristicas);

      const { error } = await supabase
        .from('ferramentas')
        .update({
          nome: formData.nome.trim(),
          categoria: formData.categoria.trim(),
          tag: formData.tag.trim(),
          quantidade: parseInt(formData.quantidade),
          caracteristicas: caracteristicasFormatadas
        })
        .eq('id', editingItem.id);

      if (error) {
        console.error('Erro ao editar ferramenta:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta atualizada com sucesso",
      });

      resetForm();
      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao editar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível editar a ferramenta",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (ferramenta: Ferramenta) => {
    setEditingItem(ferramenta);
    
    let caracteristicasTexto = '';
    if (ferramenta.caracteristicas && typeof ferramenta.caracteristicas === 'object') {
      try {
        caracteristicasTexto = Object.entries(ferramenta.caracteristicas)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      } catch (e) {
        caracteristicasTexto = JSON.stringify(ferramenta.caracteristicas, null, 2);
      }
    }

    setFormData({
      nome: ferramenta.nome,
      categoria: ferramenta.categoria,
      tag: ferramenta.tag,
      quantidade: ferramenta.quantidade.toString(),
      caracteristicas: caracteristicasTexto
    });
    
    setIsDialogOpen(true);
  };

  const deleteFerramenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ferramentas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ferramenta removida com sucesso",
      });

      onRefresh();
    } catch (error) {
      console.error('Erro ao deletar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a ferramenta",
        variant: "destructive",
      });
    }
  };

  // Calcular estoque baixo
  const materiaisEstoqueBaixo = materiais.filter(material => {
    const quantidadeDisponivel = material.entrada - material.saida;
    return quantidadeDisponivel <= material.quantidade_minima;
  });
  
  const ferramentasEstoqueBaixo = ferramentas.filter(ferramenta => {
    return ferramenta.quantidade <= 2; // Quantidade mínima padrão para ferramentas
  });

  return (
    <div className="space-y-6">
      {/* Alertas de Estoque Baixo */}
      {(materiaisEstoqueBaixo.length > 0 || ferramentasEstoqueBaixo.length > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materiaisEstoqueBaixo.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-orange-800 mb-2">Materiais com estoque baixo:</p>
                <div className="flex flex-wrap gap-2">
                  {materiaisEstoqueBaixo.map((material) => (
                    <Badge key={material.id} variant="destructive">
                      {material.nome} (Disponível: {material.entrada - material.saida})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {ferramentasEstoqueBaixo.length > 0 && (
              <div>
                <p className="font-medium text-orange-800 mb-2">Ferramentas com estoque baixo:</p>
                <div className="flex flex-wrap gap-2">
                  {ferramentasEstoqueBaixo.map((ferramenta) => (
                    <Badge key={ferramenta.id} variant="destructive">
                      {ferramenta.nome} (Disponível: {ferramenta.quantidade})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs de Controle */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>

        {/* Aba Ferramentas */}
        <TabsContent value="ferramentas" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Gerenciar Ferramentas ({ferramentas.length})
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setActiveTab("ferramentas"); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ferramenta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Editar Ferramenta' : 'Adicionar Nova Ferramenta'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Ferramenta</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        placeholder="Ex: Furadeira elétrica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        placeholder="Ex: Elétrica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tag">Tag (Número)</Label>
                      <Input
                        id="tag"
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        placeholder="Ex: 001234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                        placeholder="Ex: 1"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="caracteristicas">Características (Opcional)</Label>
                      <Textarea
                        id="caracteristicas"
                        value={formData.caracteristicas}
                        onChange={(e) => setFormData({...formData, caracteristicas: e.target.value})}
                        placeholder="Digite uma característica por linha no formato 'nome: valor' ou JSON válido. Deixe em branco se não houver características."
                        className="h-20"
                      />
                    </div>
                    <Button 
                      onClick={editingItem ? handleEditFerramenta : handleAddFerramenta}
                      className="w-full"
                      disabled={!formData.nome || !formData.categoria || !formData.tag || !formData.quantidade}
                    >
                      {editingItem ? 'Atualizar Ferramenta' : 'Adicionar Ferramenta'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Categoria</th>
                      <th className="text-left p-2">Tag</th>
                      <th className="text-left p-2">Quantidade</th>
                      <th className="text-left p-2">Características</th>
                      <th className="text-left p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ferramentas.map((ferramenta) => (
                      <tr key={ferramenta.id} className="border-b">
                        <td className="p-2">{ferramenta.nome}</td>
                        <td className="p-2">
                          <Badge variant="outline">{ferramenta.categoria}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="secondary">{ferramenta.tag}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant={ferramenta.quantidade <= 2 ? "destructive" : "default"}>
                            {ferramenta.quantidade}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {ferramenta.caracteristicas ? (
                            <Badge variant="outline">Com características</Badge>
                          ) : (
                            <Badge variant="outline">Sem características</Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(ferramenta)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFerramenta(ferramenta.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ferramentas.length === 0 && (
                  <div className="text-center py-8">
                    <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma ferramenta cadastrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Materiais */}
        <TabsContent value="materiais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Gerenciar Materiais ({materiais.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Tag</th>
                      <th className="text-left p-2">Disponível</th>
                      <th className="text-left p-2">Mínimo</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiais.map((material) => {
                      const disponivel = material.entrada - material.saida;
                      const isLow = disponivel <= material.quantidade_minima;
                      
                      return (
                        <tr key={material.id} className="border-b">
                          <td className="p-2">{material.nome}</td>
                          <td className="p-2">
                            {material.tag && <Badge variant="secondary">{material.tag}</Badge>}
                          </td>
                          <td className="p-2">
                            <Badge variant={isLow ? "destructive" : "default"}>
                              {disponivel} {material.unidade || 'un'}
                            </Badge>
                          </td>
                          <td className="p-2">{material.quantidade_minima}</td>
                          <td className="p-2">
                            <Badge variant={isLow ? "destructive" : "default"}>
                              {isLow ? "Estoque Baixo" : "Normal"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {materiais.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum material cadastrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Funcionários */}
        <TabsContent value="funcionarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações dos Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Para gerenciar funcionários, use a aba "Empréstimos" no menu principal.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManager;
