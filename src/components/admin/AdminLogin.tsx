
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleLogin = () => {
    // Reset errors
    setErrors({ username: "", password: "" });
    
    const newErrors = { username: "", password: "" };
    
    if (loginData.username !== "admin") {
      newErrors.username = "Usuário incorreto";
    }
    
    if (loginData.password !== "admin123") {
      newErrors.password = "Senha incorreta";
    }
    
    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    
    // Login successful
    onLogin();
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo ao painel administrativo",
    });
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
                  onChange={(e) => {
                    setLoginData({...loginData, username: e.target.value});
                    setErrors({...errors, username: ""});
                  }}
                  placeholder="Digite seu usuário"
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-destructive mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({...loginData, password: e.target.value});
                      setErrors({...errors, password: ""});
                    }}
                    placeholder="Digite sua senha"
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
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
