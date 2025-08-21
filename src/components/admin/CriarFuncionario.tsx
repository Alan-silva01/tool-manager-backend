
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppInput } from "@/components/ui/whatsapp-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface CriarFuncionarioProps {
  onSuccess: () => void;
}

type SetorType = "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro";

export const CriarFuncionario = ({ onSuccess }: CriarFuncionarioProps) => {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState<SetorType | "">("");
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");
  const [rawWhatsApp, setRawWhatsApp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSetorChange = (value: string) => {
    setSetor(value as SetorType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !matricula || !setor) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("funcionarios")
        .insert({
          nome,
          matricula: parseInt(matricula),
          setor: setor as SetorType,
          numero_whatsapp: rawWhatsApp || null,
        });

      if (error) {
        console.error("Erro ao criar funcionário:", error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário criado com sucesso!",
      });

      // Limpar formulário
      setNome("");
      setMatricula("");
      setSetor("");
      setNumeroWhatsApp("");
      setRawWhatsApp("");
      
      onSuccess();
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o funcionário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Adicionar Novo Funcionário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Digite a matrícula"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setor">Setor *</Label>
              <Select value={setor} onValueChange={handleSetorChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Usinagem industrial">Usinagem industrial</SelectItem>
                  <SelectItem value="Oficina cantilever">Oficina cantilever</SelectItem>
                  <SelectItem value="Oficina de guias">Oficina de guias</SelectItem>
                  <SelectItem value="Montagem de gaiola">Montagem de gaiola</SelectItem>
                  <SelectItem value="Oficina de mancal">Oficina de mancal</SelectItem>
                  <SelectItem value="Usinagem de cilindros">Usinagem de cilindros</SelectItem>
                  <SelectItem value="Oficina central">Oficina central</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <WhatsAppInput
                id="whatsapp"
                value={numeroWhatsApp}
                onChange={setNumeroWhatsApp}
                onRawValueChange={setRawWhatsApp}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Funcionário"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
