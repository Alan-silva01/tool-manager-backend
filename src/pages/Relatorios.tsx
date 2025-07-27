import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Package, 
  Users, 
  TrendingUp, 
  Search, 
  Filter,
  FileText,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { useFuncionarios } from "@/hooks/useFuncionarios";

const Relatorios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();

  // Estatísticas gerais
  const totalFerramentas = ferramentas.length;
  const totalMateriais = materiais.length;
  const totalFuncionarios = Object.keys(funcionarios).length;

  // Ferramentas com estoque baixo (menos de 5 unidades)
  const ferramentasEstoqueBaixo = ferramentas.filter(f => f.quantidade < 5);

  // Materiais com estoque baixo
  const materiaisEstoqueBaixo = materiais.filter(m => {
    const quantidadeDisponivel = m.entrada - m.saida;
    return quantidadeDisponivel <= m.quantidade_minima;
  });

  // Funcionários com ferramentas
  const funcionariosComFerramentas = Object.values(funcionarios).filter(f => 
    f.posse_ferramentas && f.posse_ferramentas.length > 0
  );

  // Filtrar materiais
  const filteredMateriais = materiais.filter(material => {
    const matchesSearch = material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tag.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "low_stock") {
      const quantidadeDisponivel = material.entrada - material.saida;
      return matchesSearch && quantidadeDisponivel <= material.quantidade_minima;
    }
    return matchesSearch;
  });

  // Filtrar ferramentas
  const filteredFerramentas = ferramentas.filter(ferramenta => {
    const matchesSearch = ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "low_stock") return matchesSearch && ferramenta.quantidade < 5;
    if (filterType === "available") return matchesSearch && ferramenta.quantidade > 0;
    if (filterType === "unavailable") return matchesSearch && ferramenta.quantidade === 0;
    return matchesSearch;
  });

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
              <h1 className="text-xl font-bold">Relatórios</h1>
              <p className="text-sm text-primary-foreground/80">Acompanhamento de Estoque e Movimentação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          </TabsList>

          {/* Aba Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Ferramentas</p>
                      <p className="text-2xl font-bold">{totalFerramentas}</p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Materiais</p>
                      <p className="text-2xl font-bold">{totalMateriais}</p>
                    </div>
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Funcionários</p>
                      <p className="text-2xl font-bold">{totalFuncionarios}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alertas</p>
                      <p className="text-2xl font-bold text-accent">
                        {ferramentasEstoqueBaixo.length + materiaisEstoqueBaixo.length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas de Estoque Baixo */}
            {(ferramentasEstoqueBaixo.length > 0 || materiaisEstoqueBaixo.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <AlertTriangle className="w-5 h-5" />
                    Alertas de Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ferramentasEstoqueBaixo.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Ferramentas:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {ferramentasEstoqueBaixo.map((ferramenta) => (
                            <div key={ferramenta.id} className="flex items-center justify-between p-2 bg-accent/10 rounded">
                              <span className="text-sm">{ferramenta.nome}</span>
                              <Badge variant="destructive">{ferramenta.quantidade} restantes</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {materiaisEstoqueBaixo.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Materiais:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {materiaisEstoqueBaixo.map((material) => (
                            <div key={material.id} className="flex items-center justify-between p-2 bg-accent/10 rounded">
                              <span className="text-sm">{material.nome}</span>
                              <Badge variant="destructive">
                                {material.entrada - material.saida} restantes
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Ferramentas */}
          <TabsContent value="ferramentas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Relatório de Ferramentas
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <Input
                      placeholder="Buscar ferramentas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="available">Disponíveis</SelectItem>
                        <SelectItem value="unavailable">Indisponíveis</SelectItem>
                        <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFerramentas.map((ferramenta) => (
                    <div key={ferramenta.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{ferramenta.nome}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">{ferramenta.tag}</Badge>
                          <span>Categoria: {ferramenta.categoria}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Quantidade</p>
                          <p className="font-medium">{ferramenta.quantidade}</p>
                        </div>
                        <Badge 
                          variant={ferramenta.quantidade === 0 ? "destructive" : ferramenta.quantidade < 5 ? "secondary" : "default"}
                        >
                          {ferramenta.quantidade === 0 ? "Indisponível" : ferramenta.quantidade < 5 ? "Estoque Baixo" : "Disponível"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Materiais */}
          <TabsContent value="materiais" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Relatório de Materiais
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <Input
                      placeholder="Buscar materiais..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMateriais.map((material) => {
                    const quantidadeDisponivel = material.entrada - material.saida;
                    return (
                      <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{material.nome}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Badge variant="outline">{material.tag}</Badge>
                            <span>Unidade: {material.unidade}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Disponível</p>
                            <p className="font-medium">{quantidadeDisponivel}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Mínimo</p>
                            <p className="font-medium">{material.quantidade_minima}</p>
                          </div>
                          <Badge 
                            variant={quantidadeDisponivel <= material.quantidade_minima ? "destructive" : "default"}
                          >
                            {quantidadeDisponivel <= material.quantidade_minima ? "Estoque Baixo" : "Normal"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Funcionários */}
          <TabsContent value="funcionarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Funcionários com Ferramentas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funcionariosComFerramentas.map((funcionario) => (
                    <div key={funcionario.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{funcionario.nome}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">#{funcionario.matricula}</Badge>
                          <span>{funcionario.setor}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Ferramentas</p>
                        <p className="font-medium">{funcionario.posse_ferramentas.length}</p>
                      </div>
                    </div>
                  ))}
                  {funcionariosComFerramentas.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum funcionário com ferramentas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Relatorios;
