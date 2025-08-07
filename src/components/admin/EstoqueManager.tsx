import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Package, 
  Wrench, 
  Users,
  Plus,
  Edit,
  Trash2,
  Search
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
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [novoItem, setNovoItem] = useState({
    nome: "",
    quantidade: "",
    categoria: "",
    tag: "",
    caracteristicas: ""
  });
  const [showNovoForm, setShowNovoForm] = useState<string | null>(null);

  const filteredMateriais = materiais.filter(material => 
    material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tag?.toString().includes(searchTerm)
  ).sort((a, b) => a.nome.localeCompare(b.nome));

  const filteredFerramentas = ferramentas.filter(ferramenta => 
    ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.nome.localeCompare(b.nome));

  const formatarCaracteristicas = (texto: string) => {
    console.log('Formatando características:', texto);
    
    if (!texto || !texto.trim()) {
      console.log('Texto vazio, retornando null');
      return null;
    }

    const textoLimpo = texto.trim();
    
    // Tentar parsear como JSON primeiro
    try {
      const parsed = JSON.parse(textoLimpo);
      console.log('JSON válido encontrado:', parsed);
      return parsed;
    } catch {
      console.log('Não é JSON válido, tentando converter texto');
      
      // Tentar converter texto em formato chave: valor
      const linhas = textoLimpo.split('\n').filter(linha => linha.trim());
      
      if (linhas.length === 0) {
        console.log('Nenhuma linha válida encontrada');
        return null;
      }
      
      const caracteristicasObj: any = {};
      
      linhas.forEach(linha => {
        const separadores = [': ', ':', ' - ', ' = '];
        let chave = '';
        let valor = '';
        
        for (const sep of separadores) {
          if (linha.includes(sep)) {
            const partes = linha.split(sep);
            chave = partes[0]?.trim();
            valor = partes.slice(1).join(sep).trim();
            break;
          }
        }
        
        if (chave && valor) {
          caracteristicasObj[chave] = valor;
        }
      });
      
      const resultado = Object.keys(caracteristicasObj).length > 0 ? caracteristicasObj : null;
      console.log('Resultado final da conversão:', resultado);
      return resultado;
    }
  };

  const adicionarFerramenta = async () => {
    console.log('Iniciando adição de ferramenta:', novoItem);
    
    if (!novoItem.nome || !novoItem.quantidade || !novoItem.categoria || !novoItem.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const caracteristicasFormatadas = formatarCaracteristicas(novoItem.caracteristicas);
      console.log('Características formatadas:', caracteristicasFormatadas);
      
      const dadosFerramenta = {
        nome: novoItem.nome,
        quantidade: Number(novoItem.quantidade),
        categoria: novoItem.categoria,
        tag: novoItem.tag,
        saiu: 0,
        caracteristicas: caracteristicasFormatadas
      };
      
      console.log('Dados para inserção:', dadosFerramenta);

      const { error } = await supabase
        .from('ferramentas')
        .insert(dadosFerramenta);

      if (error) {
        console.error('Erro ao adicionar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta adicionada com sucesso",
      });

      setNovoItem({ nome: "", quantidade: "", categoria: "", tag: "", caracteristicas: "" });
      setShowNovoForm(null);
      onRefresh();
      
      // Manter na aba de ferramentas
      setActiveTab("ferramentas");
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar ferramenta",
        variant: "destructive",
      });
    }
  };

  const adicionarMaterial = async () => {
    if (!novoItem.nome || !novoItem.quantidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('materiais')
        .insert({
          nome: novoItem.nome,
          entrada: Number(novoItem.quantidade),
          saida: 0,
          quantidade_minima: 5,
          tag: novoItem.tag ? Number(novoItem.tag) : null
        });

      if (error) {
        console.error('Erro ao adicionar material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material adicionado com sucesso",
      });

      setNovoItem({ nome: "", quantidade: "", categoria: "", tag: "", caracteristicas: "" });
      setShowNovoForm(null);
      onRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar material",
        variant: "destructive",
      });
    }
  };

  const editarFerramenta = async () => {
    console.log('Iniciando edição de ferramenta:', editingData);
    
    try {
      let caracteristicasFormatadas = editingData.caracteristicas;
      
      // Se características foi modificada como string, formatar
      if (typeof editingData.caracteristicas === 'string') {
        caracteristicasFormatadas = formatarCaracteristicas(editingData.caracteristicas);
        console.log('Características formatadas na edição:', caracteristicasFormatadas);
      }
      
      const dadosAtualizacao = {
        nome: editingData.nome,
        quantidade: Number(editingData.quantidade),
        categoria: editingData.categoria,
        tag: editingData.tag,
        caracteristicas: caracteristicasFormatadas
      };
      
      console.log('Dados para atualização:', dadosAtualizacao);

      const { error } = await supabase
        .from('ferramentas')
        .update(dadosAtualizacao)
        .eq('id', editingData.id);

      if (error) {
        console.error('Erro ao editar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível editar a ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta editada com sucesso",
      });

      setIsEditing(null);
      setEditingData({});
      onRefresh();
      
      // IMPORTANTE: Manter na aba de ferramentas após edição
      setTimeout(() => {
        setActiveTab("ferramentas");
      }, 100);
      
    } catch (error) {
      console.error('Erro inesperado na edição:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao editar ferramenta",
        variant: "destructive",
      });
    }
  };

  const editarMaterial = async () => {
    try {
      const { error } = await supabase
        .from('materiais')
        .update({
          nome: editingData.nome,
          entrada: Number(editingData.entrada),
          quantidade_minima: Number(editingData.quantidade_minima),
          tag: editingData.tag ? Number(editingData.tag) : null
        })
        .eq('id', editingData.id);

      if (error) {
        console.error('Erro ao editar material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível editar o material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material editado com sucesso",
      });

      setIsEditing(null);
      setEditingData({});
      onRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao editar material",
        variant: "destructive",
      });
    }
  };

  const excluirMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materiais')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material excluído com sucesso",
      });

      onRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir material",
        variant: "destructive",
      });
    }
  };

  const excluirFerramenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ferramentas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta excluída com sucesso",
      });

      onRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir ferramenta",
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: any, tipo: string) => {
    setIsEditing(`${tipo}-${item.id}`);
    if (tipo === 'ferramenta') {
      setEditingData({
        ...item,
        caracteristicas: typeof item.caracteristicas === 'object' && item.caracteristicas !== null 
          ? JSON.stringify(item.caracteristicas, null, 2)
          : item.caracteristicas || ""
      });
    } else {
      setEditingData({...item});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4" />
        <Input
          placeholder="Buscar itens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materiais">
            <Package className="w-4 h-4 mr-2" />
            Materiais ({materiais.length})
          </TabsTrigger>
          <TabsTrigger value="ferramentas">
            <Wrench className="w-4 h-4 mr-2" />
            Ferramentas ({ferramentas.length})
          </TabsTrigger>
        </TabsList>

        {/* Aba Materiais */}
        <TabsContent value="materiais" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Controle de Materiais</h3>
            <Button 
              onClick={() => setShowNovoForm("material")}
              disabled={showNovoForm === "material"}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Material
            </Button>
          </div>

          {showNovoForm === "material" && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Adicionar Novo Material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Material</Label>
                    <Input
                      value={novoItem.nome}
                      onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})}
                      placeholder="Nome do material"
                    />
                  </div>
                  <div>
                    <Label>Quantidade Inicial</Label>
                    <Input
                      type="number"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})}
                      placeholder="Quantidade"
                    />
                  </div>
                  <div>
                    <Label>Tag (Opcional)</Label>
                    <Input
                      type="number"
                      value={novoItem.tag}
                      onChange={(e) => setNovoItem({...novoItem, tag: e.target.value})}
                      placeholder="Número da tag"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={adicionarMaterial}>Adicionar Material</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowNovoForm(null);
                      setNovoItem({ nome: "", quantidade: "", categoria: "", tag: "", caracteristicas: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {filteredMateriais.map((material) => (
              <Card key={material.id}>
                <CardContent className="p-4">
                  {isEditing === `material-${material.id}` ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={editingData.nome || ""}
                            onChange={(e) => setEditingData({...editingData, nome: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Quantidade Entrada</Label>
                          <Input
                            type="number"
                            value={editingData.entrada || ""}
                            onChange={(e) => setEditingData({...editingData, entrada: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Quantidade Mínima</Label>
                          <Input
                            type="number"
                            value={editingData.quantidade_minima || ""}
                            onChange={(e) => setEditingData({...editingData, quantidade_minima: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Tag</Label>
                          <Input
                            type="number"
                            value={editingData.tag || ""}
                            onChange={(e) => setEditingData({...editingData, tag: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={editarMaterial}>Salvar</Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(null);
                            setEditingData({});
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{material.nome}</h4>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">Entrada: {material.entrada}</Badge>
                          <Badge variant="outline">Saída: {material.saida}</Badge>
                          <Badge variant="outline">Disponível: {material.entrada - material.saida}</Badge>
                          <Badge variant="outline">Mínimo: {material.quantidade_minima}</Badge>
                          {material.tag && <Badge variant="outline">Tag: {material.tag}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(material, 'material')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o material "{material.nome}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => excluirMaterial(material.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Ferramentas */}
        <TabsContent value="ferramentas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Controle de Ferramentas</h3>
            <Button 
              onClick={() => setShowNovoForm("ferramenta")}
              disabled={showNovoForm === "ferramenta"}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Ferramenta
            </Button>
          </div>

          {showNovoForm === "ferramenta" && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Adicionar Nova Ferramenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da Ferramenta</Label>
                    <Input
                      value={novoItem.nome}
                      onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})}
                      placeholder="Nome da ferramenta"
                    />
                  </div>
                  <div>
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({...novoItem, quantidade: e.target.value})}
                      placeholder="Quantidade"
                    />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={novoItem.categoria}
                      onChange={(e) => setNovoItem({...novoItem, categoria: e.target.value})}
                      placeholder="Categoria"
                    />
                  </div>
                  <div>
                    <Label>Tag</Label>
                    <Input
                      value={novoItem.tag}
                      onChange={(e) => setNovoItem({...novoItem, tag: e.target.value})}
                      placeholder="Tag da ferramenta"
                    />
                  </div>
                </div>
                <div>
                  <Label>Características (Opcional)</Label>
                  <Textarea
                    value={novoItem.caracteristicas}
                    onChange={(e) => setNovoItem({...novoItem, caracteristicas: e.target.value})}
                    placeholder='Pode ser JSON ou texto simples. Ex: {"cor": "Preta", "potência": "500W"} ou simplesmente cor: Preta'
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Você pode usar formato JSON ou texto simples (uma característica por linha)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={adicionarFerramenta}>Adicionar Ferramenta</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowNovoForm(null);
                      setNovoItem({ nome: "", quantidade: "", categoria: "", tag: "", caracteristicas: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {filteredFerramentas.map((ferramenta) => (
              <Card key={ferramenta.id}>
                <CardContent className="p-4">
                  {isEditing === `ferramenta-${ferramenta.id}` ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={editingData.nome || ""}
                            onChange={(e) => setEditingData({...editingData, nome: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            value={editingData.quantidade || ""}
                            onChange={(e) => setEditingData({...editingData, quantidade: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Categoria</Label>
                          <Input
                            value={editingData.categoria || ""}
                            onChange={(e) => setEditingData({...editingData, categoria: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Tag</Label>
                          <Input
                            value={editingData.tag || ""}
                            onChange={(e) => setEditingData({...editingData, tag: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Características</Label>
                        <Textarea
                          value={editingData.caracteristicas || ""}
                          onChange={(e) => setEditingData({...editingData, caracteristicas: e.target.value})}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={editarFerramenta}>Salvar</Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(null);
                            setEditingData({});
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{ferramenta.nome}</h4>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">Tag: {ferramenta.tag}</Badge>
                          <Badge variant="outline">Categoria: {ferramenta.categoria}</Badge>
                          <Badge variant="outline">Disponível: {ferramenta.quantidade}</Badge>
                        </div>
                        {ferramenta.caracteristicas && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Características:</strong>
                            <pre className="mt-1 text-xs bg-muted p-2 rounded max-w-md overflow-auto">
                              {typeof ferramenta.caracteristicas === 'object' 
                                ? JSON.stringify(ferramenta.caracteristicas, null, 2)
                                : ferramenta.caracteristicas}
                            </pre>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(ferramenta, 'ferramenta')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a ferramenta "{ferramenta.nome}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => excluirFerramenta(ferramenta.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManager;
