
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";

const Relatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { buscarFuncionario, loading: loadingFuncionarios } = useFuncionarios();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const { materiais, loading: loadingMateriais } = useMateriais();
  
  const [view, setView] = useState<'menu' | 'funcionario' | 'estoque'>('menu');
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);
  const [ferramentasEmPosse, setFerramentasEmPosse] = useState<any[]>([]);

  const handleBuscarFuncionario = () => {
    if (!matricula.trim()) {
      toast({
        title: "Erro",
        description: "Digite a matrícula do funcionário",
        variant: "destructive",
      });
      return;
    }

    const func = buscarFuncionario(matricula);
    if (func) {
      setFuncionario(func);
      
      // Buscar ferramentas em posse
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
        variant: "destructive",
      });
    }
  };

  // Calcular materiais com estoque baixo
  const estoqueBaixo = materiais.filter(material => {
    const quantidade = Number(material.quantidade) || 0;
    const minimo = Number(material.quantidade_minima) || 0;
    return quantidade <= minimo;
  });

  const isLoading = loadingFuncionarios || loadingFerramentas || loadingMateriais;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-3">
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
              {view === 'estoque' && 'Alertas de estoque'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-md">
        {/* Menu Principal */}
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

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => setView('estoque')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Alertas de Estoque</h3>
                  <p className="text-sm text-muted-foreground">
                    Itens com estoque baixo
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Busca de Funcionário */}
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

        {/* Relatório do Funcionário */}
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

            {/* Ferramentas em Posse */}
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

        {/* Alertas de Estoque */}
        {view === 'estoque' && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Itens com Estoque Baixo
                </CardTitle>
              </CardHeader>
            </Card>

            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Carregando alertas...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {estoqueBaixo.map((item) => (
                  <Card key={item.id} className="border-destructive/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-destructive">{item.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            Estoque atual: {item.quantidade} {item.unidade}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mínimo necessário: {item.quantidade_minima} {item.unidade}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          Crítico
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {estoqueBaixo.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Nenhum item com estoque baixo no momento
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Relatorios;
