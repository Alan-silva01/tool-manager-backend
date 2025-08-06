import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFerramentas } from '@/hooks/useFerramentas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
} from "@/components/ui/alert-dialog"
import { FerramentaCaracteristicas } from './FerramentaCaracteristicas';

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
}

interface FormData {
  ferramenta: {
    nome: string;
    tag: string;
    quantidade: string;
    categoria: string;
    caracteristicas: any;
  };
}

const EstoqueManager = () => {
  const [activeTab, setActiveTab] = useState('ferramentas');
  const [formData, setFormData] = useState<FormData>({
    ferramenta: {
      nome: '',
      tag: '',
      quantidade: '',
      categoria: '',
      caracteristicas: {}
    }
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const { ferramentas, loading, refetch } = useFerramentas(refreshKey);

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

// Função para capitalizar texto
const capitalizarTexto = (texto: string): string => {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

  const handleSubmitFerramenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ferramenta.nome || !formData.ferramenta.categoria || !formData.ferramenta.tag) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Capitalizar nome e categoria antes de salvar
      const dadosFormatados = {
        ...formData.ferramenta,
        nome: capitalizarTexto(formData.ferramenta.nome),
        categoria: capitalizarTexto(formData.ferramenta.categoria),
        caracteristicas: formData.ferramenta.caracteristicas || {}
      };

      const { error } = await supabase
        .from('ferramentas')
        .insert([dadosFormatados]);

      if (error) throw error;

      toast.success('Ferramenta adicionada com sucesso!');
      setFormData({
        ...formData,
        ferramenta: {
          nome: '',
          tag: '',
          quantidade: '',
          categoria: '',
          caracteristicas: {}
        }
      });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao adicionar ferramenta:', error);
      toast.error('Erro ao adicionar ferramenta');
    }
  };

  const handleDeleteFerramenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ferramentas')
        .delete()
        .match({ id: id });

      if (error) throw error;

      toast.success('Ferramenta removida com sucesso!');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao remover ferramenta:', error);
      toast.error('Erro ao remover ferramenta');
    }
  };

  return (
    <div className="container py-10">
      <Tabs defaultValue="ferramentas" className="w-[400px]" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="ferramentas">
          {loading ? (
            <p>Carregando ferramentas...</p>
          ) : (
            <>
            {activeTab === 'ferramentas' && (
              <div className="space-y-6">
                <form onSubmit={handleSubmitFerramenta} className="space-y-4 bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold">Adicionar Nova Ferramenta</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ferramenta-nome">Nome da Ferramenta *</Label>
                      <Input
                        id="ferramenta-nome"
                        type="text"
                        placeholder="Nome da ferramenta"
                        value={formData.ferramenta.nome}
                        onChange={(e) => setFormData({
                          ...formData,
                          ferramenta: { ...formData.ferramenta, nome: e.target.value }
                        })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ferramenta-tag">Tag/Código *</Label>
                      <Input
                        id="ferramenta-tag"
                        type="text"
                        placeholder="Tag ou código da ferramenta"
                        value={formData.ferramenta.tag}
                        onChange={(e) => setFormData({
                          ...formData,
                          ferramenta: { ...formData.ferramenta, tag: e.target.value }
                        })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ferramenta-quantidade">Quantidade *</Label>
                      <Input
                        id="ferramenta-quantidade"
                        type="number"
                        min="1"
                        placeholder="Quantidade disponível"
                        value={formData.ferramenta.quantidade}
                        onChange={(e) => setFormData({
                          ...formData,
                          ferramenta: { ...formData.ferramenta, quantidade: e.target.value }
                        })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ferramenta-categoria">Categoria *</Label>
                      <Input
                        id="ferramenta-categoria"
                        type="text"
                        placeholder="Categoria da ferramenta"
                        value={formData.ferramenta.categoria}
                        onChange={(e) => setFormData({
                          ...formData,
                          ferramenta: { ...formData.ferramenta, categoria: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>
                  
                  <FerramentaCaracteristicas
                    caracteristicas={formData.ferramenta.caracteristicas}
                    onChange={(caracteristicas) => setFormData({
                      ...formData,
                      ferramenta: { ...formData.ferramenta, caracteristicas }
                    })}
                  />
                  
                  <Button type="submit" className="w-full">
                    Adicionar Ferramenta
                  </Button>
                </form>

                <Table>
                  <TableCaption>Lista de Ferramentas</TableCaption>
                  <TableHead>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ferramentas.map((ferramenta) => (
                      <TableRow key={ferramenta.id}>
                        <TableCell>{ferramenta.nome}</TableCell>
                        <TableCell>{ferramenta.tag}</TableCell>
                        <TableCell>{ferramenta.quantidade}</TableCell>
                        <TableCell>{ferramenta.categoria}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">Remover</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá remover a ferramenta permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteFerramenta(ferramenta.id)}>Remover</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </>
          )}
        </TabsContent>
        <TabsContent value="estoque">
          <p>Gerenciar estoque aqui.</p>
        </TabsContent>
        <TabsContent value="historico">
          <p>Visualizar histórico aqui.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManager;
