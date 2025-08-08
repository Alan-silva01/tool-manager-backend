
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, Search } from "lucide-react";
import { CadastroFerramenta } from "./CadastroFerramenta";

interface Material {
  id: string;
  nome: string;
  tag?: number;
  entrada: number;
  saida: number;
  quantidade_minima: number;
  estoque_baixo?: boolean;
}

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  quantidade: number;
  categoria: string;
  caracteristicas: any;
  saiu: number;
  reserva?: boolean;
  matricula_reserva?: string;
}

interface EstoqueManagerProps {
  materiais: Material[];
  ferramentas: Ferramenta[];
  onRefresh: () => void;
}

export const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCadastroFerramenta, setShowCadastroFerramenta] = useState(false);

  // Filtrar ferramentas com base no termo de busca
  const filteredFerramentas = ferramentas.filter(ferramenta =>
    ferramenta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar materiais com base no termo de busca
  const filteredMateriais = materiais.filter(material =>
    material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (material.tag && material.tag.toString().includes(searchTerm))
  );

  const handleCadastroSuccess = () => {
    setShowCadastroFerramenta(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie ferramentas e materiais</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowCadastroFerramenta(!showCadastroFerramenta)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Ferramenta
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Formulário de cadastro de ferramenta (condicional) */}
      {showCadastroFerramenta && (
        <CadastroFerramenta onSuccess={handleCadastroSuccess} />
      )}

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome, tag ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs para Ferramentas e Materiais */}
      <Tabs defaultValue="ferramentas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ferramentas">
            Ferramentas ({filteredFerramentas.length})
          </TabsTrigger>
          <TabsTrigger value="materiais">
            Materiais ({filteredMateriais.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Ferramentas */}
        <TabsContent value="ferramentas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFerramentas.map((ferramenta) => (
              <Card key={ferramenta.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{ferramenta.nome}</CardTitle>
                      <CardDescription>Tag: {ferramenta.tag}</CardDescription>
                    </div>
                    <Badge variant="secondary">{ferramenta.categoria}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disponível:</span>
                      <span className="font-medium">{ferramenta.quantidade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Emprestadas:</span>
                      <span className="font-medium">{ferramenta.saiu}</span>
                    </div>
                    {ferramenta.reserva && (
                      <Badge variant="outline" className="text-xs">
                        Reservada - {ferramenta.matricula_reserva}
                      </Badge>
                    )}
                    {ferramenta.caracteristicas && Object.keys(ferramenta.caracteristicas).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium mb-2">Características:</p>
                        <div className="space-y-1">
                          {Object.entries(ferramenta.caracteristicas).map(([key, value]) => (
                            <div key={key} className="text-xs flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredFerramentas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma ferramenta encontrada
            </div>
          )}
        </TabsContent>

        {/* Tab Materiais */}
        <TabsContent value="materiais">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMateriais.map((material) => (
              <Card key={material.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{material.nome}</CardTitle>
                      {material.tag && (
                        <CardDescription>Tag: {material.tag}</CardDescription>
                      )}
                    </div>
                    {material.estoque_baixo && (
                      <Badge variant="destructive">Estoque Baixo</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disponível:</span>
                      <span className="font-medium">{material.entrada - material.saida}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Entrada:</span>
                      <span className="font-medium">{material.entrada}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Saída:</span>
                      <span className="font-medium">{material.saida}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mínimo:</span>
                      <span className="font-medium">{material.quantidade_minima}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMateriais.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum material encontrado
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
