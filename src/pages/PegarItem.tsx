
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Package, 
  User, 
  Search,
  CheckCircle,
  AlertCircle,
  Wrench,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { useNFC } from "@/hooks/useNFC";
import { supabase } from "@/integrations/supabase/client";

// Tipos locais para trabalhar com os dados
type LocalMaterial = {
  id: string;
  nome: string;
  tag: number;
  entrada: number;
  saida: number;
  quantidade_minima: number;
  unidade: string;
  type: 'material';
};

type LocalFerramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  saiu?: number;
  type: 'ferramenta';
};

type LocalFuncionario = {
  id: string;
  nome: string;
  matricula: string;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: string[];
};

type ItemWithType = LocalMaterial | LocalFerramenta;

const PegarItem = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { nfcData, isNFCSupported, startNFCReading, stopNFCReading } = useNFC();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"todos" | "material" | "ferramenta">("todos");
  const [selectedItem, setSelectedItem] = useState<ItemWithType | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>("");
  const [quantidade, setQuantidade] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Converter dados para tipos locais
  const localMateriais: LocalMaterial[] = materiais.map(m => ({
    ...m,
    type: 'material' as const
  }));

  const localFerramentas: LocalFerramenta[] = ferramentas.map(f => ({
    ...f,
    type: 'ferramenta' as const
  }));

  const localFuncionarios: LocalFuncionario[] = funcionarios.map(f => ({
    ...f,
    matricula: f.matricula?.toString() || '',
    posse_ferramentas: Array.isArray(f.posse_ferramentas) ? f.posse_ferramentas as string[] : []
  }));

  // Função para calcular quantidade disponível
  const getQuantidadeDisponivel = (item: ItemWithType): number => {
    if (item.type === 'material') {
      return (item.entrada || 0) - (item.saida || 0);
    } else {
      return (item.quantidade || 0) - (item.saiu || 0);
    }
  };

  // Combinar materiais e ferramentas
  const allItems: ItemWithType[] = [...localMateriais, ...localFerramentas];

  // Filtrar itens baseado na busca e tipo
  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tag.toString().includes(searchTerm);
    
    const matchesType = selectedType === "todos" || item.type === selectedType;
    
    const hasQuantity = getQuantidadeDisponivel(item) > 0;
    
    return matchesSearch && matchesType && hasQuantity;
  });

  // Processar dados do NFC
  useEffect(() => {
    if (nfcData) {
      console.log('Dados NFC recebidos:', nfcData);
      
      const item = allItems.find(i => 
        i.tag.toString() === nfcData ||
        i.nome.toLowerCase().includes(nfcData.toLowerCase())
      );
      
      if (item) {
        setSelectedItem(item);
        toast({
          title: "Item encontrado via NFC",
          description: `${item.nome} foi selecionado automaticamente`,
        });
      } else {
        toast({
          title: "Item não encontrado",
          description: "Nenhum item foi encontrado com os dados do NFC",
          variant: "destructive",
        });
      }
    }
  }, [nfcData, allItems]);

  const handleEmprestimo = async () => {
    if (!selectedItem || !selectedFuncionario) {
      toast({
        title: "Erro",
        description: "Selecione um item e um funcionário",
        variant: "destructive",
      });
      return;
    }

    if (quantidade <= 0 || quantidade > getQuantidadeDisponivel(selectedItem)) {
      toast({
        title: "Erro",
        description: "Quantidade inválida",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const funcionario = localFuncionarios.find(f => f.id === selectedFuncionario);
      if (!funcionario) {
        throw new Error("Funcionário não encontrado");
      }

      if (selectedItem.type === 'material') {
        // Atualizar saída do material
        const { error } = await supabase
          .from('materiais')
          .update({ 
            saida: (selectedItem.saida || 0) + quantidade 
          })
          .eq('id', selectedItem.id);

        if (error) throw error;
      } else {
        // Para ferramentas, atualizar posse do funcionário
        const novaPosse = [...funcionario.posse_ferramentas];
        
        // Adicionar a tag da ferramenta múltiplas vezes se quantidade > 1
        for (let i = 0; i < quantidade; i++) {
          novaPosse.push(selectedItem.tag);
        }

        const { error } = await supabase
          .from('funcionarios')
          .update({ 
            posse_ferramentas: novaPosse 
          })
          .eq('id', funcionario.id);

        if (error) throw error;

        // Atualizar saída da ferramenta
        const { error: ferramentaError } = await supabase
          .from('ferramentas')
          .update({ 
            saiu: (selectedItem.saiu || 0) + quantidade 
          })
          .eq('id', selectedItem.id);

        if (ferramentaError) throw ferramentaError;
      }

      toast({
        title: "Empréstimo realizado com sucesso",
        description: `${quantidade}x ${selectedItem.nome} emprestado para ${funcionario.nome}`,
      });

      // Resetar form
      setSelectedItem(null);
      setSelectedFuncionario("");
      setQuantidade(1);
      setSearchTerm("");

    } catch (error) {
      console.error('Erro no empréstimo:', error);
      toast({
        title: "Erro no empréstimo",
        description: "Não foi possível realizar o empréstimo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemIcon = (item: ItemWithType) => {
    return item.type === 'material' ? 
      <Package className="w-5 h-5" /> : 
      <Wrench className="w-5 h-5" />;
  };

  const getItemColor = (item: ItemWithType) => {
    return item.type === 'material' ? 'bg-blue-50' : 'bg-green-50';
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
              <p className="text-sm text-primary-foreground/80">AVB - Aço Verde Brasil</p>
            </div>
          </div>
          {isNFCSupported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startNFCReading}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Ler NFC
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Busca e Seleção de Item */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Selecionar Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nome ou tag do item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="ferramenta">Ferramenta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {loadingMateriais || loadingFerramentas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Carregando itens...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedItem?.id === item.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      } ${getItemColor(item)}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getItemIcon(item)}
                          <div>
                            <p className="font-medium">{item.nome}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{item.tag}</Badge>
                              <Badge variant="secondary">
                                {item.type === 'material' ? 'Material' : 'Ferramenta'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Disponível: {getQuantidadeDisponivel(item)}
                          </p>
                          {item.type === 'material' && (
                            <p className="text-xs text-muted-foreground">
                              {item.unidade}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum item encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Empréstimo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Empréstimo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItem && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Item Selecionado</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {getItemIcon(selectedItem)}
                    <span className="font-medium">{selectedItem.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{selectedItem.tag}</Badge>
                    <Badge variant="secondary">
                      {selectedItem.type === 'material' ? 'Material' : 'Ferramenta'}
                    </Badge>
                    <span>Disponível: {getQuantidadeDisponivel(selectedItem)}</span>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="funcionario">Funcionário</Label>
                <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {localFuncionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome} - {funcionario.matricula} ({funcionario.setor})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max={selectedItem ? getQuantidadeDisponivel(selectedItem) : 1}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  placeholder="Quantidade"
                />
              </div>

              <Separator />

              <Button
                onClick={handleEmprestimo}
                disabled={!selectedItem || !selectedFuncionario || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Empréstimo
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PegarItem;
