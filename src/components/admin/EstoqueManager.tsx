import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Wrench, 
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EstoqueManagerProps {
  materiais: any[];
  ferramentas: any[];
  onRefresh: () => void;
}

const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("materiais");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: "",
    tag: "",
    quantidade: "",
    categoria: "",
    caracteristicas: "",
    quantidade_minima: "",
    entrada: "",
    saida: "",
    unidade: ""
  });

  // Função para formatar características
  const formatarCaracteristicas = (caracteristicas: string) => {
    if (!caracteristicas || caracteristicas.trim() === '') {
      return null;
    }
    
    try {
      // Tentar parsear como JSON primeiro
      const parsed = JSON.parse(caracteristicas);
      return parsed;
    } catch {
      // Se não for JSON válido, criar um objeto com a string
      return { descricao: caracteristicas.trim() };
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      tag: "",
      quantidade: "",
      categoria: "",
      caracteristicas: "",
      quantidade_minima: "",
      entrada: "",
      saida: "",
      unidade: ""
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (activeTab === "materiais") {
        const materialData = {
          nome: formData.nome,
          entrada: parseFloat(formData.entrada) || 0,
          saida: parseFloat(formData.saida) || 0,
          quantidade_minima: parseFloat(formData.quantidade_minima) || 0,
          unidade: formData.unidade || null
        };

        if (editingItem) {
          const { error } = await supabase
            .from('materiais')
            .update(materialData)
            .eq('id', editingItem.id);

          if (error) throw error;
          
          toast({
            title: "Material atualizado",
            description: "Material foi atualizado com sucesso",
          });
        } else {
          const { error } = await supabase
            .from('materiais')
            .insert([materialData]);

          if (error) throw error;
          
          toast({
            title: "Material cadastrado",
            description: "Material foi cadastrado com sucesso",
          });
        }
      } else {
        const ferramentaData = {
          nome: formData.nome,
          tag: formData.tag,
          quantidade: parseFloat(formData.quantidade) || 0,
          saiu: 0,
          categoria: formData.categoria,
          caracteristicas: formatarCaracteristicas(formData.caracteristicas)
        };

        console.log('Dados da ferramenta para salvar:', ferramentaData);

        if (editingItem) {
          const { error } = await supabase
            .from('ferramentas')
            .update(ferramentaData)
            .eq('id', editingItem.id);

          if (error) {
            console.error('Erro ao atualizar ferramenta:', error);
            throw error;
          }
          
          toast({
            title: "Ferramenta atualizada",
            description: "Ferramenta foi atualizada com sucesso",
          });
        } else {
          const { error } = await supabase
            .from('ferramentas')
            .insert([ferramentaData]);

          if (error) {
            console.error('Erro ao inserir ferramenta:', error);
            throw error;
          }
          
          toast({
            title: "Ferramenta cadastrada",
            description: "Ferramenta foi cadastrada com sucesso",
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Erro na operação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a operação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    
    if (activeTab === "materiais") {
      setFormData({
        nome: item.nome || "",
        tag: "",
        quantidade: "",
        categoria: "",
        caracteristicas: "",
        quantidade_minima: item.quantidade_minima?.toString() || "",
        entrada: item.entrada?.toString() || "",
        saida: item.saida?.toString() || "",
        unidade: item.unidade || ""
      });
    } else {
      // Para ferramentas, extrair características do JSON
      let caracteristicasString = "";
      if (item.caracteristicas) {
        if (typeof item.caracteristicas === 'object') {
          if (item.caracteristicas.descricao) {
            caracteristicasString = item.caracteristicas.descricao;
          } else {
            caracteristicasString = JSON.stringify(item.caracteristicas);
          }
        } else {
          caracteristicasString = item.caracteristicas.toString();
        }
      }
      
      setFormData({
        nome: item.nome || "",
        tag: item.tag || "",
        quantidade: (item.quantidade + item.saiu)?.toString() || "", // Quantidade total (disponível + saiu)
        categoria: item.categoria || "",
        caracteristicas: caracteristicasString,
        quantidade_minima: "",
        entrada: "",
        saida: "",
        unidade: ""
      });
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const table = activeTab === "materiais" ? "materiais" : "ferramentas";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: `${activeTab === "materiais" ? "Material" : "Ferramenta"} removido`,
        description: `${activeTab === "materiais" ? "Material" : "Ferramenta"} foi removido com sucesso`,
      });
      
      onRefresh();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Filtrar itens baseado na busca
  const filteredMateriais = materiais.filter(material =>
    material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.unidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFerramentas = ferramentas.filter(ferramenta =>
    ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estoque baixo
  const materiaisEstoqueBaixo = materiais.filter(material => {
    const quantidadeDisponivel = material.entrada - material.saida;
    return quantidadeDisponivel <= material.quantidade_minima;
  });

  const ferramentasEstoqueBaixo = ferramentas.filter(ferramenta => ferramenta.quantidade <= 2);

  return (
    <div className="space-y-6">
      {/* Alertas de Estoque Baixo */}
      {(materiaisEstoqueBaixo.length > 0 || ferramentasEstoqueBaixo.length > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {materiaisEstoqueBaixo.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                  <div>
                    <span className="font-medium">{material.nome}</span>
                    <Badge variant="destructive" className="ml-2">
                      Estoque: {material.entrada - material.saida} (mín: {material.quantidade_minima})
                    </Badge>
                  </div>
                </div>
              ))}
              {ferramentasEstoqueBaixo.map((ferramenta) => (
                <div key={ferramenta.id} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                  <div>
                    <span className="font-medium">{ferramenta.nome}</span>
                    <Badge variant="destructive" className="ml-2">
                      Disponível: {ferramenta.quantidade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="materiais" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Materiais ({materiais.length})
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Ferramentas ({ferramentas.length})
            </TabsTrigger>
          </TabsList>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar {activeTab === "materiais" ? "Material" : "Ferramenta"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar" : "Adicionar"} {activeTab === "materiais" ? "Material" : "Ferramenta"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Nome do item"
                  />
                </div>

                {activeTab === "ferramentas" && (
                  <>
                    <div>
                      <Label htmlFor="tag">Tag</Label>
                      <Input
                        id="tag"
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        placeholder="Tag da ferramenta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidade">Quantidade Total</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                        placeholder="Quantidade total"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Segurança">Segurança</SelectItem>
                          <SelectItem value="Construção">Construção</SelectItem>
                          <SelectItem value="Elétrica">Elétrica</SelectItem>
                          <SelectItem value="Medição">Medição</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="caracteristicas">Características (Opcional)</Label>
                      <Textarea
                        id="caracteristicas"
                        value={formData.caracteristicas}
                        onChange={(e) => setFormData({...formData, caracteristicas: e.target.value})}
                        placeholder="Descreva as características da ferramenta ou deixe em branco"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {activeTab === "materiais" && (
                  <>
                    <div>
                      <Label htmlFor="entrada">Quantidade de Entrada</Label>
                      <Input
                        id="entrada"
                        type="number"
                        value={formData.entrada}
                        onChange={(e) => setFormData({...formData, entrada: e.target.value})}
                        placeholder="Quantidade de entrada"
                      />
                    </div>
                    <div>
                      <Label htmlFor="saida">Quantidade de Saída</Label>
                      <Input
                        id="saida"
                        type="number"
                        value={formData.saida}
                        onChange={(e) => setFormData({...formData, saida: e.target.value})}
                        placeholder="Quantidade de saída"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                      <Input
                        id="quantidade_minima"
                        type="number"
                        value={formData.quantidade_minima}
                        onChange={(e) => setFormData({...formData, quantidade_minima: e.target.value})}
                        placeholder="Quantidade mínima"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unidade">Unidade</Label>
                      <Input
                        id="unidade"
                        value={formData.unidade}
                        onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                        placeholder="Ex: UN, KG, M²"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingItem ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4" />
          <Input
            placeholder={`Buscar ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Materiais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMateriais.map((material) => {
                  const quantidadeDisponivel = material.entrada - material.saida;
                  const isEstoqueBaixo = quantidadeDisponivel <= material.quantidade_minima;
                  
                  return (
                    <Card key={material.id} className={`border-l-4 ${isEstoqueBaixo ? 'border-l-red-500' : 'border-l-green-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{material.nome}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={isEstoqueBaixo ? "destructive" : "default"}>
                                Disponível: {quantidadeDisponivel}
                              </Badge>
                              <Badge variant="outline">
                                Mínimo: {material.quantidade_minima}
                              </Badge>
                              {material.unidade && (
                                <Badge variant="secondary">{material.unidade}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(material)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredMateriais.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum material encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ferramentas">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Ferramentas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFerramentas.map((ferramenta) => {
                  const isEstoqueBaixo = ferramenta.quantidade <= 2;
                  
                  return (
                    <Card key={ferramenta.id} className={`border-l-4 ${isEstoqueBaixo ? 'border-l-red-500' : 'border-l-green-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{ferramenta.nome}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{ferramenta.tag}</Badge>
                              <Badge variant={isEstoqueBaixo ? "destructive" : "default"}>
                                Disponível: {ferramenta.quantidade}
                              </Badge>
                              <Badge variant="secondary">{ferramenta.categoria}</Badge>
                            </div>
                            {ferramenta.caracteristicas && (
                              <div className="text-sm text-muted-foreground">
                                {typeof ferramenta.caracteristicas === 'object' && ferramenta.caracteristicas.descricao 
                                  ? ferramenta.caracteristicas.descricao
                                  : typeof ferramenta.caracteristicas === 'string' 
                                    ? ferramenta.caracteristicas
                                    : JSON.stringify(ferramenta.caracteristicas)
                                }
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(ferramenta)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(ferramenta)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredFerramentas.length === 0 && (
                  <div className="text-center py-8">
                    <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma ferramenta encontrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManager;
