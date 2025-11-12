
import React, { useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import { useFuncionariosComFerramentas } from "@/hooks/useFuncionariosComFerramentas";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { EmprestimosTab } from "@/components/admin/EmprestimosTab";
import { EstoqueManager } from "@/components/admin/EstoqueManager";
import { HistoricoMateriaisTab } from "@/components/admin/HistoricoMateriaisTab";
import { calculateAdminStats } from "@/utils/adminCalculations";

// Lazy load de componentes pesados
const LazyEstoqueManager = React.lazy(() => 
  import("@/components/admin/EstoqueManager").then(module => ({ default: module.EstoqueManager }))
);

const LazyHistoricoMateriaisTab = React.lazy(() => 
  import("@/components/admin/HistoricoMateriaisTab").then(module => ({ default: module.HistoricoMateriaisTab }))
);

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("emprestimos");

  // Auth e notificações
  const { isLoggedIn, login, logout, isLoading: authLoading } = useAdminAuth();
  const { notificarFuncionario, isNotifying } = useNotificacoes();

  // Data hooks
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios(refreshKey);
  const { ferramentas, loading: loadingFerramentas, refetch: refetchFerramentas } = useFerramentas(refreshKey);
  const { materiais, loading: loadingMateriais } = useMateriais(refreshKey);
  const { funcionariosComFerramentas, refetch: refetchFuncionariosComFerramentas } = useFuncionariosComFerramentas(ferramentas, refreshKey);

  // Memoizar cálculos de estatísticas
  const stats = useMemo(() => 
    calculateAdminStats(funcionariosComFerramentas, ferramentas, materiais), 
    [funcionariosComFerramentas, ferramentas, materiais]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      console.log('Iniciando atualização de dados...');
      
      // Incrementar a chave de refresh para forçar recarga dos hooks
      setRefreshKey(prev => prev + 1);
      
      // Executar refetch específico onde disponível em paralelo
      await Promise.all([
        refetchFerramentas?.(),
        refetchFuncionariosComFerramentas?.()
      ]);

      // Aguardar um momento para garantir que os dados sejam atualizados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Dados atualizados com sucesso');
      
      toast({
        title: "Dados atualizados",
        description: "As informações foram recarregadas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchFerramentas, refetchFuncionariosComFerramentas, toast]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  // Memoizar handlers
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/3b7074e8-e9f6-44ab-ba68-338592581b56.png" 
              alt="AVB Logo" 
              className="w-14 h-14 animate-pulse"
            />
          </div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={login} />;
  }

  const isLoading = loadingFuncionarios || loadingFerramentas;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onRefresh={handleRefresh} onLogout={handleLogout} isRefreshing={isRefreshing} />

      <main className="container mx-auto p-6">
        <AdminDashboard 
          totalFuncionariosComFerramentas={stats.totalFuncionariosComFerramentas}
          totalFerramentasEmprestadas={stats.totalFerramentasEmprestadas}
          totalFerramentasCadastradas={stats.totalFerramentasCadastradas}
          totalMateriais={materiais.length}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emprestimos">Empréstimos de Ferramentas</TabsTrigger>
            <TabsTrigger value="controle">Controle de Estoque</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Retirada de Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="emprestimos" className="space-y-6">
            <EmprestimosTab 
              funcionariosComFerramentas={funcionariosComFerramentas}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onNotificarFuncionario={notificarFuncionario}
              isNotifying={isNotifying}
              loading={isLoading}
              totalFerramentasEmprestadas={stats.totalFerramentasEmprestadas}
            />
          </TabsContent>

          <TabsContent value="controle" className="space-y-6">
            <React.Suspense fallback={<div className="p-8 text-center">Carregando controle de estoque...</div>}>
              <LazyEstoqueManager 
                materiais={materiais}
                ferramentas={ferramentas}
                onRefresh={handleRefresh}
              />
            </React.Suspense>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <React.Suspense fallback={<div className="p-8 text-center">Carregando histórico...</div>}>
              <LazyHistoricoMateriaisTab refreshKey={refreshKey} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default React.memo(Admin);
