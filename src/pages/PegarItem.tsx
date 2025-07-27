import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { useFerramentas } from "@/hooks/useFerramentas";
import { useMateriais } from "@/hooks/useMateriais";

interface Material {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
  unidade: string;
}

interface Ferramenta {
  id: string;
  nome: string;
  tag: string;
  categoria: string;
  disponivel: boolean;
}

const PegarItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { buscarFuncionario } = useFuncionarios();
  const { ferramentas } = useFerramentas();
  const { materiais } = useMateriais();

  const [step, setStep] = useState<'busca' | 'funcionario'>('busca');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<Material | Ferramenta | null>(null);
  const [matricula, setMatricula] = useState('');
  const [funcionario, setFuncionario] = useState<any>(null);

  const isMaterial = (item: any): item is Material => {
  return 'unidade' in item;
};

const isFerramenta = (item: any): item is Ferramenta => {
  return 'tag' in item;
};

  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    const results = [
      ...ferramentas.filter(ferramenta => ferramenta.nome.toLowerCase().includes(normalizedQuery) || ferramenta.tag.toLowerCase().includes(normalizedQuery)),
      ...materiais.filter(material => material.nome.toLowerCase().includes(normalizedQuery) || material.categoria.toLowerCase().includes(normalizedQuery))
    ];

    setSearchResults(results);
  };

  const handleMatriculaSubmit = () => {
    const func = buscarFuncionario(matricula);
    if (func) {
      setFuncionario(func);
      toast({
        title: "Funcionário encontrado!",
        description: `Bem-vindo, ${func.nome}`,
      });
      navigate('/');
    } else {
      toast({
        title: "Matrícula não encontrada",
        description: "Verifique a matrícula digitada",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Pegar Item</h1>
          <p className="text-sm text-primary-foreground/80">
            {step === 'busca' && 'Busque o item desejado'}
            {step === 'funcionario' && 'Informe sua matrícula'}
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-md lg:max-w-lg">
        {/* Busca de Item */}
        {step === 'busca' && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar Item</Label>
                  <Input
                    id="search"
                    placeholder="Nome ou TAG"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleSearch}>
                  Buscar
                </Button>
              </CardContent>
            </Card>

            {searchResults.length > 0 && (
  <div className="space-y-2">
    <h3 className="font-semibold">Resultados da busca:</h3>
    {searchResults.map((item) => (
      <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold">{item.nome}</h4>
              {isFerramenta(item) && (
                <Badge variant="outline" className="mt-1">
                  TAG: {item.tag}
                </Badge>
              )}
              {isMaterial(item) && item.quantidade_disponivel !== undefined && (
                <Badge variant={item.quantidade_disponivel > 0 ? "default" : "destructive"} className="mt-1">
                  Disponível: {item.quantidade_disponivel}
                </Badge>
              )}
              {item.categoria && (
                <Badge variant="secondary" className="mt-1 ml-2">
                  {item.categoria}
                </Badge>
              )}
            </div>
            <div className="text-right">
              {isFerramenta(item) && (
                <Badge variant={item.disponivel ? "default" : "destructive"}>
                  {item.disponivel ? "Disponível" : "Em uso"}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}

            {selectedItem && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="w-5 h-5" />
        {selectedItem.nome}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {isFerramenta(selectedItem) && (
        <>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">TAG:</span>
            <Badge variant="outline">{selectedItem.tag}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={selectedItem.disponivel ? "default" : "destructive"}>
              {selectedItem.disponivel ? "Disponível" : "Em uso"}
            </Badge>
          </div>
        </>
      )}
      
      {isMaterial(selectedItem) && selectedItem.quantidade_disponivel !== undefined && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Quantidade disponível:</span>
          <Badge variant={selectedItem.quantidade_disponivel > 0 ? "default" : "destructive"}>
            {selectedItem.quantidade_disponivel} {selectedItem.unidade}
          </Badge>
        </div>
      )}

      {selectedItem.categoria && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Categoria:</span>
          <Badge variant="secondary">{selectedItem.categoria}</Badge>
        </div>
      )}

      {selectedItem.descricao && (
        <div>
          <span className="text-sm text-muted-foreground block mb-1">Descrição:</span>
          <p className="text-sm">{selectedItem.descricao}</p>
        </div>
      )}

      {isFerramenta(selectedItem) && selectedItem.disponivel && (
        <Button 
          className="w-full" 
          onClick={() => setStep('funcionario')}
        >
          Pegar Ferramenta
        </Button>
      )}
      
      {isMaterial(selectedItem) && selectedItem.quantidade_disponivel !== undefined && selectedItem.quantidade_disponivel > 0 && (
        <Button 
          className="w-full" 
          onClick={() => setStep('funcionario')}
        >
          Pegar Material
        </Button>
      )}
    </CardContent>
  </Card>
)}
          </div>
        )}

        {/* Identificação do Funcionário */}
        {step === 'funcionario' && (
          <div className="space-y-4 mt-6">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="matricula">Sua Matrícula</Label>
                  <Input
                    id="matricula"
                    placeholder="Digite sua matrícula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="text-center text-lg"
                  />
                </div>
                <Button className="w-full" onClick={handleMatriculaSubmit}>
                  Confirmar Matrícula
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
