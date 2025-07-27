
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMateriais } from "@/hooks/useMateriais";
import { useFerramentas } from "@/hooks/useFerramentas";

type MaterialReport = {
  id: string;
  nome: string;
  tag: string;
  entrada: number;
  quantidade_minima: number;
  data_entrada_estoque: string;
  saida: number;
  unidade: string;
};

type FerramentaReport = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
};

const Relatorios = () => {
  const navigate = useNavigate();
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  
  const [materiaisReport, setMateriaisReport] = useState<MaterialReport[]>([]);
  const [ferramentasReport, setFerramentasReport] = useState<FerramentaReport[]>([]);

  useEffect(() => {
    // Transform materials data for reports
    const materialsForReport = materiais.map(material => ({
      id: material.id,
      nome: material.nome,
      tag: material.tag,
      entrada: material.entrada || 0,
      quantidade_minima: material.quantidade_minima || 0,
      data_entrada_estoque: material.data_entrada_estoque || '',
      saida: material.saida || 0,
      unidade: material.unidade || 'un'
    }));
    setMateriaisReport(materialsForReport);

    // Transform tools data for reports
    const toolsForReport = ferramentas.map(ferramenta => ({
      id: ferramenta.id,
      nome: ferramenta.nome,
      tag: ferramenta.tag,
      quantidade: ferramenta.quantidade || 0,
      categoria: ferramenta.categoria || '',
      caracteristicas: ferramenta.caracteristicas || {},
      saiu: ferramenta.saiu || 0
    }));
    setFerramentasReport(toolsForReport);
  }, [materiais, ferramentas]);

  // Calculate statistics
  const estatisticas = {
    totalMateriais: materiaisReport.length,
    totalFerramentas: ferramentasReport.length,
    materiaisEstoqueBaixo: materiaisReport.filter(m => {
      const disponivel = m.entrada - m.saida;
      return disponivel <= m.quantidade_minima;
    }).length,
    ferramentasEmprestadas: ferramentasReport.reduce((total, f) => total + f.saiu, 0),
    materialMaisUsado: materiaisReport.reduce((prev, current) => 
      (current.saida > prev.saida) ? current : prev, materiaisReport[0] || {} as MaterialReport
    ),
    ferramentaMaisUsada: ferramentasReport.reduce((prev, current) => 
      (current.saiu > prev.saiu) ? current : prev, ferramentasReport[0] || {} as FerramentaReport
    )
  };

  const materiaisEstoqueBaixo = materiaisReport.filter(material => {
    const disponivel = material.entrada - material.saida;
    return disponivel <= material.quantidade_minima;
  });

  const ferramentasIndisponiveis = ferramentasReport.filter(ferramenta => {
    const disponivel = ferramenta.quantidade - ferramenta.saiu;
    return disponivel <= 0;
  });

  if (loadingMateriais || loadingFerramentas) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-primary-foreground/80">Sistema de Controle de Estoque</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Materiais</p>
                  <p className="text-2xl font-bold">{estatisticas.totalMateriais}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Ferramentas</p>
                  <p className="text-2xl font-bold">{estatisticas.totalFerramentas}</p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-red-500">{estatisticas.materiaisEstoqueBaixo}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ferramentas Emprestadas</p>
                  <p className="text-2xl font-bold text-orange-500">{estatisticas.ferramentasEmprestadas}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Low Stock Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Materiais com Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materiaisEstoqueBaixo.length > 0 ? (
                <div className="space-y-3">
                  {materiaisEstoqueBaixo.map(material => {
                    const disponivel = material.entrada - material.saida;
                    return (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{material.nome}</p>
                          <p className="text-sm text-muted-foreground">Tag: {material.tag}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">{disponivel} {material.unidade}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Mín: {material.quantidade_minima}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum material com estoque baixo
                </p>
              )}
            </CardContent>
          </Card>

          {/* Unavailable Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <TrendingDown className="w-5 h-5" />
                Ferramentas Indisponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ferramentasIndisponiveis.length > 0 ? (
                <div className="space-y-3">
                  {ferramentasIndisponiveis.map(ferramenta => {
                    const disponivel = ferramenta.quantidade - ferramenta.saiu;
                    return (
                      <div key={ferramenta.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <p className="font-medium">{ferramenta.nome}</p>
                          <p className="text-sm text-muted-foreground">Tag: {ferramenta.tag}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{disponivel} disponível</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: {ferramenta.quantidade}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Todas as ferramentas estão disponíveis
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Most Used Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Material Mais Usado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {estatisticas.materialMaisUsado?.nome ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-lg">{estatisticas.materialMaisUsado.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tag: {estatisticas.materialMaisUsado.tag}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{estatisticas.materialMaisUsado.saida} saídas</Badge>
                    <span className="text-sm text-muted-foreground">
                      Disponível: {estatisticas.materialMaisUsado.entrada - estatisticas.materialMaisUsado.saida}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum material usado</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ferramenta Mais Emprestada
              </CardTitle>
            </CardHeader>
            <CardContent>
              {estatisticas.ferramentaMaisUsada?.nome ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-lg">{estatisticas.ferramentaMaisUsada.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tag: {estatisticas.ferramentaMaisUsada.tag}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{estatisticas.ferramentaMaisUsada.saiu} empréstimos</Badge>
                    <span className="text-sm text-muted-foreground">
                      Disponível: {estatisticas.ferramentaMaisUsada.quantidade - estatisticas.ferramentaMaisUsada.saiu}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhuma ferramenta emprestada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Relatorios;
