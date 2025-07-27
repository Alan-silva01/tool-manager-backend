
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Search, User, RefreshCw, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useNFC } from "@/hooks/useNFC";

type Ferramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
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

const PegarItem = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [funcionarioMatricula, setFuncionarioMatricula] = useState("");
  const [funcionarioInfo, setFuncionarioInfo] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<(Ferramenta | Material)[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingFuncionario, setIsLoadingFuncionario] = useState(false);

  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { buscarFuncionario, adicionarFerramentaAoFuncionario } = useFuncionarios();
  const { readNFC, isReading, isSupported } = useNFC();

  // Função para verificar se é ferramenta
  const isFerramenta = (item: Ferramenta | Material): item is Ferramenta => {
    return 'quantidade' in item && 'categoria' in item;
  };

  // Função para verificar se é material
  const isMaterial = (item: Ferramenta | Material): item is Material => {
    return 'entrada' in item && 'unidade' in item;
  };

  // Combinar e filtrar itens disponíveis
  const availableItems = [
    ...ferramentas.filter(f => isFerramenta(f) && f.quantidade > 0),
    ...materiais.filter(m => isMaterial(m) && (m.entrada - m.saida) > 0)
  ].filter(item => {
    const nome = item.nome.toLowerCase();
    const tag = item.tag.toLowerCase();
    const search = searchTerm.toLowerCase();
    return nome.includes(search) || tag.includes(search);
  });

  const handleNFCRead = async () => {
    try {
      const nfcData = await readNFC();
      if (nfcData) {
        console.log('Dados NFC lidos:', nfcData);
        setFuncionarioMatricula(nfcData.matricula);
        await buscarFuncionarioInfo(nfcData.matricula);
      }
    } catch (error) {
      console.error('Erro ao ler NFC:', error);
      toast({
        title: "Erro ao ler NFC",
        description: "Não foi possível ler o cartão NFC. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const buscarFuncionarioInfo = async (matricula: string) => {
    if (!matricula) return;

    setIsLoadingFuncionario(true);
    try {
      const funcionario = buscarFuncionario(matricula);
      if (funcionario) {
        setFuncionarioInfo(funcionario);
        toast({
          title: "Funcionário encontrado!",
          description: `${funcionario.nome} - ${funcionario.setor}`,
        });
      } else {
        setFuncionarioInfo(null);
        toast({
          title: "Funcionário não encontrado",
          description: "Verifique a matrícula informada",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      setFuncionarioInfo(null);
      toast({
        title: "Erro ao buscar funcionário",
        description: "Ocorreu um erro ao buscar o funcionário",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFuncionario(false);
    }
  };

  const handleAddItem = (item: Ferramenta | Material) => {
    const isAlreadySelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
    
    if (isAlreadySelected) {
      toast({
        title: "Item já selecionado",
        description: "Este item já está na lista de retirada",
        variant: "destructive",
      });
      return;
    }

    setSelectedItems([...selectedItems, item]);
    toast({
      title: "Item adicionado",
      description: `${item.nome} foi adicionado à lista de retirada`,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleConfirmRetirada = async () => {
    if (!funcionarioInfo) {
      toast({
        title: "Funcionário não identificado",
        description: "Identifique o funcionário antes de confirmar a retirada",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um item para retirar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Processar apenas ferramentas (materiais não são rastreados por funcionário)
      const ferramentasParaRetirar = selectedItems.filter(isFerramenta);
      
      for (const ferramenta of ferramentasParaRetirar) {
        const sucesso = await adicionarFerramentaAoFuncionario(funcionarioMatricula, ferramenta.tag);
        if (!sucesso) {
          throw new Error(`Erro ao registrar ferramenta ${ferramenta.nome}`);
        }
      }

      toast({
        title: "Retirada confirmada!",
        description: `${selectedItems.length} item(s) retirado(s) por ${funcionarioInfo.nome}`,
      });

      // Limpar seleções
      setSelectedItems([]);
      setFuncionarioInfo(null);
      setFuncionarioMatricula("");

    } catch (error) {
      console.error('Erro ao confirmar retirada:', error);
      toast({
        title: "Erro ao confirmar retirada",
        description: "Ocorreu um erro ao registrar a retirada",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getQuantidadeDisponivel = (item: Ferramenta | Material) => {
    if (isFerramenta(item)) {
      return item.quantidade;
    } else if (isMaterial(item)) {
      return item.entrada - item.saida;
    }
    return 0;
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
              <p className="text-sm text-primary-foreground/80">Retirada de Ferramentas e Materiais</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Identificação do Funcionário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Identificação do Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula do Funcionário</Label>
                <div className="flex gap-2">
                  <Input
                    id="matricula"
                    placeholder="Digite a matrícula..."
                    value={funcionarioMatricula}
                    onChange={(e) => setFuncionarioMatricula(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        buscarFuncionarioInfo(funcionarioMatricula);
                      }
                    }}
                  />
                  <Button
                    onClick={() => buscarFuncionarioInfo(funcionarioMatricula)}
                    disabled={isLoadingFuncionario}
                  >
                    {isLoadingFuncionario ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Buscar"}
                  </Button>
                </div>
              </div>

              {/* Botão NFC */}
              <div className="space-y-2">
                <Label>Ou usar NFC</Label>
                <Button
                  onClick={handleNFCRead}
                  disabled={isReading || !isSupported}
                  className="w-full"
                  variant="outline"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  {isReading ? "Lendo NFC..." : "Ler Cartão NFC"}
                </Button>
                {!isSupported && (
                  <p className="text-sm text-muted-foreground">
                    NFC não disponível neste dispositivo
                  </p>
                )}
              </div>

              {/* Informações do Funcionário */}
              {funcionarioInfo && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold">{funcionarioInfo.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    Matrícula: {funcionarioInfo.matricula}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Setor: {funcionarioInfo.setor}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    Funcionário Identificado
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coluna 2: Lista de Itens Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens Disponíveis
              </CardTitle>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loadingFerramentas || loadingMateriais ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Carregando itens...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.nome}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{item.tag}</Badge>
                          <span>Disponível: {getQuantidadeDisponivel(item)}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddItem(item)}
                        disabled={!funcionarioInfo}
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))}
                  {availableItems.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? "Nenhum item encontrado" : "Carregando itens..."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coluna 3: Itens Selecionados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens Selecionados ({selectedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.nome}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{item.tag}</Badge>
                        {isFerramenta(item) && (
                          <span>Ferramenta</span>
                        )}
                        {isMaterial(item) && (
                          <span>Material</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                {selectedItems.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum item selecionado
                    </p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <Button
                onClick={handleConfirmRetirada}
                disabled={!funcionarioInfo || selectedItems.length === 0 || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  `Confirmar Retirada (${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''})`
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
