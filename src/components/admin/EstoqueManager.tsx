import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Package, Wrench } from "lucide-react";
import type { Material, Ferramenta } from "@/types";

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => void;
}

export const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const { toast } = useToast();
  
  // Estados para materiais
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    nome: "",
    tag: "",
    quantidade: "",
    quantidade_minima: "",
    unidade: ""
  });

  // Estados para ferramentas
  const [isAddingFerramenta, setIsAddingFerramenta] = useState(false);
  const [ferramentaForm, setFerramentaForm] = useState({
    nome: "",
    categoria: "",
    tag: "",
    quantidade: "",
    caracteristicas: ""
  });

  const handleAddMaterial = async () => {
    if (!materialForm.nome || !materialForm.quantidade || !materialForm.quantidade_minima) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('materiais')
        .insert({
          nome: materialForm.nome,
          tag: materialForm.tag ? parseInt(materialForm.tag) : null,
          quantidade: parseInt(materialForm.quantidade),
          quantidade_minima: parseInt(materialForm.quantidade_minima),
          entrada: parseInt(materialForm.quantidade),
          saida: 0,
          data_entrada_estoque: new Date().toISOString(),
          unidade: materialForm.unidade || null
        });

      if (error) {
        console.error('Erro ao adicionar material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o material",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material adicionado com sucesso"
      });

      setMaterialForm({
        nome: "",
        tag: "",
        quantidade: "",
        quantidade_minima: "",
        unidade: ""
      });
      setIsAddingMaterial(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o material",
        variant: "destructive"
      });
    }
  };

  const handleAddFerramenta = async () => {
    if (!ferramentaForm.nome || !ferramentaForm.categoria || !ferramentaForm.tag || !ferramentaForm.quantidade) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse das características
      let caracteristicasObj = {};
      if (ferramentaForm.caracteristicas.trim()) {
        const caracteristicasArray = ferramentaForm.caracteristicas.split(',');
        caracteristicasArray.forEach(item => {
          const [key, value] = item.split(':').map(s => s.trim());
          if (key && value) {
            caracteristicasObj[key] = value;
          }
        });
      }

      const { error } = await supabase
        .from('ferramentas')
        .insert({
          nome: ferramentaForm.nome,
          categoria: ferramentaForm.categoria,
          tag: ferramentaForm.tag,
          quantidade: parseInt(ferramentaForm.quantidade),
          caracteristicas: caracteristicasObj,
          saiu: 0,
          status: 'Disponível'
        });

      if (error) {
        console.error('Erro ao adicionar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a ferramenta",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta adicionada com sucesso"
      });

      setFerramentaForm({
        nome: "",
        categoria: "",
        tag: "",
        quantidade: "",
        caracteristicas: ""
      });
      setIsAddingFerramenta(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a ferramenta",
        variant: "destructive"
      });
    }
  };

  const materiaisEstoqueBaixo = materiais.filter(m => m.quantidade <= m.quantidade_minima);

  const totalMateriais = materiais.length;
  const totalMateriaisEstoqueBaixo = materiaisEstoqueBaixo.length;

  const ferramentasEstoqueBaixo = ferramentas.filter(f => f.quantidade <= 2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Materiais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Materiais
            </CardTitle>
            <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome-material">Nome *</Label>
                    <Input
                      id="nome-material"
                      value={materialForm.nome}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Nome do material"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-material">TAG</Label>
                    <Input
                      id="tag-material"
                      type="number"
                      value={materialForm.tag}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="Ex: 12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade-material">Quantidade *</Label>
                    <Input
                      id="quantidade-material"
                      type="number"
                      value={materialForm.quantidade}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, quantidade: e.target.value }))}
                      placeholder="Quantidade inicial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade-minima">Quantidade Mínima *</Label>
                    <Input
                      id="quantidade-minima"
                      type="number"
                      value={materialForm.quantidade_minima}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, quantidade_minima: e.target.value }))}
                      placeholder="Estoque mínimo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input
                      id="unidade"
                      value={materialForm.unidade}
                      onChange={(e) => setMaterialForm(prev => ({ ...prev, unidade: e.target.value }))}
                      placeholder="Ex: kg, un, m, l"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddMaterial} className="flex-1">
                      Adicionar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingMaterial(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {materiais.length} materiais
              </p>
              <p className="text-sm text-muted-foreground">
                Estoque baixo: {materiaisEstoqueBaixo.length} materiais
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Ferramentas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Ferramentas
            </CardTitle>
            <Dialog open={isAddingFerramenta} onOpenChange={setIsAddingFerramenta}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome-ferramenta">Nome *</Label>
                    <Input
                      id="nome-ferramenta"
                      value={ferramentaForm.nome}
                      onChange={(e) => setFerramentaForm(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Furadeira"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria-ferramenta">Categoria *</Label>
                    <Input
                      id="categoria-ferramenta"
                      value={ferramentaForm.categoria}
                      onChange={(e) => setFerramentaForm(prev => ({ ...prev, categoria: e.target.value }))}
                      placeholder="Ex: Elétrica"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-ferramenta">TAG *</Label>
                    <Input
                      id="tag-ferramenta"
                      value={ferramentaForm.tag}
                      onChange={(e) => setFerramentaForm(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="Ex: 0000847393"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade-ferramenta">Quantidade *</Label>
                    <Input
                      id="quantidade-ferramenta"
                      type="number"
                      value={ferramentaForm.quantidade}
                      onChange={(e) => setFerramentaForm(prev => ({ ...prev, quantidade: e.target.value }))}
                      placeholder="Quantidade inicial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caracteristicas-ferramenta">Características</Label>
                    <Textarea
                      id="caracteristicas-ferramenta"
                      value={ferramentaForm.caracteristicas}
                      onChange={(e) => setFerramentaForm(prev => ({ ...prev, caracteristicas: e.target.value }))}
                      placeholder="Ex: Cor: Preta, Tensão: 220v"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separe as características por vírgula no formato "Chave: Valor"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddFerramenta} className="flex-1">
                      Adicionar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingFerramenta(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total: {ferramentas.length} ferramentas
              </p>
              <p className="text-sm text-muted-foreground">
                Estoque baixo: {ferramentasEstoqueBaixo.length} ferramentas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
