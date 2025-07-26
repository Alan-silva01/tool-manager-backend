import { useState } from "react";
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
import { Plus, Edit, Search, Package, Wrench, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingFerramenta, setIsAddingFerramenta] = useState(false);
  const [isAddingFuncionario, setIsAddingFuncionario] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);

  // Estados para novo material
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    tag: "",
    entrada: "",
    quantidade_minima: "",
    unidade: "un"
  });

  // Estados para nova ferramenta
  const [novaFerramenta, setNovaFerramenta] = useState({
    nome: "",
    categoria: "",
    quantidade: "",
    tag: "",
    caracteristicas: ""
  });

  // Estados para novo funcionário
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    matricula: "",
    setor: "",
    numero_whatsapp: ""
  });
  const setores: SetorType[] = ["Usinagem industrial", "Oficina cantilever", "Oficina de guias", "Montagem de gaiola", "Oficina de mancal", "Usinagem de cilindros", "Oficina central"];

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
      const {
        data,
        error
      } = await supabase.from('funcionarios').select('*').order('nome');
      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }
      if (data) {
        const funcionariosFormatados = data.map(func => ({
          id: func.id,
          nome: func.nome || '',
          matricula: func.matricula || 0,
          setor: func.setor || '',
          numero_whatsapp: func.numero_whatsapp || '',
          posse_ferramentas: Array.isArray(func.posse_ferramentas) ? func.posse_ferramentas.filter((item: any): item is string => typeof item === 'string') : []
        }));
        setFuncionarios(funcionariosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoadingFuncionarios(false);
    }
  };
  const formatarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };
  const formatarCaracteristicas = (texto: string) => {
    if (!texto.trim()) return {};
    try {
      return JSON.parse(texto);
    } catch {
      const linhas = texto.split('\n').filter(linha => linha.trim());
      const caracteristicasObj: any = {};
      linhas.forEach(linha => {
        const [chave, ...valorParts] = linha.split(':');
        if (chave && valorParts.length > 0) {
          const valor = valorParts.join(':').trim();
          caracteristicasObj[chave.trim()] = valor;
        }
      });
      return caracteristicasObj;
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
      onRefresh();
    } catch (error) {
      console.error('Erro ao editar material:', error);
    }
  };
  const handleAddFerramenta = async () => {
    if (!novaFerramenta.nome || !novaFerramenta.categoria || !novaFerramenta.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    const caracteristicasJson = formatarCaracteristicas(novaFerramenta.caracteristicas);
    setIsAddingFerramenta(true);
    try {
      const {
        error
      } = await supabase.from('ferramentas').insert({
        nome: formatarTexto(novaFerramenta.nome),
        categoria: formatarTexto(novaFerramenta.categoria),
        tag: novaFerramenta.tag,
        quantidade: Number(novaFerramenta.quantidade) || 0,
        saiu: 0,
        status: 'disponível',
        caracteristicas: caracteristicasJson
      });
      if (error) {
        console.error('Erro ao adicionar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a ferramenta",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Ferramenta adicionada",
        description: `${formatarTexto(novaFerramenta.nome)} foi adicionada ao estoque`
      });
      setNovaFerramenta({
        nome: "",
        categoria: "",
        quantidade: "",
        tag: "",
        caracteristicas: ""
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao adicionar ferramenta",
        variant: "destructive"
      });
    } finally {
      setIsAddingFerramenta(false);
    }
  };
  const handleEditFerramenta = async () => {
    if (!editingFerramenta) return;
    let caracteristicasJson = editingFerramenta.caracteristicas;
    if (typeof editingFerramenta.caracteristicas === 'string') {
      caracteristicasJson = formatarCaracteristicas(editingFerramenta.caracteristicas);
    }
    try {
      const {
        error
      } = await supabase.from('ferramentas').update({
        nome: formatarTexto(editingFerramenta.nome),
        categoria: formatarTexto(editingFerramenta.categoria),
        quantidade: editingFerramenta.quantidade,
        tag: editingFerramenta.tag,
        caracteristicas: caracteristicasJson
      }).eq('id', editingFerramenta.id);
      if (error) {
        console.error('Erro ao editar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível editar a ferramenta",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Ferramenta editada",
        description: `${formatarTexto(editingFerramenta.nome)} foi editada com sucesso`
      });
      setEditingFerramenta(null);
      onRefresh();
    } catch (error) {
      console.error('Erro ao editar ferramenta:', error);
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
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao editar funcionário:', error);
    }
  };
  const filteredMateriais = materiais.filter(material => material.nome.toLowerCase().includes(searchTerm.toLowerCase()) || material.tag.toString().includes(searchTerm) || material.unidade?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFerramentas = ferramentas.filter(ferramenta => ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) || ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase()) || ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredFuncionarios = funcionarios.filter(funcionario => funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) || funcionario.matricula.toString().includes(searchTerm) || funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase()));
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Controle Geral de Estoque
        </CardTitle>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input placeholder="Buscar por nome, tag ou categoria..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materiais" className="space-y-4" onValueChange={value => {
        if (value === 'funcionarios' && funcionarios.length === 0) {
          fetchFuncionarios();
        }
      }}>
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
                      <Input id="material-nome" value={novoMaterial.nome} onChange={e => setNovoMaterial({
                      ...novoMaterial,
                      nome: e.target.value
                    })} placeholder="Ex: Parafuso M8" />
                    </div>
                    <div>
                      <Label htmlFor="material-tag">Tag (Número)</Label>
                      <Input id="material-tag" type="number" value={novoMaterial.tag} onChange={e => setNovoMaterial({
                      ...novoMaterial,
                      tag: e.target.value
                    })} placeholder="Ex: 001" />
                    </div>
                    <div>
                      <Label htmlFor="material-entrada">Quantidade de Entrada</Label>
                      <Input id="material-entrada" type="number" value={novoMaterial.entrada} onChange={e => setNovoMaterial({
                      ...novoMaterial,
                      entrada: e.target.value
                    })} placeholder="100" />
                    </div>
                    <div>
                      <Label htmlFor="material-minima">Quantidade Mínima</Label>
                      <Input id="material-minima" type="number" value={novoMaterial.quantidade_minima} onChange={e => setNovoMaterial({
                      ...novoMaterial,
                      quantidade_minima: e.target.value
                    })} placeholder="10" />
                    </div>
                    <div>
                      <Label htmlFor="material-unidade">Unidade de Medida</Label>
                      <Select value={novoMaterial.unidade} onValueChange={value => setNovoMaterial({
                      ...novoMaterial,
                      unidade: value
                    })}>
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
                    <Button className="w-full" onClick={handleAddMaterial} disabled={isAddingMaterial}>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => setEditingMaterial({
                            ...material,
                            unidade: material.unidade || 'un'
                          })}>
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
                                    <Input id="edit-material-nome" value={editingMaterial.nome} onChange={e => setEditingMaterial({
                                ...editingMaterial,
                                nome: e.target.value
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-tag">Tag</Label>
                                    <Input id="edit-material-tag" type="number" value={editingMaterial.tag} onChange={e => setEditingMaterial({
                                ...editingMaterial,
                                tag: e.target.value
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-entrada">Quantidade de Entrada</Label>
                                    <Input id="edit-material-entrada" type="number" value={editingMaterial.entrada} onChange={e => setEditingMaterial({
                                ...editingMaterial,
                                entrada: Number(e.target.value)
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-minima">Quantidade Mínima</Label>
                                    <Input id="edit-material-minima" type="number" value={editingMaterial.quantidade_minima} onChange={e => setEditingMaterial({
                                ...editingMaterial,
                                quantidade_minima: Number(e.target.value)
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-material-unidade">Unidade</Label>
                                    <Select value={editingMaterial.unidade} onValueChange={value => setEditingMaterial({
                                ...editingMaterial,
                                unidade: value
                              })}>
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
                        </TableCell>
                      </TableRow>;
                })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="ferramentas" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ferramenta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Ferramenta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ferramenta-nome">Nome da Ferramenta</Label>
                      <Input id="ferramenta-nome" value={novaFerramenta.nome} onChange={e => setNovaFerramenta({
                      ...novaFerramenta,
                      nome: e.target.value
                    })} placeholder="Ex: Furadeira" />
                    </div>
                    <div>
                      <Label htmlFor="ferramenta-categoria">Categoria</Label>
                      <Input id="ferramenta-categoria" value={novaFerramenta.categoria} onChange={e => setNovaFerramenta({
                      ...novaFerramenta,
                      categoria: e.target.value
                    })} placeholder="Ex: Elétrica" />
                    </div>
                    <div>
                      <Label htmlFor="ferramenta-tag">Tag (Número)</Label>
                      <Input id="ferramenta-tag" value={novaFerramenta.tag} onChange={e => setNovaFerramenta({
                      ...novaFerramenta,
                      tag: e.target.value
                    })} placeholder="Ex: 00000000000" />
                    </div>
                    <div>
                      <Label htmlFor="ferramenta-quantidade">Quantidade</Label>
                      <Input id="ferramenta-quantidade" type="number" value={novaFerramenta.quantidade} onChange={e => setNovaFerramenta({
                      ...novaFerramenta,
                      quantidade: e.target.value
                    })} placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="ferramenta-caracteristicas">Características</Label>
                      <Textarea id="ferramenta-caracteristicas" value={novaFerramenta.caracteristicas} onChange={e => setNovaFerramenta({
                      ...novaFerramenta,
                      caracteristicas: e.target.value
                    })} placeholder={`cor: Preta\nuso: Perfuração em metais\npotência: 500W\npeso: 15kg`} rows={4} />
                      <p className="text-xs text-muted-foreground mt-1">
                        Digite uma característica por linha no formato "nome: valor"
                      </p>
                    </div>
                    <Button className="w-full" onClick={handleAddFerramenta} disabled={isAddingFerramenta}>
                      {isAddingFerramenta ? 'Adicionando...' : 'Adicionar Ferramenta'}
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead className="text-center">Quantidade Disponível</TableHead>
                    <TableHead>Características</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFerramentas.map(ferramenta => {
                  const quantidadeDisponivel = (ferramenta.quantidade || 0) - (ferramenta.saiu || 0);
                  return <TableRow key={ferramenta.id}>
                        <TableCell className="font-medium">{ferramenta.nome}</TableCell>
                        <TableCell>{ferramenta.categoria}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ferramenta.tag}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{quantidadeDisponivel}</TableCell>
                        <TableCell>
                          {ferramenta.caracteristicas && Object.keys(ferramenta.caracteristicas).length > 0 ? <Badge variant="secondary">Com características</Badge> : <Badge variant="outline">Sem características</Badge>}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => {
                            const caracteristicasStr = ferramenta.caracteristicas ? Object.entries(ferramenta.caracteristicas).map(([key, value]) => `${key}: ${value}`).join('\n') : '';
                            setEditingFerramenta({
                              ...ferramenta,
                              caracteristicas: caracteristicasStr
                            });
                          }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar Ferramenta</DialogTitle>
                              </DialogHeader>
                              {editingFerramenta && editingFerramenta.id === ferramenta.id && <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-ferramenta-nome">Nome da Ferramenta</Label>
                                    <Input id="edit-ferramenta-nome" value={editingFerramenta.nome} onChange={e => setEditingFerramenta({
                                ...editingFerramenta,
                                nome: e.target.value
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-categoria">Categoria</Label>
                                    <Input id="edit-ferramenta-categoria" value={editingFerramenta.categoria} onChange={e => setEditingFerramenta({
                                ...editingFerramenta,
                                categoria: e.target.value
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-tag">Tag</Label>
                                    <Input id="edit-ferramenta-tag" value={editingFerramenta.tag} onChange={e => setEditingFerramenta({
                                ...editingFerramenta,
                                tag: e.target.value
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-quantidade">Quantidade</Label>
                                    <Input id="edit-ferramenta-quantidade" type="number" value={editingFerramenta.quantidade} onChange={e => setEditingFerramenta({
                                ...editingFerramenta,
                                quantidade: Number(e.target.value)
                              })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-ferramenta-caracteristicas">Características</Label>
                                    <Textarea id="edit-ferramenta-caracteristicas" value={typeof editingFerramenta.caracteristicas === 'string' ? editingFerramenta.caracteristicas : ''} onChange={e => setEditingFerramenta({
                                ...editingFerramenta,
                                caracteristicas: e.target.value
                              })} rows={6} placeholder={`cor: Preta\nuso: Perfuração em metais\npotência: 500W\npeso: 15kg`} />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Digite uma característica por linha no formato "nome: valor"
                                    </p>
                                  </div>
                                  <Button className="w-full" onClick={handleEditFerramenta}>
                                    Salvar Alterações
                                  </Button>
                                </div>}
                            </DialogContent>
                          </Dialog>
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
                      <Input id="funcionario-nome" value={novoFuncionario.nome} onChange={e => setNovoFuncionario({
                      ...novoFuncionario,
                      nome: e.target.value
                    })} placeholder="Ex: João Silva" />
                    </div>
                    <div>
                      <Label htmlFor="funcionario-matricula">Matrícula</Label>
                      <Input id="funcionario-matricula" type="number" value={novoFuncionario.matricula} onChange={e => setNovoFuncionario({
                      ...novoFuncionario,
                      matricula: e.target.value
                    })} placeholder="Ex: 12345" />
                    </div>
                    <div>
                      <Label htmlFor="funcionario-setor">Setor</Label>
                      <Select value={novoFuncionario.setor} onValueChange={value => setNovoFuncionario({
                      ...novoFuncionario,
                      setor: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent>
                          {setores.map(setor => <SelectItem key={setor} value={setor}>{setor}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="funcionario-whatsapp">Número WhatsApp (opcional)</Label>
                      <Input id="funcionario-whatsapp" value={novoFuncionario.numero_whatsapp} onChange={e => setNovoFuncionario({
                      ...novoFuncionario,
                      numero_whatsapp: e.target.value
                    })} placeholder="Ex: (11) 99999-9999" />
                    </div>
                    <Button className="w-full" onClick={handleAddFuncionario} disabled={isAddingFuncionario}>
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
                    <TableHead className="text-center">Em posse </TableHead>
                    <TableHead>Editar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingFuncionarios ? <TableRow>
                      <TableCell colSpan={6} className="text-center">Carregando funcionários...</TableCell>
                    </TableRow> : filteredFuncionarios.map(funcionario => <TableRow key={funcionario.id}>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => setEditingFuncionario(funcionario)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Funcionário</DialogTitle>
                              </DialogHeader>
                              {editingFuncionario && editingFuncionario.id === funcionario.id && <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-funcionario-nome">Nome do Funcionário</Label>
                                    <Input id="edit-funcionario-nome" value={editingFuncionario.nome} onChange={e => setEditingFuncionario({
                              ...editingFuncionario,
                              nome: e.target.value
                            })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-funcionario-matricula">Matrícula</Label>
                                    <Input id="edit-funcionario-matricula" type="number" value={editingFuncionario.matricula} onChange={e => setEditingFuncionario({
                              ...editingFuncionario,
                              matricula: Number(e.target.value)
                            })} />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-funcionario-setor">Setor</Label>
                                    <Select value={editingFuncionario.setor} onValueChange={value => setEditingFuncionario({
                              ...editingFuncionario,
                              setor: value
                            })}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {setores.map(setor => <SelectItem key={setor} value={setor}>{setor}</SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-funcionario-whatsapp">Número WhatsApp</Label>
                                    <Input id="edit-funcionario-whatsapp" value={editingFuncionario.numero_whatsapp} onChange={e => setEditingFuncionario({
                              ...editingFuncionario,
                              numero_whatsapp: e.target.value
                            })} />
                                  </div>
                                  <Button className="w-full" onClick={handleEditFuncionario}>
                                    Salvar Alterações
                                  </Button>
                                </div>}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};