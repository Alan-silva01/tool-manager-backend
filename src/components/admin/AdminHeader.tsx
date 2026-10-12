
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
    <header className="sticky top-0 z-50 bg-[#161616] text-[#f4f4f4] px-4 md:px-6 h-12 flex items-center justify-between border-b border-[#2e2e2e]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-[#262626] border border-[#393939] flex items-center justify-center">
            <img 
              src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
              alt="AVB Logo" 
              className="w-5 h-5 brightness-0 invert"
              loading="eager"
              width="20"
              height="20"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold tracking-tight text-white">Painel Administrativo</h1>
            <span className="text-[11px] font-mono text-[#7c9c84] bg-[#262626] px-1.5 py-0.5 border border-[#393939]">
              ADMIN
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider text-[#f4f4f4] hover:bg-[#262626] border border-[#393939] rounded-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider text-[#a8a8a8] hover:text-white hover:bg-[#262626] rounded-none transition-colors"
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
