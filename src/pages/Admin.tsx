import { useState } from "react";
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
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock data for admin
const ferramentasEmprestadas = [
  {
    id: 1,
    ferramenta: "Furadeira",
    tag: "001",
    funcionario: "ANDRE FELIPE COSTA DA SILVA",
    matricula: "13812",
    setor: "Usinagem industrial",
    dataRetirada: "2024-01-15",
    diasVencido: 8,
    status: "vencido"
  },
  {
    id: 2,
    ferramenta: "Torquímetro",
    tag: "006",
    funcionario: "ANDRE FELIPE COSTA DA SILVA",
    matricula: "13812",
    setor: "Usinagem industrial",
    dataRetirada: "2024-01-14",
    diasVencido: 9,
    status: "vencido"
  },
  {
    id: 3,
    ferramenta: "Parafusadeira",
    tag: "002",
    funcionario: "ANGELO VALADARES DE CASTRO",
    matricula: "7203",
    setor: "Usinagem industrial",
    dataRetirada: "2024-01-20",
    diasVencido: 0,
    status: "normal"
  }
];

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

  const handleLogin = () => {
    // Simulação de login - em produção seria validação real
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

    // Simulação de processamento do PDF
    toast({
      title: "PDF processado com sucesso",
      description: `${selectedFile.name} foi processado e o estoque atualizado`,
    });
    setSelectedFile(null);
  };

  const filteredFerramentas = ferramentasEmprestadas.filter(
    item => 
      item.funcionario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ferramenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matricula.includes(searchTerm)
  );

  const ferramentasVencidas = ferramentasEmprestadas.filter(item => item.status === "vencido");
  const totalFerramentasEmprestadas = ferramentasEmprestadas.length;
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
      </header>

      <main className="container mx-auto p-6">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Emprestado</p>
                  <p className="text-2xl font-bold">{totalFerramentasEmprestadas}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ferramentas Vencidas</p>
                  <p className="text-2xl font-bold text-destructive">{ferramentasVencidas.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-destructive" />
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
            <TabsTrigger value="vencidos">Vencidos</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="upload">Upload PDF</TabsTrigger>
          </TabsList>

          {/* Aba Empréstimos */}
          <TabsContent value="emprestimos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Controle de Empréstimos
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Buscar por funcionário, ferramenta ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ferramenta</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead>Data Retirada</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFerramentas.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.ferramenta}</p>
                            <Badge variant="outline">{item.tag}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.funcionario}</p>
                            <p className="text-sm text-muted-foreground">#{item.matricula}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.setor}</TableCell>
                        <TableCell>{new Date(item.dataRetirada).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          {item.status === "vencido" ? (
                            <Badge variant="destructive">
                              Vencido há {item.diasVencido} dias
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Em dia</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Vencidos */}
          <TabsContent value="vencidos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Ferramentas Vencidas ({ferramentasVencidas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ferramentasVencidas.map((item) => (
                    <Card key={item.id} className="border-destructive/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold">{item.ferramenta}</h3>
                              <Badge variant="outline">{item.tag}</Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.funcionario}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.setor} - #{item.matricula}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Retirado em: {new Date(item.dataRetirada).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-2">
                              {item.diasVencido} dias em atraso
                            </Badge>
                            <div className="space-x-2">
                              <Button size="sm" variant="outline">
                                Notificar
                              </Button>
                              <Button size="sm">
                                Devolver
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