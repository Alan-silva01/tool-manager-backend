import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatWhatsAppForDisplay, applyWhatsAppMask, removeWhatsAppFormatting } from "@/utils/whatsappFormatter";
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
  const [codNfc, setCodNfc] = useState(funcionario.cod_nfc?.toString() || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Converte o número do banco (559991372552) para o formato de exibição (99)99137-2552
    if (funcionario.numero_whatsapp) {
      const displayFormat = formatWhatsAppForDisplay(funcionario.numero_whatsapp);
      setWhatsapp(displayFormat);
    }
  }, [funcionario.numero_whatsapp]);

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
    console.log('Número limpo:', cleanNumber);
    
    // Se tem 11 dígitos (DDD + 9 + número), remove o 9 extra
    if (cleanNumber.length === 11) {
      const ddd = cleanNumber.slice(0, 2);
      const numeroSem9 = cleanNumber.slice(3); // Remove o 9 do meio
      const numeroFinal = `55${ddd}${numeroSem9}`;
      console.log('Número formatado para salvar (11 dígitos):', numeroFinal);
      return numeroFinal;
    }
    
    // Se tem 10 dígitos (DDD + número sem 9), adiciona 55 na frente
    if (cleanNumber.length === 10) {
      const numeroFinal = `55${cleanNumber}`;
      console.log('Número formatado para salvar (10 dígitos):', numeroFinal);
      return numeroFinal;
    }
    
    // Se já tem 12 dígitos e começa com 55, pode estar no formato correto
    if (cleanNumber.length === 12 && cleanNumber.startsWith('55')) {
      console.log('Número já no formato correto:', cleanNumber);
      return cleanNumber;
    }
    
    console.log('Formato não reconhecido, retornando como está:', cleanNumber);
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
      
      console.log('Dados para atualizar:', {
        nome,
        matricula: parseInt(matricula),
        setor,
        numero_whatsapp: numeroParaSalvar,
        cod_nfc: codNfc ? parseInt(codNfc) : null
      });

      const { error } = await supabase
        .from('funcionarios')
        .update({
          nome,
          matricula: parseInt(matricula),
          setor,
          numero_whatsapp: numeroParaSalvar,
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
