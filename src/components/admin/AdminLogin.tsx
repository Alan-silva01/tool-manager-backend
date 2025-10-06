
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const handleLogin = () => {
    if (loginData.username === "admin" && loginData.password === "admin123") {
      onLogin();
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique usuário e senha",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/lovable-uploads/3b7074e8-e9f6-44ab-ba68-338592581b56.png" 
                  alt="AVB Logo" 
                  className="w-14 h-14"
                />
              </div>
              <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
              <p className="text-muted-foreground">AVB - Aço Verde Brasil</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Digite seu usuário"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Digite sua senha"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleLogin}
                disabled={!loginData.username || !loginData.password}
              >
                <img 
                  src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
                  alt="AVB Logo" 
                  className="w-4 h-4 mr-2 brightness-0 invert"
                />
                Entrar no Sistema
              </Button>
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Voltar ao Sistema Principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
