import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Search, Package, Wrench, Users, Shield, PackagePlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  categoria: string;
  quantidade: number;
  tag: string;
  caracteristicas: any;
  saiu: number;
  reserva?: boolean;
  matricula_reserva?: string;
}

interface Funcionario {
  id: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: string[];
}

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => void;
}

type SetorType = "Usinagem industrial" | "Oficina cantilever" | "Oficina de guias" | "Montagem de gaiola" | "Oficina de mancal" | "Usinagem de cilindros" | "Oficina central";

export const EstoqueManager = ({
  materiais,
  ferramentas,
  onRefresh
}: EstoqueManagerProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingFuncionario, setIsAddingFuncionario] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
  const [currentTab, setCurrentTab] = useState("materiais");

  // Estados para novo material
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    tag: "",
    entrada: "",
    quantidade_minima: "",
    unidade: "un"
  });

  // Estados para novo funcionário
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    matricula: "",
    setor: "",
    numero_whatsapp: ""
  });

  // Estados para reserva
  const [reservandoFerramenta, setReservandoFerramenta] = useState<Ferramenta | null>(null);
  const [matriculaReserva, setMatriculaReserva] = useState("");
  const [isProcessingReserva, setIsProcessingReserva] = useState(false);
  const [dialogReservaOpen, setDialogReservaOpen] = useState(false);

  // Estados para adicionar entrada de material
  const [materialParaEntrada, setMaterialParaEntrada] = useState<Material | null>(null);
  const [quantidadeEntrada, setQuantidadeEntrada] = useState("");
  const [isAddingEntrada, setIsAddingEntrada] = useState(false);
  const [dialogEntradaOpen, setDialogEntradaOpen] = useState(false);

  // Estados para controlar abertura dos diálogos de edição
  const [editMaterialDialogOpen, setEditMaterialDialogOpen] = useState(false);
  const [editFerramentaDialogOpen, setEditFerramentaDialogOpen] = useState(false);
  const [editFuncionarioDialogOpen, setEditFuncionarioDialogOpen] = useState(false);

  const setores: SetorType[] = ["Usinagem industrial", "Oficina cantilever", "Oficina de guias", "Montagem de gaiola", "Oficina de mancal", "Usinagem de cilindros", "Oficina central"];

  // Carregar funcionários sempre que o componente for montado ou quando mudar para a aba funcionários
  useEffect(() => {
    if (currentTab === "funcionarios") {
      fetchFuncionarios();
    }
  }, [currentTab]);

  // Carregar funcionários na inicialização
  useEffect(() => {
    fetchFuncionarios();
  }, []);

  // Função para formatar data no formato dd-mm-aaaa
  const formatarDataParaBanco = (data: Date) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  };

  // Carregar funcionários
  const fetchFuncionarios = async () => {
    setLoadingFuncionarios(true);
    try {
      console.log('Buscando funcionários na aba...');
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome');

      console.log('Resposta do Supabase funcionários (EstoqueManager):', { data, error });

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os funcionários",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        const funcionariosFormatados = data.map(func => ({
          id: func.id,
          nome: func.nome || '',
          matricula: func.matricula || 0,
          setor: func.setor || '',
          numero_whatsapp: func.numero_whatsapp || '',
          posse_ferramentas: Array.isArray(func.posse_ferramentas) 
            ? func.posse_ferramentas.filter((item: any): item is string => typeof item === 'string') 
            : []
        }));
        
        // Ordenar por nome alfabeticamente
        funcionariosFormatados.sort((a, b) => a.nome.localeCompare(b.nome));
        
        console.log('Funcionários formatados:', funcionariosFormatados);
        setFuncionarios(funcionariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao carregar funcionários",
        variant: "destructive"
      });
    } finally {
      setLoadingFuncionarios(false);
    }
  };

  const formatarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatarCaracteristicas = (texto: string) => {
    if (!texto.trim()) return null;
    
    try {
      // Tentar fazer parse direto se já for JSON válido
      const parsed = JSON.parse(texto);
      return parsed;
    } catch {
      // Se não for JSON, tentar converter texto para JSON
      const linhas = texto.split('\n').filter(linha => linha.trim());
      
      if (linhas.length === 0) return null;
      
      const caracteristicasObj: any = {};
      
      linhas.forEach(linha => {
        const [chave, ...valorParts] = linha.split(':');
        if (chave && valorParts.length > 0) {
          const valor = valorParts.join(':').trim();
          
          // Tentar converter valores para tipos apropriados
          let valorConvertido: any = valor;
          
          // Se for número
          if (!isNaN(Number(valor)) && valor !== '') {
            valorConvertido = Number(valor);
          }
          // Se for boolean
          else if (valor.toLowerCase() === 'true') {
            valorConvertido = true;
          }
          else if (valor.toLowerCase() === 'false') {
            valorConvertido = false;
          }
          // Se for objeto aninhado (básico)
          else if (valor.includes('{') || valor.includes('[')) {
            try {
              valorConvertido = JSON.parse(valor);
            } catch {
              // Manter como string se não conseguir fazer parse
            }
          }
          
          caracteristicasObj[chave.trim()] = valorConvertido;
        }
      });
      
      return Object.keys(caracteristicasObj).length > 0 ? caracteristicasObj : null;
    }
  };

  // Função para excluir material
  const handleDeleteMaterial = async (material: Material) => {
    try {
      const { error } = await supabase
        .from('materiais')
        .delete()
        .eq('id', material.id);

      if (error) {
        console.error('Erro ao excluir material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o material",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Material excluído",
        description: `${material.nome} foi excluído com sucesso`
      });

      onRefresh(); // Atualizar lista
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao excluir material",
        variant: "destructive"
      });
    }
  };

  // Função para excluir funcionário
  const handleDeleteFuncionario = async (funcionario: Funcionario) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', funcionario.id);

      if (error) {
        console.error('Erro ao excluir funcionário:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o funcionário",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Funcionário excluído",
        description: `${funcionario.nome} foi excluído com sucesso`
      });

      fetchFuncionarios(); // Atualizar lista
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao excluir funcionário",
        variant: "destructive"
      });
    }
  };

  // Função para excluir ferramenta
  const handleDeleteFerramenta = async (ferramenta: Ferramenta) => {
    try {
      const { error } = await supabase
        .from('ferramentas')
        .delete()
        .eq('id', ferramenta.id);

      if (error) {
        console.error('Erro ao excluir ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a ferramenta",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Ferramenta excluída",
        description: `${ferramenta.nome} foi excluída com sucesso`
      });

      onRefresh(); // Atualizar lista
    } catch (error) {
      console.error('Erro ao excluir ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao excluir ferramenta",
        variant: "destructive"
      });
    }
  };

  // Função para fazer/cancelar reserva
  const handleReserva = async () => {
    if (!reservandoFerramenta) return;
    
    setIsProcessingReserva(true);
    
    try {
      let updateData;
      
      if (reservandoFerramenta.reserva) {
        // Cancelar reserva
        updateData = {
          reserva: false,
          matricula_reserva: null
        };
      } else {
        // Fazer reserva
        if (!matriculaReserva.trim()) {
          toast({
            title: "Erro",
            description: "Informe a matrícula para fazer a reserva",
            variant: "destructive"
          });
          return;
        }
        
        updateData = {
          reserva: true,
          matricula_reserva: matriculaReserva.trim()
        };
      }
      
      const { error } = await supabase
        .from('ferramentas')
        .update(updateData)
        .eq('id', reservandoFerramenta.id);
      
      if (error) {
        console.error('Erro ao processar reserva:', error);
        toast({
          title: "Erro",
          description: "Não foi possível processar a reserva",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: reservandoFerramenta.reserva ? "Reserva cancelada" : "Reserva realizada",
        description: `A ferramenta ${reservandoFerramenta.nome} ${reservandoFerramenta.reserva ? 'não está mais reservada' : 'foi reservada com sucesso'}`
      });
      
      setReservandoFerramenta(null);
      setMatriculaReserva("");
      setDialogReservaOpen(false);
      onRefresh();
      
    } catch (error) {
      console.error('Erro ao processar reserva:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao processar reserva",
        variant: "destructive"
      });
    } finally {
      setIsProcessingReserva(false);
    }
  };

  const handleAddMaterial = async () => {
    if (!novoMaterial.nome || !novoMaterial.tag) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o nome e a tag do material",
        variant: "destructive"
      });
      return;
    }
    setIsAddingMaterial(true);
    try {
      const dataEntrada = formatarDataParaBanco(new Date());
      const {
        error
      } = await supabase.from('materiais').insert({
        nome: formatarTexto(novoMaterial.nome),
        tag: Number(novoMaterial.tag),
        entrada: Number(novoMaterial.entrada) || 0,
        saida: 0,
        quantidade_minima: Number(novoMaterial.quantidade_minima) || 0,
        unidade: novoMaterial.unidade,
        data_entrada_estoque: dataEntrada
      });
      if (error) {
        console.error('Erro ao adicionar material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o material",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Material adicionado",
        description: `${formatarTexto(novoMaterial.nome)} foi adicionado ao estoque`
      });
      setNovoMaterial({
        nome: "",
        tag: "",
        entrada: "",
        quantidade_minima: "",
        unidade: "un"
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar material",
        variant: "destructive"
      });
    } finally {
      setIsAddingMaterial(false);
    }
  };

  const handleEditMaterial = async () => {
    if (!editingMaterial) return;
    try {
      const {
        error
      } = await supabase.from('materiais').update({
        nome: formatarTexto(editingMaterial.nome),
        tag: Number(editingMaterial.tag),
        entrada: editingMaterial.entrada,
        quantidade_minima: editingMaterial.quantidade_minima,
        unidade: editingMaterial.unidade
      }).eq('id', editingMaterial.id);
      if (error) {
        console.error('Erro ao editar material:', error);
        toast({
          title: "Erro",
          description: "Não foi possível editar o material",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Material editado",
        description: `${formatarTexto(editingMaterial.nome)} foi editado com sucesso`
      });
      setEditingMaterial(null);
      setEditMaterialDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao editar material:', error);
    }
  };

  const handleAddFuncionario = async () => {
    if (!novoFuncionario.nome || !novoFuncionario.matricula || !novoFuncionario.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    setIsAddingFuncionario(true);
    try {
      const {
        error
      } = await supabase.from('funcionarios').insert({
        nome: novoFuncionario.nome.toUpperCase(),
        matricula: Number(novoFuncionario.matricula),
        setor: novoFuncionario.setor as SetorType,
        numero_whatsapp: novoFuncionario.numero_whatsapp,
        posse_ferramentas: []
      });
      if (error) {
        console.error('Erro ao adicionar funcionário:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o funcionário",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Funcionário adicionado",
        description: `${novoFuncionario.nome.toUpperCase()} foi adicionado com sucesso`
      });
      setNovoFuncionario({
        nome: "",
        matricula: "",
        setor: "",
        numero_whatsapp: ""
      });
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar funcionário",
        variant: "destructive"
      });
    } finally {
      setIsAddingFuncionario(false);
    }
  };

  const handleEditFuncionario = async () => {
    if (!editingFuncionario) return;
    try {
      const {
        error
      } = await supabase.from('funcionarios').update({
        nome: editingFuncionario.nome.toUpperCase(),
        matricula: editingFuncionario.matricula,
        setor: editingFuncionario.setor as SetorType,
        numero_whatsapp: editingFuncionario.numero_whatsapp
      }).eq('id', editingFuncionario.id);
      if (error) {
        console.error('Erro ao editar funcionário:', error);
        toast({
          title: "Erro",
          description: "Não foi possível editar o funcionário",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Funcionário editado",
        description: `${editingFuncionario.nome.toUpperCase()} foi editado com sucesso`
      });
      setEditingFuncionario(null);
      setEditFuncionarioDialogOpen(false);
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao editar funcionário:', error);
    }
  };

  // Função para adicionar entrada ao material
  const handleAddEntrada = async () => {
    if (!materialParaEntrada || !quantidadeEntrada.trim()) {
      toast({
        title: "Erro",
        description: "Informe a quantidade para adicionar ao estoque",
        variant: "destructive"
      });
      return;
    }

    const novaQuantidade = Number(quantidadeEntrada);
    if (novaQuantidade <= 0) {
      toast({
        title: "Erro", 
        description: "A quantidade deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    setIsAddingEntrada(true);
    
    try {
      const novaEntrada = materialParaEntrada.entrada + novaQuantidade;
      const dataEntrada = formatarDataParaBanco(new Date());
      
      const { error } = await supabase
        .from('materiais')
        .update({
          entrada: novaEntrada,
          data_entrada_estoque: dataEntrada
        })
        .eq('id', materialParaEntrada.id);

      if (error) {
        console.error('Erro ao adicionar entrada:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a entrada",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Entrada adicionada",
        description: `${novaQuantidade} ${materialParaEntrada.unidade} de ${materialParaEntrada.nome} foram adicionadas ao estoque`
      });

      setMaterialParaEntrada(null);
      setQuantidadeEntrada("");
      setDialogEntradaOpen(false);
      onRefresh();
      
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar entrada",
        variant: "destructive"
      });
    } finally {
      setIsAddingEntrada(false);
    }
  };

  // Ordenar listas alfabeticamente
  const filteredMateriais = materiais
    .filter(material => 
      material.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      material.tag.toString().includes(searchTerm) || 
      material.unidade?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));
  
  const filteredFerramentas = ferramentas
    .filter(ferramenta => 
      ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));
  
  const filteredFuncionarios = funcionarios
    .filter(funcionario => 
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      funcionario.matricula.toString().includes(searchTerm) || 
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Controle Geral de Estoque
        </CardTitle>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input 
              placeholder="Buscar por nome, tag ou categoria..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="max-w-sm" 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          </TabsList>

          <TabsContent value="materiais" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Material</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="material-nome">Nome do Material</Label>
                      <Input 
                        id="material-nome" 
                        value={novoMaterial.nome} 
                        onChange={e => setNovoMaterial({...novoMaterial, nome: e.target.value})} 
                        placeholder="Ex: Parafuso M8" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-tag">Tag (Número)</Label>
                      <Input 
                        id="material-tag" 
                        type="number" 
                        value={novoMaterial.tag} 
                        onChange={e => setNovoMaterial({...novoMaterial, tag: e.target.value})} 
                        placeholder="Ex: 001" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-entrada">Quantidade de Entrada</Label>
                      <Input 
                        id="material-entrada" 
                        type="number" 
                        value={novoMaterial.entrada} 
                        onChange={e => setNovoMaterial({...novoMaterial, entrada: e.target.value})} 
                        placeholder="100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-minima">Quantidade Mínima</Label>
                      <Input 
                        id="material-minima" 
                        type="number" 
                        value={novoMaterial.quantidade_minima} 
                        onChange={e => setNovoMaterial({...novoMaterial, quantidade_minima: e.target.value})} 
                        placeholder="10" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-unidade">Unidade de Medida</Label>
                      <Select 
                        value={novoMaterial.unidade} 
                        onValueChange={value => setNovoMaterial({...novoMaterial, unidade: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade</SelectItem>
                          <SelectItem value="kg">Quilograma</SelectItem>
                          <SelectItem value="g">Grama</SelectItem>
                          <SelectItem value="l">Litro</SelectItem>
                          <SelectItem value="ml">Mililitro</SelectItem>
                          <SelectItem value="m">Metro</SelectItem>
                          <SelectItem value="cm">Centímetro</SelectItem>
                          <SelectItem value="mm">Milímetro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAddMaterial} 
                      disabled={isAddingMaterial}
                    >
                      {isAddingMaterial ? 'Adicionando...' : 'Adicionar Material'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-center">Quantidade Disponível</TableHead>
                    <TableHead className="text-center">Quantidade Mínima</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Data Entrada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateriais.map(material => {
                    const quantidadeDisponivel = (material.entrada || 0) - (material.saida || 0);
                    return <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.tag}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{quantidadeDisponivel}</TableCell>
                        <TableCell className="text-center">{material.quantidade_minima}</TableCell>
                        <TableCell>{material.unidade || 'un'}</TableCell>
                        <TableCell>{material.data_entrada_estoque}</TableCell>
                        <TableCell>
                          <Badge variant={quantidadeDisponivel <= material.quantidade_minima ? "destructive" : "secondary"}>
                            {quantidadeDisponivel <= material.quantidade_minima ? "Estoque Baixo" : "OK"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* Botão para adicionar entrada */}
                            <Dialog 
                              open={dialogEntradaOpen && materialParaEntrada?.id === material.id} 
                              onOpenChange={(open) => {
                                setDialogEntradaOpen(open);
                                if (!open) {
                                  setMaterialParaEntrada(null);
                                  setQuantidadeEntrada("");
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setMaterialParaEntrada(material);
                                    setDialogEntradaOpen(true);
                                  }}
                                >
                                  <PackagePlus className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Adicionar Entrada de Estoque</DialogTitle>
                                </DialogHeader>
                                {materialParaEntrada && materialParaEntrada.id === material.id && (
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Material: <strong>{material.nome}</strong>
                                      </p>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Quantidade atual: <strong>{quantidadeDisponivel} {material.unidade}</strong>
                                      </p>
                                      <p className="text-sm text-muted-foreground mb-4">
                                        Tag: <strong>{material.tag}</strong>
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="quantidade-entrada">Quantidade a adicionar</Label>
                                      <Input
                                        id="quantidade-entrada"
                                        type="number"
                                        min="1"
                                        value={quantidadeEntrada}
                                        onChange={(e) => setQuantidadeEntrada(e.target.value)}
                                        placeholder={`Ex: 10 ${material.unidade}`}
                                      />
                                    </div>
                                    
                                    <Button 
                                      className="w-full" 
                                      onClick={handleAddEntrada}
                                      disabled={isAddingEntrada}
                                    >
                                      {isAddingEntrada 
                                        ? 'Adicionando...' 
                                        : `Adicionar ${quantidadeEntrada || '0'} ${material.unidade} ao estoque`
                                      }
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* Botão de editar existente */}
                            <Dialog open={editMaterialDialogOpen && editingMaterial?.id === material.id} onOpenChange={(open) => {
                              setEditMaterialDialogOpen(open);
                              if (!open) setEditingMaterial(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => {
                                    setEditingMaterial({...material, unidade: material.unidade || 'un'});
                                    setEditMaterialDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Material</DialogTitle>
                                </DialogHeader>
                                {editingMaterial && editingMaterial.id === material.id && <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-material-nome">Nome do Material</Label>
                                    <Input 
                                      id="edit-material-nome" 
                                      value={editingMaterial.nome} 
                                      onChange={e => setEditingMaterial({...editingMaterial, nome: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-tag">Tag</Label>
                                    <Input 
                                      id="edit-material-tag" 
                                      type="number" 
                                      value={editingMaterial.tag} 
                                      onChange={e => setEditingMaterial({...editingMaterial, tag: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-entrada">Quantidade de Entrada</Label>
                                    <Input 
                                      id="edit-material-entrada" 
                                      type="number" 
                                      value={editingMaterial.entrada} 
                                      onChange={e => setEditingMaterial({...editingMaterial, entrada: Number(e.target.value)})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-minima">Quantidade Mínima</Label>
                                    <Input 
                                      id="edit-material-minima" 
                                      type="number" 
                                      value={editingMaterial.quantidade_minima} 
                                      onChange={e => setEditingMaterial({...editingMaterial, quantidade_minima: Number(e.target.value)})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-unidade">Unidade</Label>
                                    <Select 
                                      value={editingMaterial.unidade} 
                                      onValueChange={value => setEditingMaterial({...editingMaterial, unidade: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="un">Unidade</SelectItem>
                                        <SelectItem value="kg">Quilograma</SelectItem>
                                        <SelectItem value="g">Grama</SelectItem>
                                        <SelectItem value="l">Litro</SelectItem>
                                        <SelectItem value="ml">Mililitro</SelectItem>
                                        <SelectItem value="m">Metro</SelectItem>
                                        <SelectItem value="cm">Centímetro</SelectItem>
                                        <SelectItem value="mm">Milímetro</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button className="w-full" onClick={handleEditMaterial}>
                                    Salvar Alterações
                                  </Button>
                                </div>}
                              </DialogContent>
                            </Dialog>

                            {/* Botão de excluir material */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o material <strong>{material.nome}</strong>?
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                      Tag: {material.tag} | Quantidade disponível: {quantidadeDisponivel} {material.unidade}
                                    </span>
                                    <br />
                                    <span className="text-destructive font-semibold">
                                      Esta ação não pode ser desfeita.
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteMaterial(material)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir Material
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>;
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="ferramentas" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-center">Quantidade Disponível</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Características</TableHead>
                    <TableHead>Reservar</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFerramentas.map(ferramenta => {
                    return <TableRow key={ferramenta.id}>
                        <TableCell className="font-medium">{ferramenta.nome}</TableCell>
                        <TableCell>{ferramenta.categoria}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ferramenta.tag}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{ferramenta.quantidade}</TableCell>
                        <TableCell>
                          {ferramenta.reserva ? (
                            <Badge variant="destructive">
                              <Shield className="w-3 h-3 mr-1" />
                              Reservada
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Disponível</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {ferramenta.caracteristicas && Object.keys(ferramenta.caracteristicas).length > 0 ? <Badge variant="secondary">Com características</Badge> : <Badge variant="outline">Sem características</Badge>}
                        </TableCell>
                        <TableCell>
                          <Dialog 
                            open={dialogReservaOpen && reservandoFerramenta?.id === ferramenta.id} 
                            onOpenChange={(open) => {
                              setDialogReservaOpen(open);
                              if (!open) {
                                setReservandoFerramenta(null);
                                setMatriculaReserva("");
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant={ferramenta.reserva ? "destructive" : "outline"}
                                onClick={() => {
                                  setReservandoFerramenta(ferramenta);
                                  setMatriculaReserva(ferramenta.matricula_reserva || "");
                                  setDialogReservaOpen(true);
                                }}
                              >
                                <Shield className="w-4 h-4 mr-1" />
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  {ferramenta.reserva ? 'Cancelar Reserva' : 'Fazer Reserva'}
                                </DialogTitle>
                              </DialogHeader>
                              {reservandoFerramenta && reservandoFerramenta.id === ferramenta.id && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Ferramenta: <strong>{ferramenta.nome}</strong>
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      Tag: <strong>{ferramenta.tag}</strong>
                                    </p>
                                  </div>
                                  
                                  {ferramenta.reserva ? (
                                    <div className="space-y-2">
                                      <p className="text-sm">
                                        Esta ferramenta está reservada para a matrícula: <strong>{ferramenta.matricula_reserva}</strong>
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Deseja cancelar a reserva?
                                      </p>
                                    </div>
                                  ) : (
                                    <div>
                                      <Label htmlFor="matricula-reserva">Matrícula do Funcionário</Label>
                                      <Input
                                        id="matricula-reserva"
                                        value={matriculaReserva}
                                        onChange={(e) => setMatriculaReserva(e.target.value)}
                                        placeholder="Digite a matrícula"
                                      />
                                    </div>
                                  )}
                                  
                                  <Button 
                                    className="w-full" 
                                    variant={ferramenta.reserva ? "destructive" : "default"}
                                    onClick={handleReserva}
                                    disabled={isProcessingReserva}
                                  >
                                    {isProcessingReserva 
                                      ? 'Processando...' 
                                      : ferramenta.reserva 
                                        ? 'Cancelar Reserva' 
                                        : 'Confirmar Reserva'
                                    }
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={editFerramentaDialogOpen && editingFerramenta?.id === ferramenta.id} onOpenChange={(open) => {
                              setEditFerramentaDialogOpen(open);
                              if (!open) setEditingFerramenta(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => {
                                    const caracteristicasStr = ferramenta.caracteristicas 
                                      ? Object.entries(ferramenta.caracteristicas).map(([key, value]) => `${key}: ${value}`).join('\n') 
                                      : '';
                                    setEditingFerramenta({...ferramenta, caracteristicas: caracteristicasStr});
                                    setEditFerramentaDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Editar Ferramenta</DialogTitle>
                                </DialogHeader>
                                {editingFerramenta && editingFerramenta.id === ferramenta.id && <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-ferramenta-nome">Nome da Ferramenta</Label>
                                    <Input 
                                      id="edit-ferramenta-nome" 
                                      value={editingFerramenta.nome} 
                                      onChange={e => setEditingFerramenta({...editingFerramenta, nome: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-categoria">Categoria</Label>
                                    <Input 
                                      id="edit-ferramenta-categoria" 
                                      value={editingFerramenta.categoria} 
                                      onChange={e => setEditingFerramenta({...editingFerramenta, categoria: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-tag">Tag</Label>
                                    <Input 
                                      id="edit-ferramenta-tag" 
                                      value={editingFerramenta.tag} 
                                      onChange={e => setEditingFerramenta({...editingFerramenta, tag: e.target.value})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-quantidade">Quantidade</Label>
                                    <Input 
                                      id="edit-ferramenta-quantidade" 
                                      type="number" 
                                      value={editingFerramenta.quantidade} 
                                      onChange={e => setEditingFerramenta({...editingFerramenta, quantidade: Number(e.target.value)})} 
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-caracteristicas">Características</Label>
                                    <Textarea 
                                      id="edit-ferramenta-caracteristicas" 
                                      value={typeof editingFerramenta.caracteristicas === 'string' ? editingFerramenta.caracteristicas : ''} 
                                      onChange={e => setEditingFerramenta({...editingFerramenta, caracteristicas: e.target.value})} 
                                      rows={6} 
                                      placeholder={`Exemplo:\ncor: Preta\nuso: Perfuração em metais\npotência: 500W\npeso: 15kg\n\nOu JSON:\n{"cor": "Preta", "uso": "Perfuração"}`} 
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Digite uma característica por linha no formato "nome: valor" ou JSON válido
                                    </p>
                                  </div>
                                  <Button className="w-full" onClick={handleEditFerramenta}>
                                    Salvar Alterações
                                  </Button>
                                </div>}
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a ferramenta <strong>{ferramenta.nome}</strong>?
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                      Tag: {ferramenta.tag} | Categoria: {ferramenta.categoria} | Quantidade: {ferramenta.quantidade}
                                    </span>
                                    {ferramenta.reserva && (
                                      <span className="block text-yellow-600 font-semibold mt-1">
                                        ⚠️ Esta ferramenta está reservada para a matrícula {ferramenta.matricula_reserva}
                                      </span>
                                    )}
                                    <br />
                                    <span className="text-destructive font-semibold">
                                      Esta ação não pode ser desfeita.
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteFerramenta(ferramenta)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir Ferramenta
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>;
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="funcionarios" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="funcionario-nome">Nome do Funcionário</Label>
                      <Input 
                        id="funcionario-nome" 
                        value={novoFuncionario.nome} 
                        onChange={e => setNovoFuncionario({...novoFuncionario, nome: e.target.value})} 
                        placeholder="Ex: João Silva" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="funcionario-matricula">Matrícula</Label>
                      <Input 
                        id="funcionario-matricula" 
                        type="number" 
                        value={novoFuncionario.matricula} 
                        onChange={e => setNovoFuncionario({...novoFuncionario, matricula: e.target.value})} 
                        placeholder="Ex: 12345" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="funcionario-setor">Setor</Label>
                      <Select 
                        value={novoFuncionario.setor} 
                        onValueChange={value => setNovoFuncionario({...novoFuncionario, setor: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent>
                          {setores.map(setor => (
                            <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="funcionario-whatsapp">Número WhatsApp (opcional)</Label>
                      <Input 
                        id="funcionario-whatsapp" 
                        value={novoFuncionario.numero_whatsapp} 
                        onChange={e => setNovoFuncionario({...novoFuncionario, numero_whatsapp: e.target.value})} 
                        placeholder="Ex: (11) 99999-9999" 
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAddFuncionario} 
                      disabled={isAddingFuncionario}
                    >
                      {isAddingFuncionario ? 'Adicionando...' : 'Adicionar Funcionário'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Matrícula</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead className="text-center">Em posse</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingFuncionarios ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Carregando funcionários...</TableCell>
                    </TableRow>
                  ) : filteredFuncionarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {searchTerm ? 'Nenhum funcionário encontrado com os critérios de busca' : 'Nenhum funcionário cadastrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFuncionarios.map(funcionario => (
                      <TableRow key={funcionario.id}>
                        <TableCell className="font-medium">{funcionario.nome}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{funcionario.matricula}</Badge>
                        </TableCell>
                        <TableCell>{funcionario.setor}</TableCell>
                        <TableCell>{funcionario.numero_whatsapp || 'Não informado'}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={funcionario.posse_ferramentas.length > 0 ? "secondary" : "outline"}>
                            {funcionario.posse_ferramentas.length} ferramentas
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={editFuncionarioDialogOpen && editingFuncionario?.id === funcionario.id} onOpenChange={(open) => {
                              setEditFuncionarioDialogOpen(open);
                              if (!open) setEditingFuncionario(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => {
                                    setEditingFuncionario(funcionario);
                                    setEditFuncionarioDialogOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Funcionário</DialogTitle>
                                </DialogHeader>
                                {editingFuncionario && editingFuncionario.id === funcionario.id && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-funcionario-nome">Nome do Funcionário</Label>
                                      <Input 
                                        id="edit-funcionario-nome" 
                                        value={editingFuncionario.nome} 
                                        onChange={e => setEditingFuncionario({...editingFuncionario, nome: e.target.value})} 
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-funcionario-matricula">Matrícula</Label>
                                      <Input 
                                        id="edit-funcionario-matricula" 
                                        type="number" 
                                        value={editingFuncionario.matricula} 
                                        onChange={e => setEditingFuncionario({...editingFuncionario, matricula: Number(e.target.value)})} 
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-funcionario-setor">Setor</Label>
                                      <Select 
                                        value={editingFuncionario.setor} 
                                        onValueChange={value => setEditingFuncionario({...editingFuncionario, setor: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {setores.map(setor => (
                                            <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-funcionario-whatsapp">Número WhatsApp</Label>
                                      <Input 
                                        id="edit-funcionario-whatsapp" 
                                        value={editingFuncionario.numero_whatsapp} 
                                        onChange={e => setEditingFuncionario({...editingFuncionario, numero_whatsapp: e.target.value})} 
                                      />
                                    </div>
                                    <Button className="w-full" onClick={handleEditFuncionario}>
                                      Salvar Alterações
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o funcionário <strong>{funcionario.nome}</strong>?
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                      Matrícula: {funcionario.matricula} | Setor: {funcionario.setor}
                                    </span>
                                    {funcionario.posse_ferramentas.length > 0 && (
                                      <span className="block text-yellow-600 font-semibold mt-1">
                                        ⚠️ Este funcionário possui {funcionario.posse_ferramentas.length} ferramenta(s) em posse
                                      </span>
                                    )}
                                    <br />
                                    <span className="text-destructive font-semibold">
                                      Esta ação não pode ser desfeita.
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteFuncionario(funcionario)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir Funcionário
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
