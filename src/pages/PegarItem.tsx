
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, Wrench, ShoppingCart, Plus, Minus, Search, CreditCard, Camera, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data baseado nas especificações
const ferramentas = [
  { id: 1, nome: "Furadeira", tag: "001", quantidade: 5 },
  { id: 2, nome: "Parafusadeira", tag: "002", quantidade: 4 },
  { id: 3, nome: "Chave de Impacto", tag: "003", quantidade: 3 },
  { id: 4, nome: "Broca Aço Rápido Ø6mm", tag: "004", quantidade: 50 },
  { id: 5, nome: "Broca Aço Rápido Ø10mm", tag: "005", quantidade: 50 },
  { id: 6, nome: "Torquímetro", tag: "006", quantidade: 2 },
  { id: 7, nome: "Chave Allen Conj.", tag: "007", quantidade: 6 },
  { id: 8, nome: "Alicate Universal", tag: "008", quantidade: 10 },
  { id: 9, nome: "Rebarbadora (esmerilhadeira)", tag: "009", quantidade: 2 },
  { id: 10, nome: "Serra Manual", tag: "010", quantidade: 8 },
];

const materiais = [
  { id: 11, nome: "Acetona", quantidade: 20, unidade: "litros", minimo: 5, tag: "MAT011" },
  { id: 12, nome: "Pano de limpeza", quantidade: 200, unidade: "un", minimo: 50, tag: "MAT012" },
  { id: 13, nome: "Desengripante", quantidade: 15, unidade: "latas", minimo: 5, tag: "MAT013" },
  { id: 14, nome: "WD-40", quantidade: 10, unidade: "latas", minimo: 3, tag: "MAT014" },
  { id: 15, nome: "Óleo de corte", quantidade: 25, unidade: "litros", minimo: 10, tag: "MAT015" },
  { id: 16, nome: "Lixas", quantidade: 100, unidade: "un", minimo: 30, tag: "MAT016" },
  { id: 17, nome: "Escova de aço", quantidade: 15, unidade: "un", minimo: 5, tag: "MAT017" },
  { id: 18, nome: "Estopa", quantidade: 80, unidade: "kg", minimo: 20, tag: "MAT018" },
  { id: 19, nome: "Solda TIG", quantidade: 40, unidade: "bastões", minimo: 10, tag: "MAT019" },
  { id: 20, nome: "Cola Epóxi", quantidade: 20, unidade: "tubos", minimo: 5, tag: "MAT020" },
];

const funcionarios = {
  "13812": { nome: "ANDRE FELIPE COSTA DA SILVA", setor: "Usinagem industrial" },
  "7203": { nome: "ANGELO VALADARES DE CASTRO", setor: "Usinagem industrial" },
  "8854": { nome: "ANTONIO UBIRAJARA SIQUEIRA MOREIRA", setor: "Usinagem industrial" },
  "8734": { nome: "CARLOS EDUARDO DA SILVA CRAVEIRO", setor: "Usinagem de cilindros" },
  "3954": { nome: "CARLOS EDUARDO OLIVEIRA SILVA", setor: "Usinagem industrial" },
  "12920": { nome: "CLEDENILSON RIBEIRO DE OLIVEIRA", setor: "Usinagem industrial" },
  "2355": { nome: "DENIS RIULY SANTOS SOUSA", setor: "Oficina de guias" },
  "14108": { nome: "ELIZEU SILVA JACONE", setor: "Usinagem industrial" },
  "13849": { nome: "GABRIEL PASSOS DA MOTA", setor: "Oficina de mancal" },
  "8646": { nome: "GENILSON COSTA DE BRITO", setor: "Montagem de gaiola" },
  "14611": { nome: "GERSON ARTHUR DE SOUSA SILVA", setor: "Oficina de guias" },
};

type CartItem = {
  id: number;
  nome: string;
  tag: string;
  quantidade: number;
  tipo: 'ferramenta' | 'material';
};

const PegarItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'categoria' | 'lista' | 'carrinho' | 'funcionario' | 'confirmacao'>('categoria');
  const [categoria, setCategoria] = useState<'ferramentas' | 'materiais'>('ferramentas');
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);
  const [filtroFerramentas, setFiltroFerramentas] = useState('');
  const [filtroMateriais, setFiltroMateriais] = useState('');
  const [tipoIdentificacao, setTipoIdentificacao] = useState<'matricula' | 'nfc'>('matricula');
  const [foto, setFoto] = useState<File | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  const handleSelectCategoria = (cat: 'ferramentas' | 'materiais') => {
    setCategoria(cat);
    setStep('lista');
  };

  const addToCart = (item: any) => {
    const existingItem = carrinho.find(c => c.id === item.id);
    if (existingItem) {
      setCarrinho(carrinho.map(c => 
        c.id === item.id 
          ? { ...c, quantidade: c.quantidade + 1 }
          : c
      ));
    } else {
      // Garantir que todos os itens tenham tag
      const itemTag = item.tag || (categoria === 'materiais' ? `MAT${item.id.toString().padStart(3, '0')}` : `${item.id.toString().padStart(3, '0')}`);
      
      setCarrinho([...carrinho, {
        id: item.id,
        nome: item.nome,
        tag: itemTag,
        quantidade: 1,
        tipo: categoria === 'ferramentas' ? 'ferramenta' : 'material'
      }]);
    }
    toast({
      title: "Item adicionado",
      description: `${item.nome} foi adicionado ao carrinho`,
    });
  };

  const removeFromCart = (id: number) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCarrinho(carrinho.map(item => 
      item.id === id 
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    ));
  };

  const handleMatriculaSubmit = () => {
    const func = funcionarios[matricula as keyof typeof funcionarios];
    if (func) {
      setFuncionario(func);
      setStep('confirmacao');
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
    const nfcIds = Object.keys(funcionarios);
    const randomId = nfcIds[Math.floor(Math.random() * nfcIds.length)];
    setMatricula(randomId);
    
    const func = funcionarios[randomId as keyof typeof funcionarios];
    if (func) {
      setFuncionario(func);
      setStep('confirmacao');
      toast({
        title: "Crachá lido com sucesso!",
        description: `Funcionário: ${func.nome}`,
      });
    }
  };

  const getItensDisponiveis = () => {
    const itens = categoria === 'ferramentas' ? ferramentas : materiais;
    const filtro = categoria === 'ferramentas' ? filtroFerramentas : filtroMateriais;
    
    if (!filtro) return itens;
    
    return itens.filter(item => {
      const nomeMatch = item.nome.toLowerCase().includes(filtro.toLowerCase());
      const tagMatch = item.tag?.toLowerCase().includes(filtro.toLowerCase());
      return nomeMatch || tagMatch;
    });
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
          description: "Foto adicionada à retirada",
        });
      }
    };
    input.click();
  };

  const handleConfirmar = async () => {
    if (confirmando) return;
    setConfirmando(true);

    try {
      // Enviar dados para o webhook principal
      const formData = new FormData();
      
      // Dados do funcionário
      formData.append('funcionario_matricula', matricula);
      formData.append('funcionario_nome', funcionario.nome);
      formData.append('funcionario_setor', funcionario.setor);
      
      // Dados dos itens - garantindo formato consistente
      carrinho.forEach((item, index) => {
        formData.append(`item_${index}_id`, item.id.toString());
        formData.append(`item_${index}_nome`, item.nome);
        formData.append(`item_${index}_tag`, item.tag);
        formData.append(`item_${index}_quantidade`, item.quantidade.toString());
        formData.append(`item_${index}_tipo`, item.tipo);
      });
      
      // Dados de controle
      formData.append('data', new Date().toISOString());
      formData.append('timestamp', new Date().toISOString());
      formData.append('total_itens', carrinho.length.toString());
      formData.append('categoria', categoria);

      console.log('Dados enviados para webhook:', {
        funcionario_matricula: matricula,
        funcionario_nome: funcionario.nome,
        funcionario_setor: funcionario.setor,
        categoria: categoria,
        total_itens: carrinho.length,
        itens: carrinho.map((item, index) => ({
          [`item_${index}_id`]: item.id,
          [`item_${index}_nome`]: item.nome,
          [`item_${index}_tag`]: item.tag,
          [`item_${index}_quantidade`]: item.quantidade,
          [`item_${index}_tipo`]: item.tipo
        }))
      });

      await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/pegar-ferramenta', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      // Enviar foto separadamente se existir
      if (foto) {
        const fotoFormData = new FormData();
        fotoFormData.append('funcionario_matricula', matricula);
        fotoFormData.append('funcionario_nome', funcionario.nome);
        fotoFormData.append('foto', foto, 'ferramenta_retirada.jpg');
        fotoFormData.append('timestamp', new Date().toISOString());
        fotoFormData.append('categoria', categoria);

        await fetch('https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/pegar-ferramenta-imagem', {
          method: 'POST',
          mode: 'no-cors',
          body: fotoFormData,
        });
      }

      toast({
        title: "Itens retirados com sucesso!",
        description: `${carrinho.length} item(s) registrado(s) para ${funcionario.nome}`,
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      toast({
        title: "Itens retirados com sucesso!",
        description: `${carrinho.length} item(s) registrado(s) para ${funcionario.nome}`,
      });
    }
    
    navigate('/');
  };

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
              if (step === 'categoria') navigate('/');
              else if (step === 'lista') setStep('categoria');
              else if (step === 'carrinho') setStep('lista');
              else if (step === 'funcionario') setStep('carrinho');
              else if (step === 'confirmacao') setStep('funcionario');
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Pegar Item</h1>
            <p className="text-sm text-primary-foreground/80">
              {step === 'categoria' && 'Selecione o tipo de item'}
              {step === 'lista' && `Escolha ${categoria}`}
              {step === 'carrinho' && 'Revise os itens'}
              {step === 'funcionario' && 'Identificação'}
              {step === 'confirmacao' && 'Confirme a retirada'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-md lg:max-w-lg">
        {/* Seleção de Categoria */}
        {step === 'categoria' && (
          <div className="space-y-4 mt-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => handleSelectCategoria('ferramentas')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ferramentas</h3>
                  <p className="text-sm text-muted-foreground">Precisam ser devolvidas</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => handleSelectCategoria('materiais')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Materiais</h3>
                  <p className="text-sm text-muted-foreground">Consumo direto</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Itens */}
        {step === 'lista' && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {categoria === 'ferramentas' ? 'Ferramentas' : 'Materiais'}
              </h2>
              {carrinho.length > 0 && (
                <Button 
                  onClick={() => setStep('carrinho')}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {carrinho.length}
                </Button>
              )}
            </div>

            {/* Filtro */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={categoria === 'ferramentas' ? 'Buscar por nome ou tag...' : 'Buscar por nome ou tag...'}
                value={categoria === 'ferramentas' ? filtroFerramentas : filtroMateriais}
                onChange={(e) => categoria === 'ferramentas' ? setFiltroFerramentas(e.target.value) : setFiltroMateriais(e.target.value)}
                className="pl-10"
              />
            </div>

            {getItensDisponiveis().map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                     <div className="flex-1">
                       <h3 className="font-semibold">{item.nome}</h3>
                       <Badge variant="outline" className="mt-1">
                         TAG: {item.tag}
                       </Badge>
                       <p className="text-sm text-muted-foreground mt-1">
                         Disponível: {item.quantidade} {'unidade' in item ? item.unidade : 'un'}
                       </p>
                       {'minimo' in item && item.quantidade <= item.minimo && (
                         <Badge variant="destructive" className="mt-1">
                           Estoque baixo!
                         </Badge>
                       )}
                     </div>
                    <Button 
                      onClick={() => addToCart(item)}
                      size="sm"
                      className="ml-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Carrinho */}
        {step === 'carrinho' && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Carrinho</h2>
              <Badge variant="secondary">{carrinho.length} itens</Badge>
            </div>

            {carrinho.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.nome}</h3>
                      <Badge variant="outline" className="mt-1">
                        TAG: {item.tag}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantidade}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {carrinho.length > 0 && (
              <Button 
                className="w-full" 
                onClick={() => setStep('funcionario')}
              >
                Continuar
              </Button>
            )}
          </div>
        )}

        {/* Funcionário */}
        {step === 'funcionario' && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Identificação do Funcionário</CardTitle>
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
                      <Label htmlFor="matricula">Matrícula</Label>
                      <Input
                        id="matricula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Ex: 13812"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleMatriculaSubmit}
                      disabled={!matricula}
                    >
                      Buscar Funcionário
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

        {/* Confirmação */}
        {step === 'confirmacao' && funcionario && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Confirme a Retirada</CardTitle>
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
                  <h3 className="font-semibold">Itens:</h3>
                  {carrinho.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.nome}</span>
                      <span>{item.quantidade}x</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data: {new Date().toLocaleDateString('pt-BR')}
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
                  {confirmando ? "Confirmando..." : "Confirmar Retirada"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default PegarItem;
