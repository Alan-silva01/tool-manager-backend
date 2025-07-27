import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Package, Wrench } from "lucide-react";
import { useMateriais } from '@/hooks/useMateriais';
import { useFerramentas } from '@/hooks/useFerramentas';

const Relatorios = () => {
  const { materiais, loading: loadingMateriais } = useMateriais();
  const { ferramentas, loading: loadingFerramentas } = useFerramentas();
  const [materiaisEstoqueBaixo, setMateriaisEstoqueBaixo] = useState<any[]>([]);
  const [ferramentasManutencao, setFerramentasManutencao] = useState<any[]>([]);
  const [totalMateriais, setTotalMateriais] = useState(0);
  const [totalFerramentas, setTotalFerramentas] = useState(0);
  const [materiaisSemEstoque, setMateriaisSemEstoque] = useState(0);
  const [ferramentasDisponiveis, setFerramentasDisponiveis] = useState(0);

  const getQuantidadeDisponivel = (material: any) => {
    return (material.entrada || 0) - (material.saida || 0);
  };

  const processarDados = () => {
    if (!materiais || !ferramentas) return;

    // Processar materiais com estoque baixo
    const materiaisEstoqueBaixo = materiais.filter(material => {
      const quantidadeDisponivel = getQuantidadeDisponivel(material);
      return quantidadeDisponivel <= (material.quantidade_minima || 0) && quantidadeDisponivel > 0;
    });
    setMateriaisEstoqueBaixo(materiaisEstoqueBaixo);

    // Processar ferramentas que precisam de manutenção (simulação)
    const ferramentasManutencao = ferramentas.filter((ferramenta, index) => index % 3 === 0);
    setFerramentasManutencao(ferramentasManutencao);

    // Estatísticas gerais
    const totalMateriais = materiais.length;
    const totalFerramentas = ferramentas.length;
    const materiaisSemEstoque = materiais.filter(material => getQuantidadeDisponivel(material) <= 0).length;
    const ferramentasDisponiveis = ferramentas.filter(ferramenta => (ferramenta.quantidade || 0) > 0).length;

    setTotalMateriais(totalMateriais);
    setTotalFerramentas(totalFerramentas);
    setMateriaisSemEstoque(materiaisSemEstoque);
    setFerramentasDisponiveis(ferramentasDisponiveis);
  };

  useEffect(() => {
    processarDados();
  }, [materiais, ferramentas]);

  if (loadingMateriais || loadingFerramentas) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Relatórios de Estoque</h1>
          <p className="text-sm text-primary-foreground/80">Visão geral do estoque de materiais e ferramentas</p>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <Tabs defaultValue="estoque" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
          </TabsList>

          <TabsContent value="estoque" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total de Materiais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMateriais}</div>
                  <p className="text-sm text-muted-foreground">Número total de materiais cadastrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total de Ferramentas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFerramentas}</div>
                  <p className="text-sm text-muted-foreground">Número total de ferramentas cadastradas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Materiais Sem Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materiaisSemEstoque}</div>
                  <p className="text-sm text-muted-foreground">Número de materiais com estoque zerado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ferramentas Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ferramentasDisponiveis}</div>
                  <p className="text-sm text-muted-foreground">Número de ferramentas com estoque maior que zero</p>
                </CardContent>
              </Card>
            </div>

            {/* Materiais com Estoque Baixo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Materiais com Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {materiaisEstoqueBaixo && materiaisEstoqueBaixo.length > 0 ? (
                  <div className="space-y-2">
                    {materiaisEstoqueBaixo.map((material) => (
                      <div key={material.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">{material.nome}</p>
                          <p className="text-sm text-muted-foreground">TAG: {material.tag}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">
                            {getQuantidadeDisponivel(material)} {material.unidade || 'un'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Mín: {material.quantidade_minima || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Todos os materiais estão com estoque adequado</p>
                )}
              </CardContent>
            </Card>

            {/* Ferramentas que precisam de manutenção */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-500" />
                  Ferramentas Precisando de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ferramentasManutencao && ferramentasManutencao.length > 0 ? (
                  <div className="space-y-2">
                    {ferramentasManutencao.map((ferramenta) => (
                      <div key={ferramenta.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">{ferramenta.nome}</p>
                          <p className="text-sm text-muted-foreground">TAG: {ferramenta.tag}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {ferramenta.quantidade} un
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma ferramenta precisa de manutenção no momento</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manutencao">
            <Card>
              <CardHeader>
                <CardTitle>Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                Em desenvolvimento
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Relatorios;
