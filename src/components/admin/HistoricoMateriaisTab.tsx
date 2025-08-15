
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, Calendar, User, ChevronDown, ChevronRight } from "lucide-react";
import { useHistoricoMateriais, type HistoricoMaterialFormatado } from "@/hooks/useHistoricoMateriais";
import { Button } from "@/components/ui/button";

interface HistoricoMateriaisTabProps {
  refreshKey?: number;
}

interface FuncionarioAgrupado {
  funcionario: string;
  matricula: string;
  materiais: HistoricoMaterialFormatado[];
  totalQuantidade: number;
}

export const HistoricoMateriaisTab = ({ refreshKey }: HistoricoMateriaisTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFuncionarios, setExpandedFuncionarios] = useState<Set<string>>(new Set());
  const { historico, loading } = useHistoricoMateriais(refreshKey);

  console.log('Histórico carregado:', historico);

  // Agrupar histórico por funcionário
  const funcionariosAgrupados: FuncionarioAgrupado[] = historico.reduce((acc, item) => {
    const funcionarioExistente = acc.find(f => f.matricula === item.matricula);
    
    if (funcionarioExistente) {
      funcionarioExistente.materiais.push(item);
      funcionarioExistente.totalQuantidade += item.quantidade;
    } else {
      acc.push({
        funcionario: item.funcionario,
        matricula: item.matricula,
        materiais: [item],
        totalQuantidade: item.quantidade
      });
    }
    
    return acc;
  }, [] as FuncionarioAgrupado[]);

  // Filtrar funcionários baseado no termo de busca
  const funcionariosFiltrados = funcionariosAgrupados.filter(funcionario => {
    const termo = searchTerm.toLowerCase();
    return (
      funcionario.funcionario.toLowerCase().includes(termo) ||
      funcionario.matricula.toLowerCase().includes(termo) ||
      funcionario.materiais.some(material => 
        material.material_nome.toLowerCase().includes(termo) ||
        material.material_tag.toLowerCase().includes(termo) ||
        material.data.toLowerCase().includes(termo)
      )
    );
  });

  // Estatísticas
  const totalRetiradas = historico.length;
  const totalQuantidade = historico.reduce((acc, item) => acc + item.quantidade, 0);
  const materiaisUnicos = new Set(historico.map(item => item.material_tag)).size;

  const toggleFuncionario = (matricula: string) => {
    const newExpanded = new Set(expandedFuncionarios);
    if (newExpanded.has(matricula)) {
      newExpanded.delete(matricula);
    } else {
      newExpanded.add(matricula);
    }
    setExpandedFuncionarios(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico de materiais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Retiradas</p>
                <p className="text-2xl font-bold">{totalRetiradas}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantidade Total</p>
                <p className="text-2xl font-bold">{totalQuantidade}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Materiais Diferentes</p>
                <p className="text-2xl font-bold">{materiaisUnicos}</p>
              </div>
              <User className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Materiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Histórico de Retirada de Materiais ({funcionariosFiltrados.length} funcionários)
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por funcionário, matrícula, material ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {funcionariosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchTerm ? "Nenhum registro encontrado" : "Nenhum histórico de materiais"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente ajustar os filtros de busca" : "Os registros de retirada aparecerão aqui"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {funcionariosFiltrados.map((funcionario) => {
                const isExpanded = expandedFuncionarios.has(funcionario.matricula);
                
                return (
                  <Card key={funcionario.matricula} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => toggleFuncionario(funcionario.matricula)}
                        className="w-full justify-between p-0 h-auto hover:bg-transparent"
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="text-left">
                            <h3 className="font-semibold text-lg">{funcionario.funcionario}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">#{funcionario.matricula}</Badge>
                              <span>{funcionario.materiais.length} retiradas</span>
                              <span>Total: {funcionario.totalQuantidade} itens</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </Button>
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Materiais retirados:</p>
                          {funcionario.materiais.map((material, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{material.material_tag}</Badge>
                                <span className="text-sm">{material.material_nome}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-medium">Qtd: {material.quantidade}</span>
                                <span>{material.data}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
