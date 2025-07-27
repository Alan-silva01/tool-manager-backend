
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface Material {
  id: string;
  nome: string;
  tag: string;
  entrada: number;
  quantidade_minima: number;
  data_entrada_estoque: string;
  saida: number;
  unidade: string;
}

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
}

interface Funcionario {
  id?: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
}

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => Promise<void>;
}

type SetorType = 
  | "Usinagem industrial"
  | "Oficina cantilever" 
  | "Oficina de guias"
  | "Montagem de gaiola"
  | "Oficina de mancal"
  | "Usinagem de cilindros"
  | "Oficina central";

const setoresPredefinidos: SetorType[] = [
  "Usinagem industrial",
  "Oficina cantilever",
  "Oficina de guias", 
  "Montagem de gaiola",
  "Oficina de mancal",
  "Usinagem de cilindros",
  "Oficina central"
];

const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const { toast } = useToast();
  const [novoFuncionario, setNovoFuncionario] = useState<Funcionario>({
    nome: '',
    matricula: 0,
    setor: '',
    numero_whatsapp: ''
  });
  const [setorCustomizado, setSetorCustomizado] = useState('');

  const handleSubmitFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoFuncionario.nome || !novoFuncionario.matricula || !novoFuncionario.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar se a matrícula já existe
      const { data: existingFuncionario } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('matricula', novoFuncionario.matricula)
        .single();

      if (existingFuncionario) {
        toast({
          title: "Erro",
          description: "Já existe um funcionário com esta matrícula",
          variant: "destructive",
        });
        return;
      }

      // Determinar o setor final
      let setorFinal: string;
      if (novoFuncionario.setor === 'outro') {
        setorFinal = setorCustomizado;
      } else {
        setorFinal = novoFuncionario.setor;
      }

      const { error } = await supabase
        .from('funcionarios')
        .insert({
          nome: novoFuncionario.nome.toUpperCase(),
          matricula: novoFuncionario.matricula,
          setor: setorFinal,
          numero_whatsapp: novoFuncionario.numero_whatsapp || null,
          posse_ferramentas: []
        });

      if (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar funcionário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Funcionário cadastrado!",
        description: "Funcionário foi cadastrado com sucesso",
      });

      // Limpar formulário
      setNovoFuncionario({
        nome: '',
        matricula: 0,
        setor: '',
        numero_whatsapp: ''
      });
      setSetorCustomizado('');

      // Refresh data
      await onRefresh();

    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar funcionário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFuncionario} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novoFuncionario.nome}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  type="number"
                  value={novoFuncionario.matricula || ''}
                  onChange={(e) => setNovoFuncionario({...novoFuncionario, matricula: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="setor">Setor</Label>
              <Select 
                value={novoFuncionario.setor} 
                onValueChange={(value) => {
                  setNovoFuncionario({...novoFuncionario, setor: value});
                  if (value !== 'outro') {
                    setSetorCustomizado('');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {setoresPredefinidos.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      {setor}
                    </SelectItem>
                  ))}
                  <SelectItem value="outro">Outro (digitar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {novoFuncionario.setor === 'outro' && (
              <div>
                <Label htmlFor="setorCustomizado">Digite o setor</Label>
                <Input
                  id="setorCustomizado"
                  value={setorCustomizado}
                  onChange={(e) => setSetorCustomizado(e.target.value)}
                  placeholder="Digite o nome do setor"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                value={novoFuncionario.numero_whatsapp}
                onChange={(e) => setNovoFuncionario({...novoFuncionario, numero_whatsapp: e.target.value})}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>

            <Button type="submit" className="w-full">
              Cadastrar Funcionário
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueManager;
