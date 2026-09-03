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
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { apiRequestFormData } from "@/lib/api";

const DevolverItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { buscarFuncionario } = useFuncionarios();
  const { ferramentas } = useFerramentas();
  
  const [step, setStep] = useState<'matricula' | 'ferramentas' | 'fotos' | 'confirmacao'>('matricula');
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);
  const [funcionarioFerramentas, setFuncionarioFerramentas] = useState<any[]>([]);
  const [selectedFerramentas, setSelectedFerramentas] = useState<string[]>([]);
  const [tipoIdentificacao, setTipoIdentificacao] = useState<'matricula' | 'nfc'>('matricula');
  const [fotosFerramentas, setFotosFerramentas] = useState<Record<string, File>>({});
  const [confirmando, setConfirmando] = useState(false);

  const handleMatriculaSubmit = async () => {
    try {
      const { data, error } = await supabase
        .rpc('validate_employee', { p_matricula: Number(matricula.trim()) });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const func = data[0];
        
        const ferramentasDoFuncionario = [];
        
        if (func.posse_ferramentas && Array.isArray(func.posse_ferramentas)) {
          func.posse_ferramentas.forEach((tag: string) => {
            const ferramenta = ferramentas.find(f => f.tag === tag);
            if (ferramenta) {
              ferramentasDoFuncionario.push({
                id: ferramenta.id,
                nome: ferramenta.nome,
                tag: ferramenta.tag,
                categoria: ferramenta.categoria,
                dataRetirada: new Date().toISOString()
              });
            }
          });
        }
        
        if (ferramentasDoFuncionario.length === 0) {
          toast({
            title: "Nenhuma ferramenta em posse",
            description: "Este funcionário não possui ferramentas para devolver",
          });
          return;
        }
        
        setFuncionario({
          ...func,
          matricula: matricula.trim()
        });
        setFuncionarioFerramentas(ferramentasDoFuncionario);
        setStep('ferramentas');
      } else {
        toast({
          title: "Matrícula não encontrada",
          description: "Verifique a matrícula digitada",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      toast({
        title: "Erro ao buscar funcionário",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleNFCScan = async () => {
    const nfcMatriculas = ['13812', '7203', '8854', '7679'];
    const randomMatricula = nfcMatriculas[Math.floor(Math.random() * nfcMatriculas.length)];
    setMatricula(randomMatricula);
    
    try {
      const { data, error } = await supabase
        .rpc('validate_employee', { p_matricula: Number(randomMatricula) });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const func = data[0];
        const ferramentasDoFuncionario = [];
        
        if (func.posse_ferramentas && Array.isArray(func.posse_ferramentas)) {
          func.posse_ferramentas.forEach((tag: string) => {
            const ferramenta = ferramentas.find(f => f.tag === tag);
            if (ferramenta) {
              ferramentasDoFuncionario.push({
                id: ferramenta.id,
                nome: ferramenta.nome,
                tag: ferramenta.tag,
                categoria: ferramenta.categoria,
                dataRetirada: new Date().toISOString()
              });
            }
          });
        }
        
        if (ferramentasDoFuncionario.length === 0) {
          toast({
            title: "Nenhuma ferramenta em posse",
            description: "Este funcionário não possui ferramentas para devolver",
          });
          return;
        }
        
        setFuncionario({
          ...func,
          matricula: randomMatricula
        });
        setFuncionarioFerramentas(ferramentasDoFuncionario);
        setStep('ferramentas');
      } else {
        toast({
          title: "Funcionário não encontrado",
          description: "Não foi possível identificar o funcionário",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na leitura NFC:', error);
      toast({
        title: "Erro na leitura NFC",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleFerramentaToggle = (ferramentaTag: string) => {
    setSelectedFerramentas(prev => 
      prev.includes(ferramentaTag)
        ? prev.filter(tag => tag !== ferramentaTag)
        : [...prev, ferramentaTag]
    );
  };

  const handleTirarFotoFerramenta = (ferramentaId: string, ferramentaNome: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newFile = new File([file], `${ferramentaNome.replace(/[^a-zA-Z0-9]/g, '_')}_devolucao_${Date.now()}.jpg`, {
          type: file.type,
        });
        
        setFotosFerramentas(prev => ({
          ...prev,
          [ferramentaId]: newFile
        }));
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

    // Verificar se todas as ferramentas selecionadas têm foto
    const ferramentasSelecionadas = funcionarioFerramentas.filter(f => selectedFerramentas.includes(f.tag));
    const ferramentasSemFoto = ferramentasSelecionadas.filter(f => !fotosFerramentas[f.id]);
    
    if (ferramentasSemFoto.length > 0) {
      toast({
        title: "Fotos obrigatórias",
        description: `É necessário fotografar todas as ferramentas. Faltam: ${ferramentasSemFoto.map(f => f.nome).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (confirmando) return;
    setConfirmando(true);

    try {
      // 1. Atualizar banco Supabase diretamente
      const matNum = parseInt(matricula.trim());

      for (const ferramenta of ferramentasSelecionadas) {
        // Marca a ferramenta como devolvida (disponível, saiu=0, limpa funcionario)
        await supabase
          .from('ferramentas')
          .update({
            saiu: 0,
            funcionario_emprestado: null,
            matricula: null,
            data_emprestado: null,
            status: 'disponível'
          })
          .eq('id', ferramenta.id);
      }

      // Remove as ferramentas da posse_ferramentas do colaborador
      const tagsDevolvidas = ferramentasSelecionadas.map(f => f.tag);
      const { data: funcData } = await supabase
        .from('funcionarios')
        .select('posse_ferramentas')
        .eq('matricula', matNum)
        .single();

      if (funcData?.posse_ferramentas) {
        let posseAtual: string[] = Array.isArray(funcData.posse_ferramentas)
          ? funcData.posse_ferramentas
          : JSON.parse(String(funcData.posse_ferramentas) || '[]');

        const novaPosse = posseAtual.filter(tag => !tagsDevolvidas.includes(tag));
        await supabase
          .from('funcionarios')
          .update({ posse_ferramentas: novaPosse })
          .eq('matricula', matNum);
      }

      // Enviar notificação e foto de devolução para o Backend do WhatsApp
      for (const ferramenta of ferramentasSelecionadas) {
        const foto = fotosFerramentas[ferramenta.id];
        const formDataFoto = new FormData();
        formDataFoto.append('funcionario', funcionario.nome);
        formDataFoto.append('matricula', matricula);
        formDataFoto.append('item_nome', ferramenta.nome);
        formDataFoto.append('item_tipo', 'ferramenta');
        if (foto) {
          formDataFoto.append('foto', foto, foto.name);
        }

        apiRequestFormData('/api/notificar/devolucao-form', formDataFoto)
          .catch(err => console.error('Erro ao enviar devolução ao WhatsApp:', err));
      }

      toast({
        title: "Ferramentas devolvidas com sucesso!",
        description: `${selectedFerramentas.length} ferramenta(s) retornada(s) ao estoque`,
      });
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao processar devolução:', error);
      toast({
        title: "Erro ao processar devolução",
        description: error?.message || "Ocorreu um erro ao devolver as ferramentas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setConfirmando(false);
    }
  };

  const ferramentasSelecionadas = funcionarioFerramentas.filter(f => selectedFerramentas.includes(f.tag));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                if (step === 'matricula') navigate('/');
                else if (step === 'ferramentas') setStep('matricula');
                else if (step === 'fotos') setStep('ferramentas');
                else if (step === 'confirmacao') setStep('fotos');
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Devolver Item</h1>
              <p className="text-sm text-primary-foreground/80">
                {step === 'matricula' && 'Digite sua matrícula'}
                {step === 'ferramentas' && 'Selecione as ferramentas'}
                {step === 'fotos' && 'Fotografe as ferramentas'}
                {step === 'confirmacao' && 'Confirme a devolução'}
              </p>
            </div>
          </div>
          <ThemeToggle />
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
                        placeholder="Digite sua matrícula"
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
                  <p><strong>{funcionario.nome}</strong></p>
                  <p>{funcionario.setor}</p>
                  <p className="text-xs">Matrícula: {matricula}</p>
                </div>
              </CardHeader>
            </Card>

            {funcionarioFerramentas.length > 0 ? (
              <>
                {funcionarioFerramentas.map((ferramenta) => (
                  <Card key={ferramenta.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`ferramenta-${ferramenta.id}`}
                          checked={selectedFerramentas.includes(ferramenta.tag)}
                          onCheckedChange={() => handleFerramentaToggle(ferramenta.tag)}
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
                            {ferramenta.categoria && (
                              <Badge variant="secondary" className="mt-1 ml-2">
                                {ferramenta.categoria}
                              </Badge>
                            )}
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedFerramentas.length > 0 && (
                  <Button 
                    className="w-full" 
                    onClick={() => setStep('fotos')}
                  >
                    Fotografar {selectedFerramentas.length} ferramenta(s)
                  </Button>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground">Nenhuma ferramenta encontrada em posse deste funcionário.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Nova etapa: Fotografar ferramentas */}
        {step === 'fotos' && funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fotografe as Ferramentas</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <p><strong>{funcionario.nome}</strong></p>
                  <p>{funcionario.setor} - Matrícula: {matricula}</p>
                  <p className="text-xs mt-1">É obrigatório fotografar cada ferramenta antes da devolução</p>
                </div>
              </CardHeader>
            </Card>

            {ferramentasSelecionadas.map((ferramenta) => {
              const temFoto = fotosFerramentas[ferramenta.id];
              
              return (
                <Card key={ferramenta.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{ferramenta.nome}</h3>
                        <Badge variant="outline" className="mt-1">
                          TAG: {ferramenta.tag}
                        </Badge>
                        {ferramenta.categoria && (
                          <Badge variant="secondary" className="mt-1 ml-2">
                            {ferramenta.categoria}
                          </Badge>
                        )}
                      </div>

                      {temFoto ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Foto capturada ({temFoto.name})</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleTirarFotoFerramenta(ferramenta.id, ferramenta.nome)}
                          className="w-full"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Tirar Foto do {ferramenta.nome}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={() => setStep('confirmacao')}
                disabled={ferramentasSelecionadas.some(f => !fotosFerramentas[f.id])}
              >
                {ferramentasSelecionadas.every(f => fotosFerramentas[f.id]) 
                  ? 'Continuar para Confirmação' 
                  : `Faltam ${ferramentasSelecionadas.filter(f => !fotosFerramentas[f.id]).length} foto(s)`
                }
              </Button>
            </div>
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
                  {ferramentasSelecionadas.map((ferramenta) => {
                    const temFoto = fotosFerramentas[ferramenta.id];
                    
                    return (
                      <div key={ferramenta.id} className="flex justify-between items-center py-2 border-b">
                        <div className="flex-1">
                          <span className="font-medium">{ferramenta.nome}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              TAG: {ferramenta.tag}
                            </Badge>
                            {temFoto && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs">Foto OK</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Data da devolução: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hora: {new Date().toLocaleTimeString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total de fotos: {Object.keys(fotosFerramentas).length}
                  </p>
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
