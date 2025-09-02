
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return;
    
    setIsLoading(true);
    
    if (isSignUp) {
      await signUp(loginData.email, loginData.password);
    } else {
      await signIn(loginData.email, loginData.password);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="Digite seu email"
                  required
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
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full" 
                disabled={!loginData.email || !loginData.password || isLoading || loading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <img 
                    src="/lovable-uploads/ab346669-a4ee-4f88-84a4-3252d1b2b074.png" 
                    alt="AVB Logo" 
                    className="w-4 h-4 mr-2 brightness-0 invert"
                  />
                )}
                {isSignUp ? "Criar Conta" : "Entrar no Sistema"}
              </Button>
            </form>
            
            <div className="text-center space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading || loading}
              >
                {isSignUp ? "Já tem conta? Entre aqui" : "Não tem conta? Cadastre-se"}
              </Button>
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
  );
};
