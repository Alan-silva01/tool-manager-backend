
import { useState } from "react";
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

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auth e notificações
  const { isLoggedIn, login, logout } = useAdminAuth();
  const { notificarFuncionario, isNotifying } = useNotificacoes();

  // Data hooks
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios(refreshKey);
  const { ferramentas, loading: loadingFerramentas, refetch: refetchFerramentas } = useFerramentas(refreshKey);
  const { materiais, loading: loadingMateriais } = useMateriais(refreshKey);
  const { funcionariosComFerramentas, refetch: refetchFuncionariosComFerramentas } = useFuncionariosComFerramentas(ferramentas, refreshKey);

  // Calcular estatísticas
  const stats = calculateAdminStats(funcionariosComFerramentas, ferramentas, materiais);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('Iniciando atualização de dados...');
      
      // Incrementar a chave de refresh para forçar recarga dos hooks
      setRefreshKey(prev => prev + 1);
      
      // Executar refetch específico onde disponível
      if (refetchFerramentas) {
        await refetchFerramentas();
      }
      
      if (refetchFuncionariosComFerramentas) {
        await refetchFuncionariosComFerramentas();
      }

      // Aguardar um momento para garantir que os dados sejam atualizados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={login} />;
  }

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

        <Tabs defaultValue="emprestimos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emprestimos">Empréstimos de Ferramentas</TabsTrigger>
            <TabsTrigger value="controle">Controle de Estoque</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Retirada de Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="emprestimos" className="space-y-6">
            <EmprestimosTab 
              funcionariosComFerramentas={funcionariosComFerramentas}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNotificarFuncionario={notificarFuncionario}
              isNotifying={isNotifying}
              loading={loadingFuncionarios || loadingFerramentas}
              totalFerramentasEmprestadas={stats.totalFerramentasEmprestadas}
            />
          </TabsContent>

          <TabsContent value="controle" className="space-y-6">
            <EstoqueManager 
              materiais={materiais}
              ferramentas={ferramentas}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <HistoricoMateriaisTab refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
