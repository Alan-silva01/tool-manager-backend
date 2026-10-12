
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

// Inline critical SVGs to reduce network requests
const DownloadIcon = () => (
  <svg className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5 md:w-7 md:h-7 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 md:w-7 md:h-7 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Index = () => {
  const navigate = useNavigate();

  // Preload estratégico baseado em hover/focus
  const preloadPage = React.useCallback((pageName: string) => {
    switch (pageName) {
      case 'pegar-item':
        import("./PegarItem");
        break;
      case 'devolver-item':
        import("./DevolverItem");
        break;
      case 'relatorios':
        import("./Relatorios");
        break;
      case 'admin':
        import("./Admin");
        break;
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Estilo Alma / Carbon */}
      <header className="sticky top-0 z-50 bg-[#161616] text-[#f4f4f4] px-4 md:px-6 h-12 flex items-center justify-between border-b border-[#2e2e2e]">
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
            <h1 className="text-sm md:text-base font-semibold tracking-tight text-white">AVB</h1>
            <span className="text-[11px] font-mono text-[#7c9c84] bg-[#262626] px-1.5 py-0.5 border border-[#393939] hidden sm:inline-block">
              FERRAMENTARIA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#262626] border border-[#393939] text-[#7c9c84] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c9c84] animate-pulse"></span>
            OPERACIONAL
          </span>
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-[#a8a8a8] hover:text-white hover:bg-[#262626]"
            onClick={handleRefresh}
            title="Atualizar"
          >
            <RefreshIcon />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider text-[#f4f4f4] hover:bg-[#262626] border border-[#393939]"
            onClick={() => navigate("/admin")}
            onMouseEnter={() => preloadPage('admin')}
            onFocus={() => preloadPage('admin')}
          >
            Admin
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-10 max-w-3xl">
        {/* Banner Hero Alma */}
        <div className="mb-8 md:mb-10 border-l-4 border-primary pl-5 py-2 bg-card/40 border-y border-r border-border/50">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7c9c84] mb-1 font-semibold">
            Controle de Fluxo Operacional
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
            Gestão de Ferramentaria
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1.5">
            Selecione uma operação para retirada, devolução ou consulta de registros.
          </p>
        </div>

        <div className="space-y-4 md:space-y-5">
          {/* Pegar Item Card */}
          <Card className="group border-2 border-border hover:border-primary transition-all duration-200 bg-card hover:shadow-md">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-auto flex items-center justify-start gap-5 md:gap-6 text-left p-5 md:p-7 hover:bg-primary/5 rounded-none"
                onClick={() => navigate("/pegar-item")}
                onMouseEnter={() => preloadPage('pegar-item')}
                onFocus={() => preloadPage('pegar-item')}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 group-hover:bg-[#6c8c74] transition-colors shadow-sm">
                  <div className="scale-125">
                    <DownloadIcon />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      Pegar Item
                    </h3>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-primary/15 text-[#5c7b64] dark:text-[#8eaf96] font-semibold border border-primary/30">
                      Saída
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Retirar ferramentas ou materiais sob requisição de serviço
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all text-lg font-mono">
                  →
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Devolver Item Card */}
          <Card className="group border-2 border-border hover:border-primary transition-all duration-200 bg-card hover:shadow-md">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-auto flex items-center justify-start gap-5 md:gap-6 text-left p-5 md:p-7 hover:bg-muted/40 rounded-none"
                onClick={() => navigate("/devolver-item")}
                onMouseEnter={() => preloadPage('devolver-item')}
                onFocus={() => preloadPage('devolver-item')}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#161616] text-[#f4f4f4] dark:bg-[#262626] flex items-center justify-center flex-shrink-0 border border-border group-hover:border-primary transition-colors shadow-sm">
                  <div className="scale-125">
                    <UploadIcon />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      Devolver Item
                    </h3>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-muted text-muted-foreground font-semibold border border-border">
                      Entrada
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Registrar retorno de ferramentas e instrumentos ao almoxarifado
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all text-lg font-mono">
                  →
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Relatórios Card */}
          <Card className="group border-2 border-border hover:border-primary transition-all duration-200 bg-card hover:shadow-md">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-auto flex items-center justify-start gap-5 md:gap-6 text-left p-5 md:p-7 hover:bg-muted/40 rounded-none"
                onClick={() => navigate("/relatorios")}
                onMouseEnter={() => preloadPage('relatorios')}
                onFocus={() => preloadPage('relatorios')}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-muted text-foreground flex items-center justify-center flex-shrink-0 border border-border group-hover:border-primary transition-colors shadow-sm">
                  <div className="scale-125">
                    <UsersIcon />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                      Relatórios & Histórico
                    </h3>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 bg-muted text-muted-foreground font-semibold border border-border">
                      Consulta
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Consultar empréstimos em aberto e histórico de movimentações por colaborador
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all text-lg font-mono">
                  →
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Minimalista Alma */}
        <div className="mt-12 pt-5 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>AVB FERRAMENTARIA v2.0</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7c9c84] inline-block"></span>
            SISTEMA OPERACIONAL
          </span>
        </div>
      </main>
    </div>
  );
};

export default Index;
