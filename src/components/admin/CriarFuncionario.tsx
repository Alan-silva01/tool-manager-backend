import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { applyWhatsAppMask, removeWhatsAppFormatting } from "@/utils/whatsappFormatter";

type SetorType = "" | "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro";

interface CriarFuncionarioProps {
  onClose: () => void;
  onFuncionarioAdicionado: () => void;
}

export const CriarFuncionario = ({ onClose, onFuncionarioAdicionado }: CriarFuncionarioProps) => {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState<SetorType>("");
  const [whatsapp, setWhatsapp] = useState("");
  const [codNfc, setCodNfc] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleWhatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyWhatsAppMask(e.target.value);
    setWhatsapp(maskedValue);
  };

  const handleSetorChange = (value: string) => {
    setSetor(value as SetorType);
  };

  const formatWhatsAppForSave = (whatsappFormatted: string): string => {
    if (!whatsappFormatted) return '';
    
    // Remove toda formatação
    const cleanNumber = removeWhatsAppFormatting(whatsappFormatted);
    
    // Se tem 11 dígitos (DDD + 9 + número), remove o 9 extra
    if (cleanNumber.length === 11) {
      const ddd = cleanNumber.slice(0, 2);
      const numeroSem9 = cleanNumber.slice(3); // Remove o 9 do meio
      const numeroFinal = `55${ddd}${numeroSem9}`;
      return numeroFinal;
    }
    
    // Se tem 10 dígitos (DDD + número sem 9), adiciona 55 na frente
    if (cleanNumber.length === 10) {
      const numeroFinal = `55${cleanNumber}`;
      return numeroFinal;
    }
    
    // Se já tem 12 dígitos e começa com 55, pode estar no formato correto
    if (cleanNumber.length === 12 && cleanNumber.startsWith('55')) {
      return cleanNumber;
    }
    
    return cleanNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !matricula || !setor) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const numeroParaSalvar = formatWhatsAppForSave(whatsapp);

      const { error } = await supabase
        .from('funcionarios')
        .insert({
          nome,
          matricula: parseInt(matricula),
          setor,
          numero_whatsapp: numeroParaSalvar,
          cod_nfc: codNfc ? parseInt(codNfc) : null,
          posse_ferramentas: []
        });

      if (error) {
        console.error('Erro ao criar funcionário:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário criado com sucesso"
      });

      onFuncionarioAdicionado();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar funcionário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar funcionário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
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
          type="number"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Digite a matrícula"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="setor">Setor *</Label>
        <Select value={setor} onValueChange={handleSetorChange}>
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
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          value={whatsapp}
          onChange={handleWhatsChange}
          placeholder="(99)99999-9999"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="codNfc">Código NFC</Label>
        <Input
          id="codNfc"
          type="number"
          value={codNfc}
          onChange={(e) => setCodNfc(e.target.value)}
          placeholder="Digite o código NFC (opcional)"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Funcionário"}
        </Button>
      </div>
    </form>
  );
};
