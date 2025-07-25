import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { supabase } from "@/integrations/supabase/client";

// Mock data para estoque e PDFs - mantém os dados existentes
const estoqueAlerta = [
  { id: 1, nome: "WD-40", atual: 2, minimo: 3, unidade: "latas", categoria: "Material" },
  { id: 2, nome: "Torquímetro", atual: 1, minimo: 2, unidade: "un", categoria: "Ferramenta" },
  { id: 3, nome: "Escova de aço", atual: 4, minimo: 5, unidade: "un", categoria: "Material" },
  { id: 4, nome: "Óleo de corte", atual: 8, minimo: 10, unidade: "litros", categoria: "Material" },
];

const historicoPDFs = [
  {
    id: 1,
    nomeArquivo: "compra_materiais_2024_01.pdf",
    dataUpload: "2024-01-22",
    usuario: "Admin",
    itensProcessados: 15,
    status: "processado"
  },
  {
    id: 2,
    nomeArquivo: "compra_ferramentas_2024_01.pdf",
    dataUpload: "2024-01-20",
    usuario: "Admin",
    itensProcessados: 8,
    status: "processado"
  }
];

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [funcionariosComFerramentas, setFuncionariosComFerramentas] = useState<any[]>([]);
  const [isNotifying, setIsNotifying] = useState<string | null>(null);

  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();

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
            // Verifica se posse_ferramentas é um array válido
            const posseFerramenta = Array.isArray(func.posse_ferramentas) 
              ? func.posse_ferramentas 
              : [];
            return posseFerramenta.length > 0;
          })
          .map(func => {
            // Converte posse_ferramentas para array se necessário
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

  // Carregar dados quando componente montar e quando ferramentas carregarem
  useEffect(() => {
    if (!loadingFerramentas && ferramentas.length > 0) {
      fetchFuncionariosComFerramentas();
    }
  }, [loadingFerramentas, ferramentas]);

  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFuncionariosComFerramentas();
    setIsRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "As informações foram recarregadas com sucesso",
    });
  };

  // Função para notificar funcionário
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

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um PDF para fazer upload",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "PDF processado com sucesso",
      description: `${selectedFile.name} foi processado e o estoque atualizado`,
    });
    setSelectedFile(null);
  };

  // Filtrar funcionários com ferramentas
  const filteredFuncionarios = funcionariosComFerramentas.filter(
    funcionario => 
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.matricula.includes(searchTerm) ||
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.ferramentas.some((f: any) => f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || f.tag.includes(searchTerm))
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
                  <p className="text-sm font-medium text-muted-foreground">PDFs Processados</p>
                  <p className="text-2xl font-bold">{historicoPDFs.length}</p>
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
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Alertas de Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estoqueAlerta.map((item) => (
                    <Card key={item.id} className="border-accent/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{item.nome}</h3>
                            <Badge variant="outline">{item.categoria}</Badge>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Estoque atual: <span className="font-medium">{item.atual} {item.unidade}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Mínimo: <span className="font-medium">{item.minimo} {item.unidade}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-2">
                              Crítico
                            </Badge>
                            <div>
                              <Button size="sm">
                                Solicitar Compra
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Upload PDF */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload de PDF de Compras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pdf-upload">Selecionar arquivo PDF</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                  </div>
                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Arquivo selecionado:</p>
                      <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                    </div>
                  )}
                  <Button 
                    className="w-full" 
                    onClick={handleFileUpload}
                    disabled={!selectedFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Processar PDF
                  </Button>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• O PDF será analisado automaticamente</p>
                    <p>• Itens identificados serão adicionados ao estoque</p>
                    <p>• Um relatório será gerado após o processamento</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Histórico de Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {historicoPDFs.map((pdf) => (
                      <div key={pdf.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{pdf.nomeArquivo}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(pdf.dataUpload).toLocaleDateString('pt-BR')} por {pdf.usuario}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {pdf.itensProcessados} itens processados
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="secondary">{pdf.status}</Badge>
                            <Button size="sm" variant="ghost">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
