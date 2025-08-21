import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Package, Search, Bell, RefreshCw, Phone } from "lucide-react";
import type { FuncionarioComFerramentas } from '@/types';

interface EmprestimosTabProps {
  funcionariosComFerramentas: FuncionarioComFerramentas[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNotificarFuncionario: (funcionario: FuncionarioComFerramentas, ferramenta: any) => void;
  isNotifying: string | null;
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
  const filteredFuncionarios = funcionariosComFerramentas.filter(
    funcionario => 
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.matricula.includes(searchTerm) ||
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.ferramentas.some((f: any) => f.nome.toLowerCase().includes(searchTerm.toLowerCase()) || f.tag.includes(searchTerm))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Controle de Empréstimos ({totalFerramentasEmprestadas} ferramentas)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Buscar por funcionário, ferramenta, tag ou matrícula..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFuncionarios.map((funcionario) => (
              <Card key={funcionario.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{funcionario.nome}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">#{funcionario.matricula}</Badge>
                        <span>{funcionario.setor}</span>
                        {funcionario.numero_whatsapp && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="font-mono">{funcionario.numero_whatsapp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ferramentas em posse:</p>
                    {funcionario.ferramentas.map((ferramenta: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{ferramenta.tag}</Badge>
                          <span className="text-sm">{ferramenta.nome}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNotificarFuncionario(funcionario, ferramenta)}
                          disabled={isNotifying === `${funcionario.id}-${ferramenta.tag}` || !funcionario.numero_whatsapp}
                          className="ml-2"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          {isNotifying === `${funcionario.id}-${ferramenta.tag}` ? 'Notificando...' : 'Solicitar Devolução'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredFuncionarios.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum funcionário encontrado com ferramentas</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
