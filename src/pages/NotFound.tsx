import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Página não encontrada</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <Home className="w-4 h-4 mr-2" />
            Voltar para o Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
