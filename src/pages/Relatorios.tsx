
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
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                if (view === 'menu') navigate('/');
                else setView('menu');
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Relatórios</h1>
              <p className="text-sm text-primary-foreground/80">
                {view === 'menu' && 'Escolha um relatório'}
                {view === 'funcionario' && 'Histórico do funcionário'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-md">
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
