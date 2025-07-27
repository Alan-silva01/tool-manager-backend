
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Package, 
  User, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  ArrowLeft,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { useNFC } from "@/hooks/useNFC";
import { supabase } from "@/integrations/supabase/client";

// Type guards to check if an item is a Material or Ferramenta
const isMaterial = (item: any): item is Material => {
  return item && typeof item.entrada === 'number' && typeof item.saida === 'number';
};

const isFerramenta = (item: any): item is Ferramenta => {
  return item && typeof item.quantidade === 'number' && typeof item.saiu === 'number';
};

type Material = {
  id: string;
  nome: string;
  tag: string;
  entrada: number;
  quantidade_minima: number;
  data_entrada_estoque: string;
  saida: number;
  unidade: string;
};

type Ferramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
};

const PegarItem = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { funcionarios, loading: loadingFuncionarios, buscarFuncionario, adicionarFerramentaAoFuncionario } = useFuncionarios();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { readNFC, isReading, isSupported } = useNFC();

  const [matricula, setMatricula] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Combine materials and tools for search
  const allItems = [
    ...materiais.map(m => ({ ...m, type: 'material' as const })),
    ...ferramentas.map(f => ({ ...f, type: 'ferramenta' as const }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tag.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Only show items that are available
    let isAvailable = false;
    if (item.type === 'material') {
      const material = item as Material;
      const quantidadeDisponivel = (material.entrada || 0) - (material.saida || 0);
      isAvailable = quantidadeDisponivel > 0;
    } else {
      const ferramenta = item as Ferramenta;
      const quantidadeDisponivel = (ferramenta.quantidade || 0) - (ferramenta.saiu || 0);
      isAvailable = quantidadeDisponivel > 0;
    }
    
    return matchesSearch && isAvailable;
  });

  const handleNFCRead = async () => {
    try {
      const nfcData = await readNFC();
      if (nfcData) {
        setMatricula(nfcData.matricula);
        handleBuscarFuncionario(nfcData.matricula);
      }
    } catch (error) {
      console.error('Erro ao ler NFC:', error);
    }
  };

  const handleBuscarFuncionario = (matriculaInput: string) => {
    if (!matriculaInput.trim()) {
      toast({
        title: "Matrícula inválida",
        description: "Digite uma matrícula válida",
        variant: "destructive",
      });
      return;
    }

    const funcionario = buscarFuncionario(matriculaInput);
    
    if (funcionario) {
      setFuncionarioSelecionado(funcionario);
      toast({
        title: "Funcionário encontrado",
        description: `${funcionario.nome} - ${funcionario.setor}`,
      });
    } else {
      toast({
        title: "Funcionário não encontrado",
        description: "Verifique a matrícula digitada",
        variant: "destructive",
      });
      setFuncionarioSelecionado(null);
    }
  };

  const toggleItemSelection = (tag: string) => {
    setSelectedItems(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    
    if (!quantities[tag]) {
      setQuantities(prev => ({ ...prev, [tag]: 1 }));
    }
  };

  const updateQuantity = (tag: string, quantity: number) => {
    if (quantity < 1) return;
    
    const item = allItems.find(i => i.tag === tag);
    if (!item) return;
    
    let maxQuantity = 0;
    if (item.type === 'material') {
      const material = item as Material;
      maxQuantity = (material.entrada || 0) - (material.saida || 0);
    } else {
      const ferramenta = item as Ferramenta;
      maxQuantity = (ferramenta.quantidade || 0) - (ferramenta.saiu || 0);
    }
    
    if (quantity > maxQuantity) {
      toast({
        title: "Quantidade inválida",
        description: `Quantidade máxima disponível: ${maxQuantity}`,
        variant: "destructive",
      });
      return;
    }
    
    setQuantities(prev => ({ ...prev, [tag]: quantity }));
  };

  const handleConfirmarRetirada = async () => {
    if (!funcionarioSelecionado || selectedItems.length === 0) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione um funcionário e pelo menos um item",
        variant: "destructive",
      });
      return;
    }

    try {
      // Process each selected item
      for (const tag of selectedItems) {
        const item = allItems.find(i => i.tag === tag);
        if (!item) continue;
        
        const quantity = quantities[tag] || 1;
        
        if (item.type === 'material') {
          // Update material quantity
          const material = item as Material;
          const novaQuantidadeSaida = (material.saida || 0) + quantity;
          
          const { error } = await supabase
            .from('materiais')
            .update({ saida: novaQuantidadeSaida })
            .eq('id', material.id);
            
          if (error) {
            console.error('Erro ao atualizar material:', error);
            throw error;
          }
        } else {
          // Update tool quantity and add to employee
          const ferramenta = item as Ferramenta;
          const novaQuantidadeSaiu = (ferramenta.saiu || 0) + quantity;
          
          const { error } = await supabase
            .from('ferramentas')
            .update({ saiu: novaQuantidadeSaiu })
            .eq('id', ferramenta.id);
            
          if (error) {
            console.error('Erro ao atualizar ferramenta:', error);
            throw error;
          }
          
          // Add tool to employee's possession
          for (let i = 0; i < quantity; i++) {
            await adicionarFerramentaAoFuncionario(funcionarioSelecionado.matricula.toString(), tag);
          }
        }
      }

      toast({
        title: "Retirada confirmada",
        description: `${selectedItems.length} item(s) retirado(s) com sucesso`,
      });

      // Reset form
      setSelectedItems([]);
      setQuantities({});
      setFuncionarioSelecionado(null);
      setMatricula("");

    } catch (error) {
      console.error('Erro ao confirmar retirada:', error);
      toast({
        title: "Erro na retirada",
        description: "Não foi possível confirmar a retirada",
        variant: "destructive",
      });
    }
  };

  const getAvailableQuantity = (item: Material | Ferramenta) => {
    if (isMaterial(item)) {
      return (item.entrada || 0) - (item.saida || 0);
    } else {
      return (item.quantidade || 0) - (item.saiu || 0);
    }
  };

  const renderItemCard = (item: Material | Ferramenta) => {
    const availableQuantity = getAvailableQuantity(item);
    const isSelected = selectedItems.includes(item.tag);
    const selectedQuantity = quantities[item.tag] || 1;

    return (
      <Card 
        key={item.id} 
        className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={() => toggleItemSelection(item.tag)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {item.type === 'material' ? (
                <Package className="w-4 h-4 text-blue-500" />
              ) : (
                <Wrench className="w-4 h-4 text-green-500" />
              )}
              <span className="font-medium">{item.nome}</span>
            </div>
            <Badge variant="secondary">{item.tag}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Disponível: {availableQuantity}</span>
            <span className="capitalize">{item.type}</span>
          </div>
          
          {isSelected && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <Label className="text-xs">Quantidade:</Label>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.tag, selectedQuantity - 1);
                  }}
                  disabled={selectedQuantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">{selectedQuantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.tag, selectedQuantity + 1);
                  }}
                  disabled={selectedQuantity >= availableQuantity}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/3b7074e8-e9f6-44ab-ba68-338592581b56.png" 
                alt="AVB Logo" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Pegar Item</h1>
              <p className="text-sm text-primary-foreground/80">Sistema de Controle de Estoque</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Employee Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Identificação do Funcionário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="Digite a matrícula do funcionário"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBuscarFuncionario(matricula);
                    }
                  }}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button 
                  onClick={() => handleBuscarFuncionario(matricula)}
                  disabled={loadingFuncionarios}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {isSupported && (
                  <Button 
                    onClick={handleNFCRead}
                    disabled={isReading}
                    variant="outline"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    {isReading ? 'Lendo...' : 'Ler NFC'}
                  </Button>
                )}
              </div>
            </div>
            
            {funcionarioSelecionado && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Funcionário Selecionado</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nome:</span> {funcionarioSelecionado.nome}
                  </div>
                  <div>
                    <span className="font-medium">Matrícula:</span> {funcionarioSelecionado.matricula}
                  </div>
                  <div>
                    <span className="font-medium">Setor:</span> {funcionarioSelecionado.setor}
                  </div>
                  <div>
                    <span className="font-medium">Ferramentas em posse:</span> {funcionarioSelecionado.posse_ferramentas?.length || 0}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Item Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Seleção de Itens ({selectedItems.length} selecionado{selectedItems.length !== 1 ? 's' : ''})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou tag do item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loadingMateriais || loadingFerramentas ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando itens...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(renderItemCard)}
                {filteredItems.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum item disponível encontrado</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirm Button */}
        {selectedItems.length > 0 && funcionarioSelecionado && (
          <div className="fixed bottom-6 right-6">
            <Button 
              onClick={handleConfirmarRetirada}
              size="lg"
              className="shadow-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirmar Retirada ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PegarItem;
