
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
  categoria: string;
  descricao: string;
  unidade: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
}

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  categoria: string;
  disponivel: boolean;
  caracteristicas: {
    cor?: string;
    tensao?: string;
    peso?: string;
    marca?: string;
    modelo?: string;
    observacoes?: string;
  };
}

interface Funcionario {
  id?: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
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

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => void;
}

const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const { toast } = useToast();
  const [novoFuncionario, setNovoFuncionario] = useState<Funcionario>({
    nome: '',
    matricula: 0,
    setor: '',
    numero_whatsapp: ''
  });
  const [setorCustomizado, setSetorCustomizado] = useState('');
  const [novaFerramenta, setNovaFerramenta] = useState({
    nome: '',
    tag: '',
    categoria: '',
    quantidade: 0,
    caracteristicas: {
      cor: '',
      tensao: '',
      peso: '',
      marca: '',
      modelo: '',
      observacoes: ''
    }
  });

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

      // Verificar se o setor é válido ou customizado
      const setorParaInserir = setoresPredefinidos.includes(setorFinal as SetorType) 
        ? setorFinal as SetorType
        : setorFinal;

      const { error } = await supabase
        .from('funcionarios')
        .insert([{
          nome: novoFuncionario.nome.toUpperCase(),
          matricula: novoFuncionario.matricula,
          setor: setorParaInserir,
          numero_whatsapp: novoFuncionario.numero_whatsapp || null,
          posse_ferramentas: []
        }]);

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

    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar funcionário",
        variant: "destructive",
      });
    }
  };

  const handleSubmitFerramenta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaFerramenta.nome || !novaFerramenta.tag || !novaFerramenta.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar se a tag já existe
      const { data: existingFerramenta } = await supabase
        .from('ferramentas')
        .select('id')
        .eq('tag', novaFerramenta.tag)
        .single();

      if (existingFerramenta) {
        toast({
          title: "Erro",
          description: "Já existe uma ferramenta com esta tag",
          variant: "destructive",
        });
        return;
      }

      // Formatar características para JSONB
      const caracteristicasFormatadas = Object.entries(novaFerramenta.caracteristicas)
        .filter(([_, value]) => value.trim() !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

      const { error } = await supabase
        .from('ferramentas')
        .insert([{
          nome: novaFerramenta.nome.toUpperCase(),
          tag: novaFerramenta.tag,
          categoria: novaFerramenta.categoria,
          quantidade: novaFerramenta.quantidade,
          saiu: 0,
          caracteristicas: caracteristicasFormatadas,
          status: 'disponivel'
        }]);

      if (error) {
        console.error('Erro ao cadastrar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ferramenta cadastrada!",
        description: "Ferramenta foi cadastrada com sucesso",
      });

      // Limpar formulário
      setNovaFerramenta({
        nome: '',
        tag: '',
        categoria: '',
        quantidade: 0,
        caracteristicas: {
          cor: '',
          tensao: '',
          peso: '',
          marca: '',
          modelo: '',
          observacoes: ''
        }
      });

      // Atualizar dados
      onRefresh();

    } catch (error) {
      console.error('Erro ao cadastrar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar ferramenta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Cadastrar Funcionário */}
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

      {/* Cadastrar Ferramenta */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Ferramenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFerramenta} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeFerramenta">Nome</Label>
                <Input
                  id="nomeFerramenta"
                  value={novaFerramenta.nome}
                  onChange={(e) => setNovaFerramenta({...novaFerramenta, nome: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tagFerramenta">Tag</Label>
                <Input
                  id="tagFerramenta"
                  value={novaFerramenta.tag}
                  onChange={(e) => setNovaFerramenta({...novaFerramenta, tag: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoriaFerramenta">Categoria</Label>
                <Input
                  id="categoriaFerramenta"
                  value={novaFerramenta.categoria}
                  onChange={(e) => setNovaFerramenta({...novaFerramenta, categoria: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantidadeFerramenta">Quantidade</Label>
                <Input
                  id="quantidadeFerramenta"
                  type="number"
                  value={novaFerramenta.quantidade}
                  onChange={(e) => setNovaFerramenta({...novaFerramenta, quantidade: parseInt(e.target.value) || 0})}
                  required
                />
              </div>
            </div>

            {/* Características */}
            <div>
              <Label className="text-sm font-medium">Características (opcional)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    value={novaFerramenta.caracteristicas.cor}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, cor: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="tensao">Tensão</Label>
                  <Input
                    id="tensao"
                    value={novaFerramenta.caracteristicas.tensao}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, tensao: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="peso">Peso</Label>
                  <Input
                    id="peso"
                    value={novaFerramenta.caracteristicas.peso}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, peso: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={novaFerramenta.caracteristicas.marca}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, marca: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={novaFerramenta.caracteristicas.modelo}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, modelo: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={novaFerramenta.caracteristicas.observacoes}
                    onChange={(e) => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: {...novaFerramenta.caracteristicas, observacoes: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Cadastrar Ferramenta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueManager;
