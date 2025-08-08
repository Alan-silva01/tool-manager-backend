
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Wrench, FileText } from "lucide-react";

interface AdminDashboardProps {
  totalFuncionariosComFerramentas: number;
  totalFerramentasEmprestadas: number;
  totalFerramentasCadastradas: number;
  totalMateriais: number;
}

export const AdminDashboard = ({
  totalFuncionariosComFerramentas,
  totalFerramentasEmprestadas,
  totalFerramentasCadastradas,
  totalMateriais
}: AdminDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Funcionários com Ferramentas</p>
              <p className="text-2xl font-bold">{totalFuncionariosComFerramentas}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Emprestado</p>
              <p className="text-2xl font-bold">{totalFerramentasEmprestadas}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Ferramentas</p>
              <p className="text-2xl font-bold">{totalFerramentasCadastradas}</p>
            </div>
            <Wrench className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Materiais</p>
              <p className="text-2xl font-bold">{totalMateriais}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
