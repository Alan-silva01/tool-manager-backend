
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import React from "react";

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
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
                alt="AVB Logo" 
                className="w-6 h-6 md:w-10 md:h-10 brightness-0 invert"
                loading="eager"
                width="40"
                height="40"
                style={{ maxWidth: '40px', maxHeight: '40px' }}
              />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">AVB - Aço Verde Brasil</h1>
              <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">Sistema de Controle de Estoque e Ferramentaria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => navigate("/admin")}
              onMouseEnter={() => preloadPage('admin')}
              onFocus={() => preloadPage('admin')}
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 max-w-lg">
        <div className="text-center mb-6 md:mb-8 mt-4 md:mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
            Sistema de Controle
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Gestão inteligente de ferramentas e materiais
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Pegar Item Button */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-primary/5"
                onClick={() => navigate("/pegar-item")}
                onMouseEnter={() => preloadPage('pegar-item')}
                onFocus={() => preloadPage('pegar-item')}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <DownloadIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Pegar Item
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Retirar ferramentas ou materiais do estoque
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Devolver Item Button */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/20">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-accent/5"
                onClick={() => navigate("/devolver-item")}
                onMouseEnter={() => preloadPage('devolver-item')}
                onFocus={() => preloadPage('devolver-item')}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-accent rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <UploadIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Devolver Item
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Retornar ferramentas ao estoque
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Relatórios Button */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/20">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-secondary/5"
                onClick={() => navigate("/relatorios")}
                onMouseEnter={() => preloadPage('relatorios')}
                onFocus={() => preloadPage('relatorios')}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <UsersIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Relatórios
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Consultar empréstimos por funcionário
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
