import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  Package, 
  AlertTriangle, 
  FileText, 
  Upload,
  Download,
  Calendar,
  Search,
  Eye,
  LogOut,
  Bell,
  RefreshCw,
  Plus,
  Wrench,
  Box
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { supabase } from "@/integrations/supabase/client";

// Mock data para estoque e PDFs - mantém os dados existentes
const estoqueAlerta = [
  { id: 1, nome: "WD-40", atual: 2, minimo: 3, unidade: "latas", categoria: "Material" },
  { id: 2, nome: "Torquímetro", atual: 1, minimo: 2, unidade: "un", categoria: "Ferramenta" },
  { id: 3, nome: "Escova de aço", atual: 4, minimo: 5, unidade: "un", categoria: "Material" },
  { id: 4, nome: "Óleo de corte", atual: 8, minimo: 10, unidade: "litros", categoria: "Material" },
];

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [funcionariosComFerramentas, setFuncionariosComFerramentas] = useState<any[]>([]);
  const [isNotifying, setIsNotifying] = useState<string | null>(null);
  const [isAddingFerramenta, setIsAddingFerramenta] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [searchEstoque, setSearchEstoque] = useState("");

  // Estados para novos itens
  const [novaFerramenta, setNovaFerramenta] = useState({
    nome: "",
    categoria: "",
    tag: "",
    quantidade: 0,
    caracteristicas: {}
  });

  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    tag: "",
    entrada: 0,
    quantidade_minima: 0,
    unidade: "un"
  });

  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();

  // Função para buscar funcionários com ferramentas
  const fetchFuncionariosComFerramentas = async () => {
    try {
      console.log('Buscando funcionários com ferramentas...');
      
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, nome, matricula, setor, posse_ferramentas, numero_whatsapp')
        .not('posse_ferramentas', 'is', null);

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        console.log('Funcionários encontrados:', data);
        
        const funcionariosFormatados = data
          .filter(func => {
            const posseFerramenta = Array.isArray(func.posse_ferramentas) 
              ? func.posse_ferramentas 
              : [];
            return posseFerramenta.length > 0;
          })
          .map(func => {
            const posseFerramenta = Array.isArray(func.posse_ferramentas) 
              ? func.posse_ferramentas as string[]
              : [];

            const ferramentasDetalhadas = posseFerramenta.map((tag: string) => {
              const ferramenta = ferramentas.find(f => f.tag === tag);
              return {
                tag,
                nome: ferramenta?.nome || 'Ferramenta não encontrada'
              };
            });

            return {
              id: func.id,
              nome: func.nome,
              matricula: func.matricula?.toString() || '',
              setor: func.setor || '',
              numero_whatsapp: func.numero_whatsapp || '',
              ferramentas: ferramentasDetalhadas
            };
          });

        console.log('Funcionários formatados:', funcionariosFormatados);
        setFuncionariosComFerramentas(funcionariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários com ferramentas:', error);
    }
  };

  useEffect(() => {
    if (!loadingFerramentas && ferramentas.length > 0) {
      fetchFuncionariosComFerramentas();
    }
  }, [loadingFerramentas, ferramentas]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFuncionariosComFerramentas();
    setIsRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "As informações foram recarregadas com sucesso",
    });
  };

  const notificarFuncionario = async (funcionario: any, ferramenta: any) => {
    if (!funcionario.numero_whatsapp) {
      toast({
        title: "Erro",
        description: "Funcionário não possui número de WhatsApp cadastrado",
        variant: "destructive",
      });
      return;
    }

    const notificationKey = `${funcionario.id}-${ferramenta.tag}`;
    setIsNotifying(notificationKey);

    try {
      const webhookData = {
        nome: funcionario.nome,
        setor: funcionario.setor,
        matricula: funcionario.matricula,
        nome_ferramenta: ferramenta.nome,
        tag_ferramenta: ferramenta.tag,
        numero_whatsapp: funcionario.numero_whatsapp
      };

      console.log('Enviando notificação:', webhookData);

      const response = await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/notificar-funcionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        toast({
          title: "Notificação enviada",
          description: `Funcionário ${funcionario.nome} foi notificado sobre a devolução da ${ferramenta.nome}`,
        });
      } else {
        throw new Error('Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao notificar funcionário:', error);
      toast({
        title: "Erro ao notificar",
        description: "Não foi possível enviar a notificação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsNotifying(null);
    }
  };

  const handleLogin = () => {
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique usuário e senha",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
    navigate("/");
  };

  // Função para adicionar nova ferramenta
  const handleAddFerramenta = async () => {
    if (!novaFerramenta.nome || !novaFerramenta.categoria || !novaFerramenta.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsAddingFerramenta(true);
    try {
      const { error } = await supabase
        .from('ferramentas')
        .insert([{
          nome: novaFerramenta.nome,
          categoria: novaFerramenta.categoria,
          tag: novaFerramenta.tag,
          quantidade: novaFerramenta.quantidade,
          saiu: 0,
          status: 'disponível',
          caracteristicas: novaFerramenta.caracteristicas
        }]);

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
        title: "Ferramenta adicionada",
        description: `${novaFerramenta.nome} foi adicionada ao estoque`,
      });

      setNovaFerramenta({
        nome: "",
        categoria: "",
        tag: "",
        quantidade: 0,
        caracteristicas: {}
      });

      handleRefresh();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar ferramenta",
        variant: "destructive",
      });
    } finally {
      setIsAddingFerramenta(false);
    }
  };

  // Função para adicionar novo material
  const handleAddMaterial = async () => {
    if (!novoMaterial.nome || !novoMaterial.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsAddingMaterial(true);
    try {
      const { error } = await supabase
        .from('materiais')
        .insert([{
          nome: novoMaterial.nome,
          tag: novoMaterial.tag,
          entrada: novoMaterial.entrada,
          saida: 0,
          quantidade_minima: novoMaterial.quantidade_minima,
          unidade: novoMaterial.unidade,
          data_entrada_estoque: new Date().toISOString().split('T')[0]
        }]);

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
        title: "Material adicionado",
        description: `${novoMaterial.nome} foi adicionado ao estoque`,
      });

      setNovoMaterial({
        nome: "",
        tag: "",
        entrada: 0,
        quantidade_minima: 0,
        unidade: "un"
      });

      handleRefresh();
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar material",
        variant: "destructive",
      });
    } finally {
      setIsAddingMaterial(false);
    }
  };

  // Filtrar funcionários com ferramentas
  const filteredFuncionarios = funcionariosComFerramentas.filter(
    funcionario => 
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.matricula.includes(searchTerm) ||
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.ferramentas.some((f: any) => f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || f.tag.includes(searchTerm))
  );

  // Filtrar materiais para controle de estoque
  const filteredMateriais = materiais.filter(
    material => 
      material.nome.toLowerCase().includes(searchEstoque.toLowerCase()) ||
      String(material.tag).includes(searchEstoque) ||
      material.unidade.toLowerCase().includes(searchEstoque.toLowerCase())
  );

  // Calcular estatísticas
  const totalFerramentasEmprestadas = funcionariosComFerramentas.reduce((total, func) => total + func.ferramentas.length, 0);
  const totalFuncionariosComFerramentas = funcionariosComFerramentas.length;
  const itensEstoqueBaixo = estoqueAlerta.length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/lovable-uploads/3b7074e8-e9f6-44ab-ba68-338592581b56.png" 
                  alt="AVB Logo" 
                  className="w-14 h-14"
                />
              </div>
              <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
              <p className="text-muted-foreground">AVB - Aço Verde Brasil</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Digite seu usuário"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Digite sua senha"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleLogin}
                disabled={!loginData.username || !loginData.password}
              >
                <img 
                  src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
                  alt="AVB Logo" 
                  className="w-4 h-4 mr-2 brightness-0 invert"
                />
                Entrar no Sistema
              </Button>
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Voltar ao Sistema Principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Admin */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/3b7074e8-e9f6-44ab-ba68-338592581b56.png" 
                alt="AVB Logo" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-primary-foreground/80">AVB - Sistema de Controle</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funcionários com Ferramentas</p>
                  <p className="text-2xl font-bold">{totalFuncionariosComFerramentas}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Emprestado</p>
                  <p className="text-2xl font-bold">{totalFerramentasEmprestadas}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-accent">{itensEstoqueBaixo}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Materiais</p>
                  <p className="text-2xl font-bold">{materiais.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="emprestimos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="controle">Controle de Estoque</TabsTrigger>
          </TabsList>

          {/* Aba Empréstimos */}
          <TabsContent value="emprestimos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Controle de Empréstimos ({totalFerramentasEmprestadas} ferramentas)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Buscar por funcionário, ferramenta, tag ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loadingFuncionarios || loadingFerramentas ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Carregando dados...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFuncionarios.map((funcionario) => (
                      <Card key={funcionario.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{funcionario.nome}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">#{funcionario.matricula}</Badge>
                                <span>{funcionario.setor}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Ferramentas em posse:</p>
                            {funcionario.ferramentas.map((ferramenta: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{ferramenta.tag}</Badge>
                                  <span className="text-sm">{ferramenta.nome}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => notificarFuncionario(funcionario, ferramenta)}
                                  disabled={isNotifying === `${funcionario.id}-${ferramenta.tag}`}
                                  className="ml-2"
                                >
                                  <Bell className="w-4 h-4 mr-2" />
                                  {isNotifying === `${funcionario.id}-${ferramenta.tag}` ? 'Notificando...' : 'Solicitar Devolução'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {filteredFuncionarios.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhum funcionário encontrado com ferramentas</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Estoque */}
          <TabsContent value="estoque" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estoque de Materiais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="w-5 h-5" />
                    Estoque de Materiais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Material</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="material-nome">Nome do Material</Label>
                          <Input
                            id="material-nome"
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial({...novoMaterial, nome: e.target.value})}
                            placeholder="Ex: Parafuso M8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="material-tag">Tag</Label>
                          <Input
                            id="material-tag"
                            value={novoMaterial.tag}
                            onChange={(e) => setNovoMaterial({...novoMaterial, tag: e.target.value})}
                            placeholder="Ex: PAR001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="material-entrada">Quantidade Entrada</Label>
                          <Input
                            id="material-entrada"
                            type="number"
                            value={novoMaterial.entrada}
                            onChange={(e) => setNovoMaterial({...novoMaterial, entrada: Number(e.target.value)})}
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="material-minima">Quantidade Mínima</Label>
                          <Input
                            id="material-minima"
                            type="number"
                            value={novoMaterial.quantidade_minima}
                            onChange={(e) => setNovoMaterial({...novoMaterial, quantidade_minima: Number(e.target.value)})}
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="material-unidade">Unidade</Label>
                          <Select value={novoMaterial.unidade} onValueChange={(value) => setNovoMaterial({...novoMaterial, unidade: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="un">Unidade</SelectItem>
                              <SelectItem value="kg">Quilograma</SelectItem>
                              <SelectItem value="g">Grama</SelectItem>
                              <SelectItem value="l">Litro</SelectItem>
                              <SelectItem value="ml">Mililitro</SelectItem>
                              <SelectItem value="m">Metro</SelectItem>
                              <SelectItem value="cm">Centímetro</SelectItem>
                              <SelectItem value="mm">Milímetro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleAddMaterial}
                          disabled={isAddingMaterial}
                        >
                          {isAddingMaterial ? 'Adicionando...' : 'Adicionar Material'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-3">
                    {estoqueAlerta.filter(item => item.categoria === "Material").map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{item.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              Atual: {item.atual} {item.unidade} | Mínimo: {item.minimo} {item.unidade}
                            </p>
                          </div>
                          <Badge variant={item.atual < item.minimo ? "destructive" : "secondary"}>
                            {item.atual < item.minimo ? "Baixo" : "OK"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estoque de Ferramentas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Estoque de Ferramentas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Ferramenta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ferramenta-nome">Nome da Ferramenta</Label>
                          <Input
                            id="ferramenta-nome"
                            value={novaFerramenta.nome}
                            onChange={(e) => setNovaFerramenta({...novaFerramenta, nome: e.target.value})}
                            placeholder="Ex: Chave de Fenda"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ferramenta-categoria">Categoria</Label>
                          <Input
                            id="ferramenta-categoria"
                            value={novaFerramenta.categoria}
                            onChange={(e) => setNovaFerramenta({...novaFerramenta, categoria: e.target.value})}
                            placeholder="Ex: Chaves"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ferramenta-tag">Tag</Label>
                          <Input
                            id="ferramenta-tag"
                            value={novaFerramenta.tag}
                            onChange={(e) => setNovaFerramenta({...novaFerramenta, tag: e.target.value})}
                            placeholder="Ex: CHV001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ferramenta-quantidade">Quantidade</Label>
                          <Input
                            id="ferramenta-quantidade"
                            type="number"
                            value={novaFerramenta.quantidade}
                            onChange={(e) => setNovaFerramenta({...novaFerramenta, quantidade: Number(e.target.value)})}
                            placeholder="5"
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleAddFerramenta}
                          disabled={isAddingFerramenta}
                        >
                          {isAddingFerramenta ? 'Adicionando...' : 'Adicionar Ferramenta'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-3">
                    {estoqueAlerta.filter(item => item.categoria === "Ferramenta").map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{item.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              Atual: {item.atual} {item.unidade} | Mínimo: {item.minimo} {item.unidade}
                            </p>
                          </div>
                          <Badge variant={item.atual < item.minimo ? "destructive" : "secondary"}>
                            {item.atual < item.minimo ? "Baixo" : "OK"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Controle de Estoque */}
          <TabsContent value="controle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Controle Geral de Estoque
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, tag ou unidade..."
                    value={searchEstoque}
                    onChange={(e) => setSearchEstoque(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loadingMateriais ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Carregando materiais...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tag</TableHead>
                          <TableHead>Quantidade Disponível</TableHead>
                          <TableHead>Quantidade Mínima</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMateriais.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.nome}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{material.tag}</Badge>
                            </TableCell>
                            <TableCell>{material.quantidade}</TableCell>
                            <TableCell>{material.quantidade_minima}</TableCell>
                            <TableCell>{material.unidade}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={material.quantidade <= material.quantidade_minima ? "destructive" : "secondary"}
                              >
                                {material.quantidade <= material.quantidade_minima ? "Estoque Baixo" : "OK"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredMateriais.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhum material encontrado</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
