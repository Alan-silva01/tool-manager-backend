import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const funcionarios = {
  "13812": { 
    nome: "ANDRE FELIPE COSTA DA SILVA", 
    setor: "Usinagem industrial",
    historico: [
      {
        id: 1,
        tipo: "retirada",
        item: "Furadeira",
        tag: "001",
        data: "2024-01-15",
        hora: "08:30",
        devolvido: false
      },
      {
        id: 2,
        tipo: "retirada",
        item: "Torquímetro",
        tag: "006",
        data: "2024-01-14",
        hora: "14:20",
        devolvido: false
      },
      {
        id: 3,
        tipo: "retirada",
        item: "Chave Allen Conj.",
        tag: "007",
        data: "2024-01-10",
        hora: "09:15",
        devolvido: true,
        dataDevolucao: "2024-01-12",
        horaDevolucao: "16:45"
      },
      {
        id: 4,
        tipo: "material",
        item: "Acetona",
        quantidade: "2 litros",
        data: "2024-01-16",
        hora: "10:30"
      }
    ]
  },
  "7203": { 
    nome: "ANGELO VALADARES DE CASTRO", 
    setor: "Usinagem industrial",
    historico: [
      {
        id: 5,
        tipo: "retirada",
        item: "Parafusadeira",
        tag: "002",
        data: "2024-01-16",
        hora: "07:45",
        devolvido: false
      }
    ]
  }
};

const estoqueBaixo = [
  { nome: "WD-40", quantidade: 3, minimo: 3, unidade: "latas" },
  { nome: "Torquímetro", quantidade: 1, minimo: 2, unidade: "un" },
  { nome: "Escova de aço", quantidade: 4, minimo: 5, unidade: "un" },
];

const Relatorios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<'menu' | 'funcionario' | 'estoque'>('menu');
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);

  const handleBuscarFuncionario = () => {
    const func = funcionarios[matricula as keyof typeof funcionarios];
    if (func) {
      setFuncionario(func);
      setView('funcionario');
    } else {
      toast({
        title: "Matrícula não encontrada",
        description: "Verifique a matrícula digitada",
        variant: "destructive",
      });
    }
  };

  const ferramentasEmPosse = funcionario?.historico.filter(
    (item: any) => item.tipo === 'retirada' && !item.devolvido
  ) || [];

  const materiaisRetirados = funcionario?.historico.filter(
    (item: any) => item.tipo === 'material'
  ) || [];

  const ferramentasDevolvidas = funcionario?.historico.filter(
    (item: any) => item.tipo === 'retirada' && item.devolvido
  ) || [];

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
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleBuscarFuncionario}
                  disabled={!matricula}
                >
                  Buscar Histórico
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
                  {ferramentasEmPosse.map((item: any) => (
                    <div key={item.id} className="border-l-4 border-destructive pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.item}</p>
                          <Badge variant="outline">{item.tag}</Badge>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{item.data}</p>
                          <p>{item.hora}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Ferramentas Devolvidas */}
            {ferramentasDevolvidas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    Ferramentas Devolvidas ({ferramentasDevolvidas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ferramentasDevolvidas.map((item: any) => (
                    <div key={item.id} className="border-l-4 border-primary pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.item}</p>
                          <Badge variant="outline">{item.tag}</Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            <p>Retirada: {item.data} às {item.hora}</p>
                            <p>Devolução: {item.dataDevolucao} às {item.horaDevolucao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Materiais Consumidos */}
            {materiaisRetirados.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">
                    Materiais Consumidos ({materiaisRetirados.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {materiaisRetirados.map((item: any) => (
                    <div key={item.id} className="border-l-4 border-accent pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.item}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantidade}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{item.data}</p>
                          <p>{item.hora}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setFuncionario(null);
                setMatricula('');
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

            {estoqueBaixo.map((item, index) => (
              <Card key={index} className="border-destructive/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-destructive">{item.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        Estoque atual: {item.quantidade} {item.unidade}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mínimo necessário: {item.minimo} {item.unidade}
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Relatorios;