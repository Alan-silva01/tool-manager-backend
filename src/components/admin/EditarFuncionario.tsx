
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatWhatsAppDisplay, normalizeWhatsAppToSave, validateWhatsAppFormat, convertBankToDisplay } from "@/utils/whatsappHelpers";
import type { Funcionario } from "@/types";

type SetorType = "" | "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central" | "Outro";

interface EditarFuncionarioProps {
  funcionario: Funcionario;
  onClose: () => void;
  onFuncionarioEditado: () => void;
}

export const EditarFuncionario = ({ funcionario, onClose, onFuncionarioEditado }: EditarFuncionarioProps) => {
  const [nome, setNome] = useState(funcionario.nome || "");
  const [matricula, setMatricula] = useState(funcionario.matricula?.toString() || "");
  const [setor, setSetor] = useState<SetorType>(funcionario.setor as SetorType || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [codNfc, setCodNfc] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Converter o número do banco para o formato de exibição
    const displayWhatsapp = convertBankToDisplay(funcionario.numero_whatsapp || "");
    setWhatsapp(displayWhatsapp);
  }, [funcionario.numero_whatsapp]);

  const handleWhatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsAppDisplay(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSetorChange = (value: string) => {
    setSetor(value as SetorType);
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

    // Validar WhatsApp se preenchido
    if (whatsapp && !validateWhatsAppFormat(whatsapp)) {
      toast({
        title: "Erro",
        description: "Número de WhatsApp deve ter o formato completo: (99)99999-9999",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const normalizedWhatsapp = normalizeWhatsAppToSave(whatsapp);
      
      console.log('Dados para atualizar:', {
        nome,
        matricula: parseInt(matricula),
        setor,
        numero_whatsapp: normalizedWhatsapp,
        cod_nfc: codNfc ? parseInt(codNfc) : null
      });

      const { error } = await supabase
        .from('funcionarios')
        .update({
          nome,
          matricula: parseInt(matricula),
          setor,
          numero_whatsapp: normalizedWhatsapp,
          cod_nfc: codNfc ? parseInt(codNfc) : null
        })
        .eq('id', funcionario.id);

      if (error) {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário atualizado com sucesso"
      });

      onFuncionarioEditado();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar funcionário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar funcionário",
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
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};
