
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppInput } from "@/components/ui/whatsapp-input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import type { Funcionario } from "@/types";

interface EditarFuncionarioProps {
  funcionario: Funcionario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditarFuncionario = ({ funcionario, open, onOpenChange, onSuccess }: EditarFuncionarioProps) => {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState<"Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro" | "">("");
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");
  const [rawWhatsApp, setRawWhatsApp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (funcionario) {
      setNome(funcionario.nome);
      setMatricula(funcionario.matricula.toString());
      setSetor(funcionario.setor as "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro");
      // O número já vem formatado do banco, então passa direto
      setNumeroWhatsApp(funcionario.numero_whatsapp || "");
      setRawWhatsApp(funcionario.numero_whatsapp || "");
    }
  }, [funcionario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!funcionario || !nome || !matricula || !setor) {
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
        .update({
          nome,
          matricula: parseInt(matricula),
          setor: setor as "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro",
          numero_whatsapp: rawWhatsApp || null,
        })
        .eq("id", funcionario.id);

      if (error) {
        console.error("Erro ao atualizar funcionário:", error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário atualizado com sucesso!",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o funcionário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Funcionário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nome">Nome Completo *</Label>
            <Input
              id="edit-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-matricula">Matrícula *</Label>
            <Input
              id="edit-matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite a matrícula"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-setor">Setor *</Label>
            <Select value={setor} onValueChange={setSetor} required>
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
            <Label htmlFor="edit-whatsapp">WhatsApp (opcional)</Label>
            <WhatsAppInput
              id="edit-whatsapp"
              value={numeroWhatsApp}
              onChange={setNumeroWhatsApp}
              onRawValueChange={setRawWhatsApp}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
