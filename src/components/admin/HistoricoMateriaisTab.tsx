import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHistoricoMateriais } from "@/hooks/useHistoricoMateriais";
import { ChevronDown, ChevronRight, Search, Calendar, FileText, User, Package } from "lucide-react";
import { useState } from "react";
interface HistoricoMateriaisTabProps {
  refreshKey?: number;
}
export const HistoricoMateriaisTab = ({
  refreshKey
}: HistoricoMateriaisTabProps) => {
  const {
    historico,
    loading,
    error,
    filtros,
    setFiltros
  } = useHistoricoMateriais(refreshKey);
  const [funcionariosExpandidos, setFuncionariosExpandidos] = useState<Set<string>>(new Set());
  const toggleFuncionario = (matricula: string) => {
    const novosExpandidos = new Set(funcionariosExpandidos);
    if (novosExpandidos.has(matricula)) {
      novosExpandidos.delete(matricula);
    } else {
      novosExpandidos.add(matricula);
    }
    setFuncionariosExpandidos(novosExpandidos);
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Erro ao carregar histórico</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>;
  }
  const totalRetiradas = historico.reduce((acc, func) => acc + func.materiais.length, 0);
  const totalItens = historico.reduce((acc, func) => acc + func.totalQuantidade, 0);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Histórico de Materiais</h2>
          <p className="text-muted-foreground">
            Visualize o histórico completo de retiradas de materiais
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários que Retiraram</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historico.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Retiradas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRetiradas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens Retirados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Funcionário</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historico.length > 0 ? Math.round(totalItens / historico.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>
            Filtre o histórico por funcionário, material ou período
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Funcionário</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou matrícula..." value={filtros.funcionario} onChange={e => setFiltros(prev => ({
                ...prev,
                funcionario: e.target.value
              }))} className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Material</label>
              <Input placeholder="Buscar por nome ou tag..." value={filtros.material} onChange={e => setFiltros(prev => ({
              ...prev,
              material: e.target.value
            }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={filtros.periodo} onValueChange={value => setFiltros(prev => ({
              ...prev,
              periodo: value
            }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <div className="space-y-4">
        {historico.length === 0 ? <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum histórico encontrado</p>
              </div>
            </CardContent>
          </Card> : historico.map(funcionario => {
        const isExpanded = funcionariosExpandidos.has(funcionario.matricula);
        return <Card key={funcionario.matricula} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div onClick={() => toggleFuncionario(funcionario.matricula)} className="flex justify-between items-start w-full cursor-pointer p-2 -mx-2 transition-colors rounded-md">
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{funcionario.funcionario}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">#{funcionario.matricula}</Badge>
                        <span>{funcionario.materiais.length} retiradas</span>
                        <span>Total: {funcionario.totalQuantidade} itens</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  {isExpanded && <div className="mt-4 space-y-2">
                      {funcionario.materiais.map((material, index) => <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{material.material_tag}</Badge>
                            <span className="text-sm">{material.material_nome}</span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="font-medium">Qtd: {material.quantidade}</span>
                            <span>{material.data}</span>
                          </div>
                        </div>)}
                    </div>}
                </CardContent>
              </Card>;
      })}
      </div>
    </div>;
};