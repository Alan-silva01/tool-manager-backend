
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, User, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const Relatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  
  const [view, setView] = useState<'menu' | 'funcionario'>('menu');
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);
  const [ferramentasEmPosse, setFerramentasEmPosse] = useState<any[]>([]);

  const isLoading = loadingFerramentas || loadingMateriais;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBuscarFuncionario = async () => {
    if (!matricula.trim()) {
      toast({
        title: "Erro",
        description: "Digite a matrícula do funcionário",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .rpc('validate_employee', { p_matricula: Number(matricula.trim()) });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const func = data[0];
        setFuncionario({
          ...func,
          matricula: matricula.trim()
        });
        
        const ferramentasDoFuncionario = [];
        if (func.posse_ferramentas && Array.isArray(func.posse_ferramentas)) {
          for (const tag of func.posse_ferramentas) {
            const ferramenta = ferramentas.find(f => f.tag === tag);
            if (ferramenta) {
              ferramentasDoFuncionario.push(ferramenta);
            }
          }
        }
        setFerramentasEmPosse(ferramentasDoFuncionario);
        setView('funcionario');
      } else {
        toast({
          title: "Matrícula não encontrada",
          description: "Verifique a matrícula digitada",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      toast({
        title: "Erro ao buscar funcionário",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-[#161616] text-[#f4f4f4] px-4 md:px-6 h-12 flex items-center justify-between border-b border-[#2e2e2e]">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-[#a8a8a8] hover:text-white hover:bg-[#262626] rounded-none"
            onClick={() => {
              if (view === 'menu') navigate('/');
              else setView('menu');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold tracking-tight text-white">Relatórios</h1>
            <span className="text-[11px] font-mono text-[#7c9c84] bg-[#262626] px-1.5 py-0.5 border border-[#393939] uppercase">
              {view === 'menu' && 'VISÃO GERAL'}
              {view === 'funcionario' && 'POR COLABORADOR'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-[#a8a8a8] hover:text-white hover:bg-[#262626] rounded-none"
            onClick={handleRefresh} 
            disabled={isLoading}
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-2xl md:max-w-3xl">
        {view === 'menu' && (
          <div className="space-y-4 mt-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => setView('funcionario')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Relatório por Funcionário</h3>
                  <p className="text-sm text-muted-foreground">
                    Histórico de retiradas e devoluções
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'funcionario' && !funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Buscar Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input 
                    id="matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 13812"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={handleBuscarFuncionario}
                  disabled={!matricula || isLoading}
                >
                  {isLoading ? 'Carregando...' : 'Buscar Histórico'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'funcionario' && funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Funcionário</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">{funcionario.nome}</p>
                  <p className="text-sm text-muted-foreground">{funcionario.setor}</p>
                  <p className="text-sm text-muted-foreground">Matrícula: {matricula}</p>
                </div>
              </CardContent>
            </Card>

            {ferramentasEmPosse.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Ferramentas em Posse ({ferramentasEmPosse.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ferramentasEmPosse.map((ferramenta) => (
                    <div key={ferramenta.id} className="border-l-4 border-destructive pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{ferramenta.nome}</p>
                          <Badge variant="outline">{ferramenta.tag}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            Categoria: {ferramenta.categoria}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {ferramentasEmPosse.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Este funcionário não possui ferramentas em sua posse no momento
                  </p>
                </CardContent>
              </Card>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setFuncionario(null);
                setMatricula('');
                setFerramentasEmPosse([]);
              }}
            >
              Buscar Outro Funcionário
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Relatorios;
