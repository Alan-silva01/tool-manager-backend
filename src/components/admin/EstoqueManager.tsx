import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Ferramenta } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Edit, Trash2 } from "lucide-react";
import { useFerramentas } from "@/hooks/useFerramentas";
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
import { supabase } from "@/integrations/supabase/client";
import { useMaterial } from "@/hooks/useMaterial";
import { Material } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

interface EstoqueManagerProps {
  onRefresh: () => void;
}

export function EstoqueManager({ onRefresh }: EstoqueManagerProps) {
  const [searchFerramenta, setSearchFerramenta] = useState("");
  const [searchMaterial, setSearchMaterial] = useState("");
  const [activeTab, setActiveTab] = useState("ferramentas");
  const { toast } = useToast();
  const { ferramentas, loading, refetch } = useFerramentas();
  const { materiais, loading: loadingMateriais, refetch: refetchMateriais } = useMaterial();
  const [isCreateFerramentaDialogOpen, setCreateFerramentaDialogOpen] =
    useState(false);
  const [isCreateMaterialDialogOpen, setCreateMaterialDialogOpen] =
    useState(false);
  const [editFerramentaDialogOpen, setEditFerramentaDialogOpen] =
    useState(false);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editMaterialDialogOpen, setEditMaterialDialogOpen] = useState(false);

  const filteredFerramentas = ferramentas.filter((ferramenta) =>
    ferramenta.nome.toLowerCase().includes(searchFerramenta.toLowerCase())
  );

  const filteredMateriais = materiais.filter((material) =>
    material.nome.toLowerCase().includes(searchMaterial.toLowerCase())
  );

  const handleDeleteFerramenta = async (id: string) => {
    try {
      const { error } = await supabase.from("ferramentas").delete().eq("id", id);

      if (error) {
        toast({
          title: "Erro ao deletar ferramenta.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ferramenta deletada com sucesso!",
      });
      refetch();
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao deletar ferramenta.",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase.from("materiais").delete().eq("id", id);

      if (error) {
        toast({
          title: "Erro ao deletar material.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Material deletado com sucesso!",
      });
      refetchMateriais();
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao deletar material.",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">
            Gerencie o estoque de ferramentas e materiais.
          </p>
        </div>
      </div>
      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="ferramentas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Controle de Ferramentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-y-2">
                <Input
                  placeholder="Buscar ferramenta..."
                  value={searchFerramenta}
                  onChange={(e) => setSearchFerramenta(e.target.value)}
                />
                <Button
                  onClick={() => setCreateFerramentaDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Ferramenta
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFerramentas.map((ferramenta) => (
                      <TableRow key={ferramenta.id}>
                        <TableCell className="font-medium">{ferramenta.nome}</TableCell>
                        <TableCell>{ferramenta.tag}</TableCell>
                        <TableCell>{ferramenta.categoria}</TableCell>
                        <TableCell>{ferramenta.quantidade}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ferramenta.status?.toLowerCase() === 'disponivel' || ferramenta.status?.toLowerCase() === 'disponível'
                              ? 'bg-green-100 text-green-800'
                              : ferramenta.status?.toLowerCase() === 'emprestada' || ferramenta.status?.toLowerCase() === 'emprestado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : ferramenta.status?.toLowerCase() === 'manutencao' || ferramenta.status?.toLowerCase() === 'manutenção'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ferramenta.status || 'Não definido'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingFerramenta(ferramenta);
                                setEditFerramentaDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFerramenta(ferramenta.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Materiais</CardTitle>
              <CardDescription>
                Gerencie os materiais de estoque da empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-y-2">
                <Input
                  placeholder="Buscar material..."
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                />
                <Button
                  onClick={() => setCreateMaterialDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Material
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Quantidade Mínima</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMateriais.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.nome}</TableCell>
                        <TableCell>{material.tag}</TableCell>
                        <TableCell>{material.quantidade}</TableCell>
                        <TableCell>{material.quantidade_minima}</TableCell>
                        <TableCell>{material.unidade}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMaterial(material);
                                setEditMaterialDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateFerramentaDialog
        open={isCreateFerramentaDialogOpen}
        setOpen={setCreateFerramentaDialogOpen}
        onRefresh={onRefresh}
      />

      <CreateMaterialDialog
        open={isCreateMaterialDialogOpen}
        setOpen={setCreateMaterialDialogOpen}
        onRefresh={onRefresh}
      />

      <EditFerramentaDialog
        open={editFerramentaDialogOpen}
        setOpen={setEditFerramentaDialogOpen}
        ferramenta={editingFerramenta}
        onRefresh={onRefresh}
      />

      <EditMaterialDialog
        open={editMaterialDialogOpen}
        setOpen={setEditMaterialDialogOpen}
        material={editingMaterial}
        onRefresh={onRefresh}
      />
    </div>
  );
}

interface CreateFerramentaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

function CreateFerramentaDialog({
  open,
  setOpen,
  onRefresh,
}: CreateFerramentaDialogProps) {
  const [nome, setNome] = useState("");
  const [tag, setTag] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const { toast } = useToast();

  const handleCreateFerramenta = async () => {
    try {
      const { error } = await supabase.from("ferramentas").insert([
        {
          nome,
          tag,
          quantidade,
          categoria,
          caracteristicas: JSON.parse(caracteristicas),
        },
      ]);

      if (error) {
        toast({
          title: "Erro ao criar ferramenta.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ferramenta criada com sucesso!",
      });
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao criar ferramenta.",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Criar Ferramenta</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para criar uma nova ferramenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade" className="text-right">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoria" className="text-right">
              Categoria
            </Label>
            <Input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caracteristicas" className="text-right">
              Características (JSON)
            </Label>
            <Input
              id="caracteristicas"
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateFerramenta}>
            Criar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CreateMaterialDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefresh: () => void;
}

function CreateMaterialDialog({
  open,
  setOpen,
  onRefresh,
}: CreateMaterialDialogProps) {
  const [nome, setNome] = useState("");
  const [tag, setTag] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [quantidade_minima, setQuantidadeMinima] = useState(0);
  const [unidade, setUnidade] = useState("");
  const { toast } = useToast();

  const handleCreateMaterial = async () => {
    try {
      const { error } = await supabase.from("materiais").insert([
        {
          nome,
          tag,
          quantidade,
          quantidade_minima,
          unidade,
          entrada: quantidade,
          saida: 0,
        },
      ]);

      if (error) {
        toast({
          title: "Erro ao criar material.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Material criado com sucesso!",
      });
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao criar material.",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Criar Material</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para criar um novo material.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade" className="text-right">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade_minima" className="text-right">
              Quantidade Mínima
            </Label>
            <Input
              id="quantidade_minima"
              type="number"
              value={quantidade_minima}
              onChange={(e) => setQuantidadeMinima(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unidade" className="text-right">
              Unidade
            </Label>
            <Input
              id="unidade"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateMaterial}>
            Criar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface EditFerramentaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ferramenta: Ferramenta | null;
  onRefresh: () => void;
}

function EditFerramentaDialog({
  open,
  setOpen,
  ferramenta,
  onRefresh,
}: EditFerramentaDialogProps) {
  const [nome, setNome] = useState(ferramenta?.nome || "");
  const [tag, setTag] = useState(ferramenta?.tag || "");
  const [quantidade, setQuantidade] = useState(ferramenta?.quantidade || 0);
  const [categoria, setCategoria] = useState(ferramenta?.categoria || "");
  const [caracteristicas, setCaracteristicas] = useState(
    JSON.stringify(ferramenta?.caracteristicas) || ""
  );
  const [status, setStatus] = useState(ferramenta?.status || "disponivel");
  const { toast } = useToast();

  useEffect(() => {
    if (ferramenta) {
      setNome(ferramenta.nome || "");
      setTag(ferramenta.tag || "");
      setQuantidade(ferramenta.quantidade || 0);
      setCategoria(ferramenta.categoria || "");
      setCaracteristicas(JSON.stringify(ferramenta.caracteristicas) || "");
      setStatus(ferramenta.status || "disponivel");
    }
  }, [ferramenta]);

  const handleEditFerramenta = async () => {
    if (!ferramenta) return;

    try {
      const { error } = await supabase
        .from("ferramentas")
        .update({
          nome,
          tag,
          quantidade,
          categoria,
          caracteristicas: JSON.parse(caracteristicas),
          status,
        })
        .eq("id", ferramenta.id);

      if (error) {
        toast({
          title: "Erro ao editar ferramenta.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ferramenta editada com sucesso!",
      });
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao editar ferramenta.",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Ferramenta</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para editar a ferramenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade" className="text-right">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoria" className="text-right">
              Categoria
            </Label>
            <Input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caracteristicas" className="text-right">
              Características (JSON)
            </Label>
            <Input
              id="caracteristicas"
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="emprestada">Emprestada</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleEditFerramenta}>
            Salvar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface EditMaterialDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  material: Material | null;
  onRefresh: () => void;
}

function EditMaterialDialog({
  open,
  setOpen,
  material,
  onRefresh,
}: EditMaterialDialogProps) {
  const [nome, setNome] = useState(material?.nome || "");
  const [tag, setTag] = useState(material?.tag || "");
  const [quantidade, setQuantidade] = useState(material?.quantidade || 0);
  const [quantidade_minima, setQuantidadeMinima] = useState(
    material?.quantidade_minima || 0
  );
  const [unidade, setUnidade] = useState(material?.unidade || "");
  const { toast } = useToast();

  useEffect(() => {
    if (material) {
      setNome(material.nome || "");
      setTag(material.tag || "");
      setQuantidade(material.quantidade || 0);
      setQuantidadeMinima(material.quantidade_minima || 0);
      setUnidade(material.unidade || "");
    }
  }, [material]);

  const handleEditMaterial = async () => {
    if (!material) return;

    try {
      const { error } = await supabase
        .from("materiais")
        .update({
          nome,
          tag,
          quantidade,
          quantidade_minima,
          unidade,
        })
        .eq("id", material.id);

      if (error) {
        toast({
          title: "Erro ao editar material.",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Material editado com sucesso!",
      });
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast({
        title: "Erro ao editar material.",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Material</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para editar o material.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-right">
              Tag
            </Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade" className="text-right">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantidade_minima" className="text-right">
              Quantidade Mínima
            </Label>
            <Input
              id="quantidade_minima"
              type="number"
              value={quantidade_minima}
              onChange={(e) => setQuantidadeMinima(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unidade" className="text-right">
              Unidade
            </Label>
            <Input
              id="unidade"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleEditMaterial}>
            Salvar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
