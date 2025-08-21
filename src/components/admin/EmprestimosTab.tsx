
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, Users, Wrench } from "lucide-react";
import { formatWhatsAppForDisplay } from "@/utils/whatsappFormatter";
import type { FuncionarioComFerramentas } from "@/types";

interface EmprestimosTabProps {
  funcionariosComFerramentas: FuncionarioComFerramentas[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNotificarFuncionario: (funcionario: FuncionarioComFerramentas) => Promise<void>;
  isNotifying: boolean;
  loading: boolean;
  totalFerramentasEmprestadas: number;
}

export const EmprestimosTab = ({
  funcionariosComFerramentas,
  searchTerm,
  onSearchChange,
  onNotificarFuncionario,
  isNotifying,
  loading,
  totalFerramentasEmprestadas
}: EmprestimosTabProps) => {
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  const filteredFuncionarios = funcionariosComFerramentas.filter(funcionario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      funcionario.nome.toLowerCase().includes(searchLower) ||
      funcionario.matricula.toString().includes(searchLower) ||
      funcionario.setor.toLowerCase().includes(searchLower) ||
      funcionario.ferramentasEmprestadas.some(ferramenta => 
        ferramenta.nome.toLowerCase().includes(searchLower)
      )
    );
  });

  const handleNotificar = async (funcionario: FuncionarioComFerramentas) => {
    setNotifyingId(funcionario.id);
    try {
      await onNotificarFuncionario(funcionario);
    } finally {
      setNotifyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários com Ferramentas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funcionariosComFerramentas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ferramentas Emprestadas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFerramentasEmprestadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados da Busca</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredFuncionarios.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar por nome, matrícula, setor ou ferramenta..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionários com Ferramentas Emprestadas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFuncionarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum resultado encontrado para a busca.' : 'Nenhum funcionário com ferramentas emprestadas.'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Ferramentas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFuncionarios.map((funcionario) => (
                    <TableRow key={funcionario.id}>
                      <TableCell className="font-medium">{funcionario.nome}</TableCell>
                      <TableCell>{funcionario.matricula}</TableCell>
                      <TableCell>{funcionario.setor}</TableCell>
                      <TableCell>
                        {funcionario.numero_whatsapp ? 
                          formatWhatsAppForDisplay(funcionario.numero_whatsapp) : 
                          'Não informado'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {funcionario.ferramentasEmprestadas.map((ferramenta) => (
                            <Badge key={ferramenta.id} variant="secondary" className="text-xs">
                              {ferramenta.nome}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleNotificar(funcionario)}
                          disabled={isNotifying || notifyingId === funcionario.id || !funcionario.numero_whatsapp}
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {notifyingId === funcionario.id ? 'Enviando...' : 'Notificar'}
                        </Button>
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
