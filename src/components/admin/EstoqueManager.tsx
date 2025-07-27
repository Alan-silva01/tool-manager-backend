import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, Wrench } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

type Material = {
  id: string;
  nome: string;
  tag: string;
  entrada: number;
  quantidade_minima: number;
  data_entrada_estoque: string;
  saida: number;
  unidade: string;
};

type Ferramenta = {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
};

type Funcionario = {
  id: string;
  nome: string;
  matricula: string;
  setor: string;
  numero_whatsapp: string;
  posse_ferramentas: string[];
};

const EstoqueManager = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [novoMaterial, setNovoMaterial] = useState({
    nome: '',
    tag: '',
    entrada: 0,
    quantidade_minima: 0,
    data_entrada_estoque: '',
    saida: 0,
    unidade: 'un'
  });
  const [novaFerramenta, setNovaFerramenta] = useState({
    nome: '',
    tag: '',
    quantidade: 0
  });
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    matricula: '',
    setor: '',
    numero_whatsapp: '',
    posse_ferramentas: []
  });

  const [materialEditando, setMaterialEditando] = useState<Material | null>(null);
  const [ferramentaEditando, setFerramentaEditando] = useState<Ferramenta | null>(null);
  const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null);

  const setoresPermitidos = [
    "Usinagem industrial",
    "Oficina cantilever", 
    "Oficina de guias",
    "Montagem de gaiola",
    "Oficina de mancal",
    "Usinagem de cilindros",
    "Oficina central"
  ] as const;

  type SetorPermitido = typeof setoresPermitidos[number];

  const fetchMateriais = async () => {
    try {
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        return;
      }

      if (data) {
        setMateriais(data);
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
    }
  };

  const fetchFerramentas = async () => {
    try {
      const { data, error } = await supabase
        .from('ferramentas')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar ferramentas:', error);
        return;
      }

      if (data) {
        setFerramentas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        return;
      }

      if (data) {
        setFuncionarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  useEffect(() => {
    fetchMateriais();
    fetchFerramentas();
    fetchFuncionarios();
  }, []);

  const adicionarMaterial = async () => {
    if (!novoMaterial.nome || !novoMaterial.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('materiais')
        .insert([novoMaterial]);

      if (error) {
        console.error('Erro ao adicionar material:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material adicionado com sucesso!",
      });

      setNovoMaterial({
        nome: '',
        tag: '',
        entrada: 0,
        quantidade_minima: 0,
        data_entrada_estoque: '',
        saida: 0,
        unidade: 'un'
      });

      await fetchMateriais();
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar material",
        variant: "destructive",
      });
    }
  };

  const editarMaterial = async () => {
    if (!materialEditando || !materialEditando.nome || !materialEditando.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('materiais')
        .update(materialEditando)
        .eq('id', materialEditando.id);

      if (error) {
        console.error('Erro ao editar material:', error);
        toast({
          title: "Erro",
          description: "Erro ao editar material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material editado com sucesso!",
      });

      setMaterialEditando(null);
      await fetchMateriais();
    } catch (error) {
      console.error('Erro ao editar material:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar material",
        variant: "destructive",
      });
    }
  };

  const removerMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materiais')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover material:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover material",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Material removido com sucesso!",
      });

      await fetchMateriais();
    } catch (error) {
      console.error('Erro ao remover material:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover material",
        variant: "destructive",
      });
    }
  };

  const adicionarFerramenta = async () => {
    if (!novaFerramenta.nome || !novaFerramenta.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ferramentas')
        .insert([novaFerramenta]);

      if (error) {
        console.error('Erro ao adicionar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta adicionada com sucesso!",
      });

      setNovaFerramenta({
        nome: '',
        tag: '',
        quantidade: 0
      });

      await fetchFerramentas();
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar ferramenta",
        variant: "destructive",
      });
    }
  };

  const editarFerramenta = async () => {
    if (!ferramentaEditando || !ferramentaEditando.nome || !ferramentaEditando.tag) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ferramentas')
        .update(ferramentaEditando)
        .eq('id', ferramentaEditando.id);

      if (error) {
        console.error('Erro ao editar ferramenta:', error);
        toast({
          title: "Erro",
          description: "Erro ao editar ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta editada com sucesso!",
      });

      setFerramentaEditando(null);
      await fetchFerramentas();
    } catch (error) {
      console.error('Erro ao editar ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar ferramenta",
        variant: "destructive",
      });
    }
  };

  const removerFerramenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ferramentas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover ferramenta:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover ferramenta",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Ferramenta removida com sucesso!",
      });

      await fetchFerramentas();
    } catch (error) {
      console.error('Erro ao remover ferramenta:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover ferramenta",
        variant: "destructive",
      });
    }
  };

  const adicionarFuncionario = async () => {
    if (!novoFuncionario.nome || !novoFuncionario.matricula || !novoFuncionario.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const funcionarioData = {
        nome: novoFuncionario.nome,
        matricula: Number(novoFuncionario.matricula),
        setor: novoFuncionario.setor as SetorPermitido,
        numero_whatsapp: novoFuncionario.numero_whatsapp || '',
        posse_ferramentas: []
      };

      const { error } = await supabase
        .from('funcionarios')
        .insert([funcionarioData]);

      if (error) {
        console.error('Erro ao adicionar funcionário:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar funcionário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário adicionado com sucesso!",
      });

      setNovoFuncionario({
        nome: '',
        matricula: '',
        setor: '',
        numero_whatsapp: '',
        posse_ferramentas: []
      });

      await fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar funcionário",
        variant: "destructive",
      });
    }
  };

  const editarFuncionario = async () => {
    if (!funcionarioEditando || !funcionarioEditando.nome || !funcionarioEditando.matricula || !funcionarioEditando.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const funcionarioData = {
        nome: funcionarioEditando.nome,
        matricula: Number(funcionarioEditando.matricula),
        setor: funcionarioEditando.setor as SetorPermitido,
        numero_whatsapp: funcionarioEditando.numero_whatsapp || '',
        posse_ferramentas: funcionarioEditando.posse_ferramentas || []
      };

      const { error } = await supabase
        .from('funcionarios')
        .update(funcionarioData)
        .eq('id', funcionarioEditando.id);

      if (error) {
        console.error('Erro ao editar funcionário:', error);
        toast({
          title: "Erro",
          description: "Erro ao editar funcionário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário editado com sucesso!",
      });

      setFuncionarioEditando(null);
      await fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao editar funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao editar funcionário",
        variant: "destructive",
      });
    }
  };

  const removerFuncionario = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover funcionário:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover funcionário",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso!",
      });

      await fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao remover funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover funcionário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="materiais" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>

        {/* Materiais Tab */}
        <TabsContent value="materiais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Adicionar Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Tag"
                  />
                </div>
                <div>
                  <Label htmlFor="entrada">Entrada</Label>
                  <Input
                    id="entrada"
                    type="number"
                    value={novoMaterial.entrada}
                    onChange={(e) => setNovoMaterial({...novoMaterial, entrada: Number(e.target.value)})}
                    placeholder="Entrada"
                  />
                </div>
                <div>
                  <Label htmlFor="saida">Saída</Label>
                  <Input
                    id="saida"
                    type="number"
                    value={novoMaterial.saida}
                    onChange={(e) => setNovoMaterial({...novoMaterial, saida: Number(e.target.value)})}
                    placeholder="Saída"
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                  <Input
                    id="quantidade_minima"
                    type="number"
                    value={novoMaterial.quantidade_minima}
                    onChange={(e) => setNovoMaterial({...novoMaterial, quantidade_minima: Number(e.target.value)})}
                    placeholder="Quantidade Mínima"
                  />
                </div>
                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input
                    id="unidade"
                    value={novoMaterial.unidade}
                    onChange={(e) => setNovoMaterial({...novoMaterial, unidade: e.target.value})}
                    placeholder="Unidade"
                  />
                </div>
              </div>
              <Button onClick={adicionarMaterial}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Material
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Lista de Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {materiais.map((material) => (
                  <div key={material.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{material.nome}</p>
                      <p className="text-sm text-muted-foreground">TAG: {material.tag}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setMaterialEditando(material)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removerMaterial(material.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ferramentas Tab */}
        <TabsContent value="ferramentas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Adicionar Ferramenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Tag"
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={novaFerramenta.quantidade}
                    onChange={(e) => setNovaFerramenta({...novaFerramenta, quantidade: Number(e.target.value)})}
                    placeholder="Quantidade"
                  />
                </div>
              </div>
              <Button onClick={adicionarFerramenta}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Ferramenta
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Lista de Ferramentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {ferramentas.map((ferramenta) => (
                  <div key={ferramenta.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ferramenta.nome}</p>
                      <p className="text-sm text-muted-foreground">TAG: {ferramenta.tag}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setFerramentaEditando(ferramenta)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removerFerramenta(ferramenta.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funcionários Tab */}
        <TabsContent value="funcionarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Adicionar Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Matrícula"
                  />
                </div>
                <div>
                  <Label htmlFor="setor">Setor</Label>
                  <Select value={novoFuncionario.setor} onValueChange={(value) => setNovoFuncionario({...novoFuncionario, setor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresPermitidos.map((setor) => (
                        <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={novoFuncionario.numero_whatsapp}
                    onChange={(e) => setNovoFuncionario({...novoFuncionario, numero_whatsapp: e.target.value})}
                    placeholder="Número do WhatsApp"
                  />
                </div>
              </div>
              <Button onClick={adicionarFuncionario}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Lista de Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {funcionarios.map((funcionario) => (
                  <div key={funcionario.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{funcionario.nome}</p>
                      <p className="text-sm text-muted-foreground">Matrícula: {funcionario.matricula}</p>
                      <p className="text-sm text-muted-foreground">Setor: {funcionario.setor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setFuncionarioEditando(funcionario)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removerFuncionario(funcionario.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Material Dialog */}
      <Dialog open={!!materialEditando} onOpenChange={() => setMaterialEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={materialEditando?.nome || ''}
                onChange={(e) => setMaterialEditando({...materialEditando!, nome: e.target.value})}
                placeholder="Nome do material"
              />
            </div>
            <div>
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={materialEditando?.tag || ''}
                onChange={(e) => setMaterialEditando({...materialEditando!, tag: e.target.value})}
                placeholder="Tag"
              />
            </div>
            <div>
              <Label htmlFor="entrada">Entrada</Label>
              <Input
                id="entrada"
                type="number"
                value={materialEditando?.entrada || 0}
                onChange={(e) => setMaterialEditando({...materialEditando!, entrada: Number(e.target.value)})}
                placeholder="Entrada"
              />
            </div>
            <div>
              <Label htmlFor="saida">Saída</Label>
              <Input
                id="saida"
                type="number"
                value={materialEditando?.saida || 0}
                onChange={(e) => setMaterialEditando({...materialEditando!, saida: Number(e.target.value)})}
                placeholder="Saída"
              />
            </div>
            <div>
              <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
              <Input
                id="quantidade_minima"
                type="number"
                value={materialEditando?.quantidade_minima || 0}
                onChange={(e) => setMaterialEditando({...materialEditando!, quantidade_minima: Number(e.target.value)})}
                placeholder="Quantidade Mínima"
              />
            </div>
            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Input
                id="unidade"
                value={materialEditando?.unidade || ''}
                onChange={(e) => setMaterialEditando({...materialEditando!, unidade: e.target.value})}
                placeholder="Unidade"
              />
            </div>
          </div>
          <Button onClick={editarMaterial}>
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Ferramenta Dialog */}
      <Dialog open={!!ferramentaEditando} onOpenChange={() => setFerramentaEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ferramenta</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={ferramentaEditando?.nome || ''}
                onChange={(e) => setFerramentaEditando({...ferramentaEditando!, nome: e.target.value})}
                placeholder="Nome da ferramenta"
              />
            </div>
            <div>
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={ferramentaEditando?.tag || ''}
                onChange={(e) => setFerramentaEditando({...ferramentaEditando!, tag: e.target.value})}
                placeholder="Tag"
              />
            </div>
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={ferramentaEditando?.quantidade || 0}
                onChange={(e) => setFerramentaEditando({...ferramentaEditando!, quantidade: Number(e.target.value)})}
                placeholder="Quantidade"
              />
            </div>
          </div>
          <Button onClick={editarFerramenta}>
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Funcionario Dialog */}
      <Dialog open={!!funcionarioEditando} onOpenChange={() => setFuncionarioEditando(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={funcionarioEditando?.nome || ''}
                onChange={(e) => setFuncionarioEditando({...funcionarioEditando!, nome: e.target.value})}
                placeholder="Nome do funcionário"
              />
            </div>
            <div>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                value={funcionarioEditando?.matricula || ''}
                onChange={(e) => setFuncionarioEditando({...funcionarioEditando!, matricula: e.target.value})}
                placeholder="Matrícula"
              />
            </div>
            <div>
              <Label htmlFor="setor">Setor</Label>
              <Select value={funcionarioEditando?.setor || ''} onValueChange={(value) => setFuncionarioEditando({...funcionarioEditando!, setor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {setoresPermitidos.map((setor) => (
                    <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={funcionarioEditando?.numero_whatsapp || ''}
                onChange={(e) => setFuncionarioEditando({...funcionarioEditando!, numero_whatsapp: e.target.value})}
                placeholder="Número do WhatsApp"
              />
            </div>
          </div>
          <Button onClick={editarFuncionario}>
            Salvar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstoqueManager;
