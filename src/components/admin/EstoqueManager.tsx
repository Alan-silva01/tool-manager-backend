import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Wrench,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  RefreshCw
} from "lucide-react";

// Tipos baseados no schema do Supabase
type DatabaseMaterial = {
  id: string;
  nome: string;
  tag: number;
  quantidade_minima: number;
  entrada: number;
  saida: number;
  data_entrada_estoque: string;
  unidade: string;
};

type DatabaseFerramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
};

type DatabaseFuncionario = {
  id: string;
  nome: string;
  matricula: number;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: any;
};

// Setores disponíveis
const SETORES_DISPONIVEIS = [
  "Usinagem industrial",
  "Oficina cantilever", 
  "Oficina de guias",
  "Montagem de gaiola",
  "Oficina de mancal",
  "Usinagem de cilindros",
  "Oficina central"
];

interface EstoqueManagerProps {
  materiais: DatabaseMaterial[];
  ferramentas: DatabaseFerramenta[];
  onRefresh: () => void;
}

export const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("materiais");
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingFerramenta, setIsAddingFerramenta] = useState(false);
  const [isAddingFuncionario, setIsAddingFuncionario] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [funcionarios, setFuncionarios] = useState<DatabaseFuncionario[]>([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
  const [novoSetor, setNovoSetor] = useState("");
  const [mostrarNovoSetor, setMostrarNovoSetor] = useState(false);

  // Estados para novos itens
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    tag: "",
    quantidade_minima: "",
    entrada: "",
    saida: "0",
    data_entrada_estoque: "",
    unidade: "un"
  });

  const [novaFerramenta, setNovaFerramenta] = useState({
    nome: "",
    tag: "",
    quantidade: "",
    categoria: "",
    caracteristicas: "",
    saiu: "0"
  });

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    matricula: "",
    setor: "",
    numero_whatsapp: "",
    posse_ferramentas: []
  });

  // Carregar funcionários
  const carregarFuncionarios = async () => {
    setLoadingFuncionarios(true);
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome');

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error("Erro ao carregar funcionários");
    } finally {
      setLoadingFuncionarios(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Funções para adicionar novos itens
  const adicionarMaterial = async () => {
    try {
      const { error } = await supabase
        .from('materiais')
        .insert([{
          nome: novoMaterial.nome,
          tag: parseInt(novoMaterial.tag),
          quantidade_minima: parseInt(novoMaterial.quantidade_minima),
          entrada: parseInt(novoMaterial.entrada),
          saida: parseInt(novoMaterial.saida),
          data_entrada_estoque: novoMaterial.data_entrada_estoque,
          unidade: novoMaterial.unidade
        }]);

      if (error) throw error;

      toast.success("Material adicionado com sucesso!");
      setIsAddingMaterial(false);
      setNovoMaterial({
        nome: "",
        tag: "",
        quantidade_minima: "",
        entrada: "",
        saida: "0",
        data_entrada_estoque: "",
        unidade: "un"
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast.error("Erro ao adicionar material");
    }
  };

  const adicionarFerramenta = async () => {
    try {
      let caracteristicas = {};
      if (novaFerramenta.caracteristicas) {
        try {
          caracteristicas = JSON.parse(novaFerramenta.caracteristicas);
        } catch (e) {
          caracteristicas = { descricao: novaFerramenta.caracteristicas };
        }
      }

      const { error } = await supabase
        .from('ferramentas')
        .insert([{
          nome: novaFerramenta.nome,
          tag: novaFerramenta.tag,
          quantidade: parseInt(novaFerramenta.quantidade),
          categoria: novaFerramenta.categoria,
          caracteristicas: caracteristicas,
          saiu: parseInt(novaFerramenta.saiu)
        }]);

      if (error) throw error;

      toast.success("Ferramenta adicionada com sucesso!");
      setIsAddingFerramenta(false);
      setNovaFerramenta({
        nome: "",
        tag: "",
        quantidade: "",
        categoria: "",
        caracteristicas: "",
        saiu: "0"
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast.error("Erro ao adicionar ferramenta");
    }
  };

  const adicionarFuncionario = async () => {
    try {
      const setorFinal = mostrarNovoSetor ? novoSetor : novoFuncionario.setor;
      
      const { error } = await supabase
        .from('funcionarios')
        .insert([{
          nome: novoFuncionario.nome,
          matricula: parseInt(novoFuncionario.matricula),
          setor: setorFinal,
          numero_whatsapp: novoFuncionario.numero_whatsapp,
          posse_ferramentas: novoFuncionario.posse_ferramentas
        }]);

      if (error) throw error;

      toast.success("Funcionário adicionado com sucesso!");
      setIsAddingFuncionario(false);
      setNovoFuncionario({
        nome: "",
        matricula: "",
        setor: "",
        numero_whatsapp: "",
        posse_ferramentas: []
      });
      setNovoSetor("");
      setMostrarNovoSetor(false);
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      toast.error("Erro ao adicionar funcionário");
    }
  };

  // Função para atualizar item
  const atualizarItem = async () => {
    if (!editingItem) return;

    try {
      let tabela = '';
      let dadosAtualizados = {};

      if (editingItem.type === 'material') {
        tabela = 'materiais';
        dadosAtualizados = {
          nome: editingItem.nome,
          tag: parseInt(editingItem.tag),
          quantidade_minima: parseInt(editingItem.quantidade_minima),
          entrada: parseInt(editingItem.entrada),
          saida: parseInt(editingItem.saida),
          data_entrada_estoque: editingItem.data_entrada_estoque,
          unidade: editingItem.unidade
        };
      } else if (editingItem.type === 'ferramenta') {
        tabela = 'ferramentas';
        let caracteristicas = {};
        if (editingItem.caracteristicas) {
          try {
            caracteristicas = typeof editingItem.caracteristicas === 'string' 
              ? JSON.parse(editingItem.caracteristicas) 
              : editingItem.caracteristicas;
          } catch (e) {
            caracteristicas = { descricao: editingItem.caracteristicas };
          }
        }
        dadosAtualizados = {
          nome: editingItem.nome,
          tag: editingItem.tag,
          quantidade: parseInt(editingItem.quantidade),
          categoria: editingItem.categoria,
          caracteristicas: caracteristicas,
          saiu: parseInt(editingItem.saiu)
        };
      } else if (editingItem.type === 'funcionario') {
        tabela = 'funcionarios';
        dadosAtualizados = {
          nome: editingItem.nome,
          matricula: parseInt(editingItem.matricula),
          setor: editingItem.setor,
          numero_whatsapp: editingItem.numero_whatsapp,
          posse_ferramentas: editingItem.posse_ferramentas
        };
      }

      const { error } = await supabase
        .from(tabela)
        .update(dadosAtualizados)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast.success("Item atualizado com sucesso!");
      setEditingItem(null);
      if (editingItem.type === 'funcionario') {
        carregarFuncionarios();
      } else {
        onRefresh();
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast.error("Erro ao atualizar item");
    }
  };

  // Função para deletar item
  const deletarItem = async (id: string, tipo: string) => {
    try {
      let tabela = '';
      if (tipo === 'material') tabela = 'materiais';
      else if (tipo === 'ferramenta') tabela = 'ferramentas';
      else if (tipo === 'funcionario') tabela = 'funcionarios';

      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Item deletado com sucesso!");
      if (tipo === 'funcionario') {
        carregarFuncionarios();
      } else {
        onRefresh();
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast.error("Erro ao deletar item");
    }
  };

  // Filtrar dados
  const filteredMateriais = materiais.filter(material =>
    material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tag.toString().includes(searchTerm)
  );

  const filteredFerramentas = ferramentas.filter(ferramenta =>
    ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.tag.includes(searchTerm) ||
    ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.matricula.toString().includes(searchTerm) ||
    funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetorChange = (value: string) => {
    if (value === "novo") {
      setMostrarNovoSetor(true);
      setNovoFuncionario({...novoFuncionario, setor: ""});
    } else {
      setMostrarNovoSetor(false);
      setNovoFuncionario({...novoFuncionario, setor: value});
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Controle de Estoque</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>

        {/* Tab Materiais */}
        <TabsContent value="materiais" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Materiais ({filteredMateriais.length})</h3>
            <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
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
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={novoMaterial.nome}
                      onChange={(e) => setNovoMaterial({...novoMaterial, nome: e.target.value})}
                      placeholder="Nome do material"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      value={novoMaterial.tag}
                      onChange={(e) => setNovoMaterial({...novoMaterial, tag: e.target.value})}
                      placeholder="Tag do material"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                    <Input
                      id="quantidade_minima"
                      type="number"
                      value={novoMaterial.quantidade_minima}
                      onChange={(e) => setNovoMaterial({...novoMaterial, quantidade_minima: e.target.value})}
                      placeholder="Quantidade mínima"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entrada">Entrada</Label>
                    <Input
                      id="entrada"
                      type="number"
                      value={novoMaterial.entrada}
                      onChange={(e) => setNovoMaterial({...novoMaterial, entrada: e.target.value})}
                      placeholder="Quantidade de entrada"
                    />
                  </div>
                  <div>
                    <Label htmlFor="saida">Saída</Label>
                    <Input
                      id="saida"
                      type="number"
                      value={novoMaterial.saida}
                      onChange={(e) => setNovoMaterial({...novoMaterial, saida: e.target.value})}
                      placeholder="Quantidade de saída"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_entrada_estoque">Data de Entrada</Label>
                    <Input
                      id="data_entrada_estoque"
                      type="date"
                      value={novoMaterial.data_entrada_estoque}
                      onChange={(e) => setNovoMaterial({...novoMaterial, data_entrada_estoque: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={novoMaterial.unidade} onValueChange={(value) => setNovoMaterial({...novoMaterial, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="kg">Kilogramas</SelectItem>
                        <SelectItem value="l">Litros</SelectItem>
                        <SelectItem value="m">Metros</SelectItem>
                        <SelectItem value="m²">Metros²</SelectItem>
                        <SelectItem value="m³">Metros³</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={adicionarMaterial} className="w-full">
                    Adicionar Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredMateriais.map((material) => (
              <Card key={material.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{material.nome}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">#{material.tag}</Badge>
                        <Badge variant="secondary">{material.unidade}</Badge>
                        <Badge variant={material.entrada - material.saida <= material.quantidade_minima ? "destructive" : "default"}>
                          {material.entrada - material.saida} disponível
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Min: {material.quantidade_minima} | Entrada: {material.entrada} | Saída: {material.saida}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem({...material, type: 'material'})}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletarItem(material.id, 'material')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Ferramentas */}
        <TabsContent value="ferramentas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Ferramentas ({filteredFerramentas.length})</h3>
            <Dialog open={isAddingFerramenta} onOpenChange={setIsAddingFerramenta}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={novaFerramenta.nome}
                      onChange={(e) => setNovaFerramenta({...novaFerramenta, nome: e.target.value})}
                      placeholder="Nome da ferramenta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      value={novaFerramenta.tag}
                      onChange={(e) => setNovaFerramenta({...novaFerramenta, tag: e.target.value})}
                      placeholder="Tag da ferramenta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novaFerramenta.quantidade}
                      onChange={(e) => setNovaFerramenta({...novaFerramenta, quantidade: e.target.value})}
                      placeholder="Quantidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={novaFerramenta.categoria}
                      onChange={(e) => setNovaFerramenta({...novaFerramenta, categoria: e.target.value})}
                      placeholder="Categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caracteristicas">Características</Label>
                    <Textarea
                      id="caracteristicas"
                      value={novaFerramenta.caracteristicas}
                      onChange={(e) => setNovaFerramenta({...novaFerramenta, caracteristicas: e.target.value})}
                      placeholder="Características da ferramenta (opcional)"
                    />
                  </div>
                  <Button onClick={adicionarFerramenta} className="w-full">
                    Adicionar Ferramenta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredFerramentas.map((ferramenta) => (
              <Card key={ferramenta.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{ferramenta.nome}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{ferramenta.tag}</Badge>
                        <Badge variant="secondary">{ferramenta.categoria}</Badge>
                        <Badge variant={ferramenta.quantidade <= 1 ? "destructive" : "default"}>
                          {ferramenta.quantidade} disponível
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saiu: {ferramenta.saiu}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem({...ferramenta, type: 'ferramenta'})}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletarItem(ferramenta.id, 'ferramenta')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Funcionários */}
        <TabsContent value="funcionarios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Funcionários ({filteredFuncionarios.length})</h3>
            <Dialog open={isAddingFuncionario} onOpenChange={setIsAddingFuncionario}>
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
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={novoFuncionario.nome}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, nome: e.target.value})}
                      placeholder="Nome do funcionário"
                    />
                  </div>
                  <div>
                    <Label htmlFor="matricula">Matrícula</Label>
                    <Input
                      id="matricula"
                      value={novoFuncionario.matricula}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, matricula: e.target.value})}
                      placeholder="Matrícula do funcionário"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setor">Setor</Label>
                    <Select value={mostrarNovoSetor ? "novo" : novoFuncionario.setor} onValueChange={handleSetorChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {SETORES_DISPONIVEIS.map((setor) => (
                          <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                        ))}
                        <SelectItem value="novo">+ Adicionar novo setor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {mostrarNovoSetor && (
                    <div>
                      <Label htmlFor="novoSetor">Novo Setor</Label>
                      <Input
                        id="novoSetor"
                        value={novoSetor}
                        onChange={(e) => setNovoSetor(e.target.value)}
                        placeholder="Digite o nome do novo setor"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="numero_whatsapp">WhatsApp</Label>
                    <Input
                      id="numero_whatsapp"
                      value={novoFuncionario.numero_whatsapp}
                      onChange={(e) => setNovoFuncionario({...novoFuncionario, numero_whatsapp: e.target.value})}
                      placeholder="Número do WhatsApp"
                    />
                  </div>
                  <Button onClick={adicionarFuncionario} className="w-full">
                    Adicionar Funcionário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredFuncionarios.map((funcionario) => (
              <Card key={funcionario.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{funcionario.nome}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">#{funcionario.matricula}</Badge>
                        <Badge variant="secondary">{funcionario.setor}</Badge>
                        <Badge variant="default">
                          {Array.isArray(funcionario.posse_ferramentas) ? funcionario.posse_ferramentas.length : 0} ferramentas
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        WhatsApp: {funcionario.numero_whatsapp || "Não informado"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingItem({...funcionario, type: 'funcionario'})}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletarItem(funcionario.id, 'funcionario')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar item */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar {editingItem?.type === 'material' ? 'Material' : editingItem?.type === 'ferramenta' ? 'Ferramenta' : 'Funcionário'}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nome">Nome</Label>
                <Input
                  id="edit-nome"
                  value={editingItem.nome}
                  onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})}
                  placeholder="Nome"
                />
              </div>
              {editingItem.type === 'material' && (
                <>
                  <div>
                    <Label htmlFor="edit-tag">Tag</Label>
                    <Input
                      id="edit-tag"
                      value={editingItem.tag}
                      onChange={(e) => setEditingItem({...editingItem, tag: e.target.value})}
                      placeholder="Tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-quantidade_minima">Quantidade Mínima</Label>
                    <Input
                      id="edit-quantidade_minima"
                      type="number"
                      value={editingItem.quantidade_minima}
                      onChange={(e) => setEditingItem({...editingItem, quantidade_minima: e.target.value})}
                      placeholder="Quantidade mínima"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-entrada">Entrada</Label>
                    <Input
                      id="edit-entrada"
                      type="number"
                      value={editingItem.entrada}
                      onChange={(e) => setEditingItem({...editingItem, entrada: e.target.value})}
                      placeholder="Quantidade de entrada"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-saida">Saída</Label>
                    <Input
                      id="edit-saida"
                      type="number"
                      value={editingItem.saida}
                      onChange={(e) => setEditingItem({...editingItem, saida: e.target.value})}
                      placeholder="Quantidade de saída"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-unidade">Unidade</Label>
                    <Select value={editingItem.unidade} onValueChange={(value) => setEditingItem({...editingItem, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="kg">Kilogramas</SelectItem>
                        <SelectItem value="l">Litros</SelectItem>
                        <SelectItem value="m">Metros</SelectItem>
                        <SelectItem value="m²">Metros²</SelectItem>
                        <SelectItem value="m³">Metros³</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {editingItem.type === 'ferramenta' && (
                <>
                  <div>
                    <Label htmlFor="edit-tag">Tag</Label>
                    <Input
                      id="edit-tag"
                      value={editingItem.tag}
                      onChange={(e) => setEditingItem({...editingItem, tag: e.target.value})}
                      placeholder="Tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-quantidade">Quantidade</Label>
                    <Input
                      id="edit-quantidade"
                      type="number"
                      value={editingItem.quantidade}
                      onChange={(e) => setEditingItem({...editingItem, quantidade: e.target.value})}
                      placeholder="Quantidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-categoria">Categoria</Label>
                    <Input
                      id="edit-categoria"
                      value={editingItem.categoria}
                      onChange={(e) => setEditingItem({...editingItem, categoria: e.target.value})}
                      placeholder="Categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-saiu">Saiu</Label>
                    <Input
                      id="edit-saiu"
                      type="number"
                      value={editingItem.saiu}
                      onChange={(e) => setEditingItem({...editingItem, saiu: e.target.value})}
                      placeholder="Quantidade que saiu"
                    />
                  </div>
                </>
              )}
              {editingItem.type === 'funcionario' && (
                <>
                  <div>
                    <Label htmlFor="edit-matricula">Matrícula</Label>
                    <Input
                      id="edit-matricula"
                      value={editingItem.matricula}
                      onChange={(e) => setEditingItem({...editingItem, matricula: e.target.value})}
                      placeholder="Matrícula"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-setor">Setor</Label>
                    <Select value={editingItem.setor} onValueChange={(value) => setEditingItem({...editingItem, setor: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {SETORES_DISPONIVEIS.map((setor) => (
                          <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-numero_whatsapp">WhatsApp</Label>
                    <Input
                      id="edit-numero_whatsapp"
                      value={editingItem.numero_whatsapp}
                      onChange={(e) => setEditingItem({...editingItem, numero_whatsapp: e.target.value})}
                      placeholder="Número do WhatsApp"
                    />
                  </div>
                </>
              )}
              <Button onClick={atualizarItem} className="w-full">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstoqueManager;
