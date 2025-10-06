import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
interface AdminHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}
export const AdminHeader = ({
  onRefresh,
  onLogout,
  isRefreshing
}: AdminHeaderProps) => {
  return <header className="text-primary-foreground p-4 shadow-lg bg-slate-950">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="/lovable-uploads/0b81087d-9590-4c4a-86ad-0eb91b54f8c3.png" alt="AVB Logo" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-primary-foreground/80">AVB - Sistema de Controle</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing} className="text-primary-foreground hover:bg-primary-foreground/20">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>;
};