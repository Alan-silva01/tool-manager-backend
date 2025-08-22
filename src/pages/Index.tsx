
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Users, Shield, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo, useEffect, useCallback } from "react";
import { LazyImage } from "@/components/LazyImage";

const Index = memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🏠 Página Index carregada');
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('🔄 Refresh da página');
    window.location.reload();
  }, []);

  const handleNavigateToAdmin = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleNavigateToPegarItem = useCallback(() => {
    navigate("/pegar-item");
  }, [navigate]);

  const handleNavigateToDevolverItem = useCallback(() => {
    navigate("/devolver-item");
  }, [navigate]);

  const handleNavigateToRelatorios = useCallback(() => {
    navigate("/relatorios");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg" role="banner">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center">
              <LazyImage 
                src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
                alt="AVB - Aço Verde Brasil Logo" 
                className="w-6 h-6 md:w-10 md:h-10 brightness-0 invert"
                loading="eager"
                decoding="sync"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">AVB - Aço Verde Brasil</h1>
              <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">
                Sistema de Controle de Estoque e Ferramentaria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleRefresh}
              aria-label="Atualizar página"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleNavigateToAdmin}
              aria-label="Acessar área administrativa"
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 max-w-lg" role="main">
        <div className="text-center mb-6 md:mb-8 mt-4 md:mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
            Sistema de Controle
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Gestão inteligente de ferramentas e materiais
          </p>
        </div>

        <nav className="space-y-4 md:space-y-6" role="navigation" aria-label="Menu principal">
          {/* Pegar Item Button */}
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={handleNavigateToPegarItem}
                aria-describedby="pegar-item-desc"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Download className="w-5 h-5 md:w-7 md:h-7 text-primary-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Pegar Item
                  </h3>
                  <p id="pegar-item-desc" className="text-sm md:text-base text-muted-foreground">
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
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-accent/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                onClick={handleNavigateToDevolverItem}
                aria-describedby="devolver-item-desc"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-accent rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Upload className="w-5 h-5 md:w-7 md:h-7 text-accent-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Devolver Item
                  </h3>
                  <p id="devolver-item-desc" className="text-sm md:text-base text-muted-foreground">
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
                className="w-full h-20 md:h-28 flex items-center justify-start gap-4 md:gap-6 text-left p-4 md:p-8 hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                onClick={handleNavigateToRelatorios}
                aria-describedby="relatorios-desc"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Users className="w-5 h-5 md:w-7 md:h-7 text-secondary-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    Relatórios
                  </h3>
                  <p id="relatorios-desc" className="text-sm md:text-base text-muted-foreground">
                    Consultar empréstimos por funcionário
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </nav>
      </main>
    </div>
  );
});

Index.displayName = "Index";

export default Index;
