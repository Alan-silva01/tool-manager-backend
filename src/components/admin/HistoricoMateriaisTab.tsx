
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Package, Calendar, User } from "lucide-react";
import { useHistoricoMateriais, type HistoricoMaterialFormatado } from "@/hooks/useHistoricoMateriais";

interface HistoricoMateriaisTabProps {
  refreshKey?: number;
}

export const HistoricoMateriaisTab = ({ refreshKey }: HistoricoMateriaisTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { historico, loading } = useHistoricoMateriais(refreshKey);

  // Filtrar histórico baseado no termo de busca
  const historicoFiltrado = historico.filter(item => {
    const termo = searchTerm.toLowerCase();
    return (
      item.funcionario.toLowerCase().includes(termo) ||
      item.matricula.toLowerCase().includes(termo) ||
      item.material_nome.toLowerCase().includes(termo) ||
      item.material_tag.toLowerCase().includes(termo) ||
      item.data.toLowerCase().includes(termo)
    );
  });

  // Estatísticas
  const totalRetiradas = historico.length;
  const totalQuantidade = historico.reduce((acc, item) => acc + item.quantidade, 0);
  const materiaisUnicos = new Set(historico.map(item => item.material_tag)).size;

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
            Histórico de Retirada de Materiais
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
          {historicoFiltrado.length === 0 ? (
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.funcionario}
                      </TableCell>
                      <TableCell>{item.matricula}</TableCell>
                      <TableCell>{item.material_nome}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.material_tag}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.quantidade}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.data}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
