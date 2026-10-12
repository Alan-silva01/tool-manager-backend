
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export const AdminHeader = ({ onRefresh, onLogout, isRefreshing }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card text-foreground px-4 md:px-6 h-14 flex items-center justify-between border-b border-border shadow-sm">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
            alt="AVB Logo" 
            className="w-7 h-7 object-contain"
            loading="eager"
            width="28"
            height="28"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-bold tracking-tight text-foreground">
              Painel Administrativo Ferramentaria
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted border border-border rounded-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted border border-border rounded-none transition-colors"
            onClick={onLogout}
            title="Sair do painel"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
