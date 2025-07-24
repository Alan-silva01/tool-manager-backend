import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Package, CheckCircle, CreditCard, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const funcionarios = {
  "13812": { 
    nome: "ANDRE FELIPE COSTA DA SILVA", 
    setor: "Usinagem industrial",
    ferramentas: [
      { id: 1, nome: "Furadeira", tag: "001", dataRetirada: "2024-01-15" },
      { id: 6, nome: "Torquímetro", tag: "006", dataRetirada: "2024-01-14" },
    ]
  },
  "7203": { 
    nome: "ANGELO VALADARES DE CASTRO", 
    setor: "Usinagem industrial",
    ferramentas: [
      { id: 2, nome: "Parafusadeira", tag: "002", dataRetirada: "2024-01-16" },
    ]
  },
  "8854": { 
    nome: "ANTONIO UBIRAJARA SIQUEIRA MOREIRA", 
    setor: "Usinagem industrial",
    ferramentas: [
      { id: 3, nome: "Chave de Impacto", tag: "003", dataRetirada: "2024-01-10" },
      { id: 8, nome: "Alicate Universal", tag: "008", dataRetirada: "2024-01-12" },
    ]
  },
  "7679": { 
    nome: "JOTUANDERSON PEREIRA GOMES", 
    setor: "Oficina cantilever",
    ferramentas: []
  }
};

const DevolverItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'matricula' | 'ferramentas' | 'confirmacao'>('matricula');
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);
  const [selectedFerramentas, setSelectedFerramentas] = useState<number[]>([]);
  const [tipoIdentificacao, setTipoIdentificacao] = useState<'matricula' | 'nfc'>('matricula');
  const [foto, setFoto] = useState<File | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  const handleMatriculaSubmit = () => {
    const func = funcionarios[matricula as keyof typeof funcionarios];
    if (func) {
      if (func.ferramentas.length === 0) {
        toast({
          title: "Nenhuma ferramenta em posse",
          description: "Este funcionário não possui ferramentas para devolver",
        });
        return;
      }
      setFuncionario(func);
      setStep('ferramentas');
    } else {
      toast({
        title: "Matrícula não encontrada",
        description: "Verifique a matrícula digitada",
        variant: "destructive",
      });
    }
  };

  const handleNFCScan = () => {
    // Simular leitura de NFC - em produção seria integrado com API de NFC
    const nfcIds = ['13812', '7203', '8854'];
    const randomId = nfcIds[Math.floor(Math.random() * nfcIds.length)];
    setMatricula(randomId);
    
    const func = funcionarios[randomId as keyof typeof funcionarios];
    if (func) {
      if (func.ferramentas.length === 0) {
        toast({
          title: "Nenhuma ferramenta em posse",
          description: "Este funcionário não possui ferramentas para devolver",
        });
        return;
      }
      setFuncionario(func);
      setStep('ferramentas');
      toast({
        title: "Crachá lido com sucesso!",
        description: `Funcionário: ${func.nome}`,
      });
    }
  };

  const handleFerramentaToggle = (ferramentaId: number) => {
    setSelectedFerramentas(prev => 
      prev.includes(ferramentaId)
        ? prev.filter(id => id !== ferramentaId)
        : [...prev, ferramentaId]
    );
  };

  const handleTirarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFoto(file);
        toast({
          title: "Foto capturada!",
          description: "Foto adicionada à devolução",
        });
      }
    };
    input.click();
  };

  const handleConfirmar = async () => {
    if (selectedFerramentas.length === 0) {
      toast({
        title: "Selecione ao menos uma ferramenta",
        description: "Marque as ferramentas que deseja devolver",
        variant: "destructive",
      });
      return;
    }

    if (confirmando) return;
    setConfirmando(true);

    try {
      // Enviar dados para o webhook principal
      const formData = new FormData();
      
      // Dados do funcionário
      formData.append('funcionario_matricula', matricula);
      formData.append('funcionario_nome', funcionario.nome);
      formData.append('funcionario_setor', funcionario.setor);
      
      // Dados das ferramentas
      ferramentasSelecionadas.forEach((ferramenta, index) => {
        formData.append(`ferramenta_${index}_id`, ferramenta.id.toString());
        formData.append(`ferramenta_${index}_nome`, ferramenta.nome);
        formData.append(`ferramenta_${index}_tag`, ferramenta.tag);
        formData.append(`ferramenta_${index}_dataRetirada`, ferramenta.dataRetirada);
      });
      
      // Dados de controle
      formData.append('data', new Date().toISOString());
      formData.append('timestamp', new Date().toISOString());
      formData.append('total_ferramentas', ferramentasSelecionadas.length.toString());

      await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/devolver-ferramenta', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      // Enviar foto separadamente se existir
      if (foto) {
        const fotoFormData = new FormData();
        fotoFormData.append('funcionario_matricula', matricula);
        fotoFormData.append('funcionario_nome', funcionario.nome);
        fotoFormData.append('foto', foto, 'ferramenta_devolucao.jpg');
        fotoFormData.append('timestamp', new Date().toISOString());

        await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/devolver-ferramenta-imagem', {
          method: 'POST',
          mode: 'no-cors',
          body: fotoFormData,
        });
      }

      toast({
        title: "Ferramentas devolvidas com sucesso!",
        description: `${selectedFerramentas.length} ferramenta(s) retornada(s) ao estoque`,
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      toast({
        title: "Ferramentas devolvidas com sucesso!",
        description: `${selectedFerramentas.length} ferramenta(s) retornada(s) ao estoque`,
      });
    }
    
    navigate('/');
  };

  const ferramentasSelecionadas = funcionario?.ferramentas.filter(
    (f: any) => selectedFerramentas.includes(f.id)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => {
              if (step === 'matricula') navigate('/');
              else if (step === 'ferramentas') setStep('matricula');
              else if (step === 'confirmacao') setStep('ferramentas');
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Devolver Item</h1>
            <p className="text-sm text-primary-foreground/80">
              {step === 'matricula' && 'Digite sua matrícula'}
              {step === 'ferramentas' && 'Selecione as ferramentas'}
              {step === 'confirmacao' && 'Confirme a devolução'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-md lg:max-w-lg">
        {/* Identificação do Funcionário */}
        {step === 'matricula' && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={tipoIdentificacao === 'matricula' ? 'default' : 'outline'}
                    onClick={() => setTipoIdentificacao('matricula')}
                    className="flex-1"
                  >
                    Matrícula
                  </Button>
                  <Button
                    variant={tipoIdentificacao === 'nfc' ? 'default' : 'outline'}
                    onClick={() => setTipoIdentificacao('nfc')}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    NFC
                  </Button>
                </div>

                {tipoIdentificacao === 'matricula' ? (
                  <>
                    <div>
                      <Label htmlFor="matricula">Sua Matrícula</Label>
                      <Input
                        id="matricula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Ex: 13812"
                        className="text-center text-lg"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleMatriculaSubmit}
                      disabled={!matricula}
                    >
                      Buscar Ferramentas
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Aproxime seu crachá do leitor NFC</p>
                    <Button 
                      className="w-full" 
                      onClick={handleNFCScan}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Escanear Crachá
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Ferramentas */}
        {step === 'ferramentas' && funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Ferramentas</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <p>{funcionario.nome}</p>
                  <p>{funcionario.setor}</p>
                </div>
              </CardHeader>
            </Card>

            {funcionario.ferramentas.map((ferramenta: any) => (
              <Card key={ferramenta.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`ferramenta-${ferramenta.id}`}
                      checked={selectedFerramentas.includes(ferramenta.id)}
                      onCheckedChange={() => handleFerramentaToggle(ferramenta.id)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`ferramenta-${ferramenta.id}`}
                        className="cursor-pointer"
                      >
                        <h3 className="font-semibold">{ferramenta.nome}</h3>
                        <Badge variant="outline" className="mt-1">
                          TAG: {ferramenta.tag}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Retirada em: {new Date(ferramenta.dataRetirada).toLocaleDateString('pt-BR')}
                        </p>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedFerramentas.length > 0 && (
              <Button 
                className="w-full" 
                onClick={() => setStep('confirmacao')}
              >
                Devolver {selectedFerramentas.length} ferramenta(s)
              </Button>
            )}
          </div>
        )}

        {/* Confirmação */}
        {step === 'confirmacao' && funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Confirme a Devolução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Funcionário:</h3>
                  <p>{funcionario.nome}</p>
                  <p className="text-sm text-muted-foreground">{funcionario.setor}</p>
                  <p className="text-sm text-muted-foreground">
                    Matrícula: {matricula}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Ferramentas a devolver:</h3>
                  {ferramentasSelecionadas.map((ferramenta: any) => (
                    <div key={ferramenta.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{ferramenta.nome}</span>
                        <Badge variant="outline" className="ml-2">
                          {ferramenta.tag}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data da devolução: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hora: {new Date().toLocaleTimeString('pt-BR')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Foto da ferramenta:</h4>
                    {foto ? (
                      <div className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Foto capturada ({foto.name})
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={handleTirarFoto}
                        className="w-full"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Tirar Foto da Ferramenta
                      </Button>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleConfirmar}
                  disabled={confirmando}
                >
                  {confirmando ? "Confirmando..." : "Confirmar Devolução"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default DevolverItem;
