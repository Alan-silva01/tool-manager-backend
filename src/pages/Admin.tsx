
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Users, Settings, AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import EstoqueManager from "@/components/admin/EstoqueManager";

// Define interfaces for Admin page
interface AdminMaterial {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  unidade: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
}

interface AdminFerramenta {
  id: string;
  nome: string;
  tag: string;
  categoria: string;
  disponivel: boolean;
  caracteristicas: {
    cor?: string;
    tensao?: string;
    peso?: string;
    marca?: string;
    modelo?: string;
    observacoes?: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'estoque'>('overview');
  const { ferramentas, loading: loadingFerramentas, refetch: refetchFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais, refetch: refetchMateriais } = useMateriais();

  const handleRefresh = () => {
    refetchFerramentas();
    refetchMateriais();
  };

  // Convert ferramentas to AdminFerramenta format
  const adminFerramentas: AdminFerramenta[] = ferramentas.map(ferramenta => ({
    id: ferramenta.id,
    nome: ferramenta.nome,
    tag: ferramenta.tag,
    categoria: ferramenta.categoria,
    disponivel: ferramenta.quantidade > 0,
    caracteristicas: ferramenta.caracteristicas || {}
  }));

  // Convert materiais to AdminMaterial format
  const adminMateriais: AdminMaterial[] = materiais.map(material => ({
    id: material.id,
    nome: material.nome,
    categoria: 'Material', // Default category
    descricao: material.nome, // Use name as description
    unidade: material.unidade,
    quantidade_disponivel: material.entrada - material.saida,
    quantidade_minima: material.quantidade_minima
  }));

  // Calculate statistics
  const totalFerramentas = adminFerramentas.length;
  const ferramentasDisponiveis = adminFerramentas.filter(f => f.disponivel).length;
  const totalMateriais = adminMateriais.length;
  const estoquesBaixos = adminMateriais.filter(m => m.quantidade_disponivel <= m.quantidade_minima);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Package },
    { id: 'estoque', label: 'Gerenciar Estoque', icon: Settings }
  ];

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
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-primary-foreground/80">Gerenciamento do Sistema</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loadingFerramentas || loadingMateriais}
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingFerramentas || loadingMateriais ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b bg-card">
        <div className="container mx-auto">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Ferramentas</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFerramentas}</div>
                  <p className="text-xs text-muted-foreground">
                    {ferramentasDisponiveis} disponíveis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMateriais}</div>
                  <p className="text-xs text-muted-foreground">
                    Itens cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{estoquesBaixos.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Materiais com estoque baixo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Cadastrados no sistema
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Estoque Baixo Details */}
            {estoquesBaixos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Materiais com Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {estoquesBaixos.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{material.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            Disponível: {material.quantidade_disponivel} {material.unidade}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          Mínimo: {material.quantidade_minima}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma atividade recente para mostrar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'estoque' && (
          <EstoqueManager
            materiais={adminMateriais}
            ferramentas={adminFerramentas}
            onRefresh={handleRefresh}
          />
        )}
      </main>
    </div>
  );
};

export default Admin;
