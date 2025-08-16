
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Package, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EstoqueManagerProps {
  materiais: any[];
  ferramentas: any[];
  onRefresh: () => void;
}

export const EstoqueManager = ({ materiais, ferramentas, onRefresh }: EstoqueManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Converte diferentes formatos de "caracteristicas" (string/array/objeto/boolean/number)
  // em um texto seguro para renderização no JSX.
  const formatCaracteristicas = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
      // Junta itens do array como texto
      return value
        .map((item) => {
          if (item === null || item === undefined) return '';
          if (typeof item === 'string') return item;
          if (typeof item === 'number' || typeof item === 'boolean') return String(item);
          // Se for objeto dentro do array, transforma em "chave: valor"
          if (typeof item === 'object') {
            return Object.entries(item as Record<string, unknown>)
              .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}`)
              .join(', ');
          }
          return '';
        })
        .filter(Boolean)
        .join(' • ');
    }
    if (typeof value === 'object') {
      // Objeto simples -> "chave: valor • chave2: valor2"
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '';
      return entries
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}`)
        .join(' • ');
    }
    // Fallback geral
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredMateriais = materiais.filter(material =>
    material.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFerramentas = ferramentas.filter(ferramenta =>
    ferramenta.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with search and refresh */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome, categoria ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Materiais ({filteredMateriais.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMateriais.map((material) => {
              const caracteristicasTexto = formatCaracteristicas(material.caracteristicas);
              return (
                <div key={material.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{material.nome}</h3>
                    <Badge variant={material.quantidade > 0 ? "default" : "destructive"}>
                      {material.quantidade} un.
                    </Badge>
                  </div>
                  {material.categoria && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Categoria: {material.categoria}
                    </p>
                  )}
                  {caracteristicasTexto && (
                    <p className="text-xs text-muted-foreground">
                      {caracteristicasTexto}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {filteredMateriais.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum material encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Ferramentas ({filteredFerramentas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFerramentas.map((ferramenta) => {
              const caracteristicasTexto = formatCaracteristicas(ferramenta.caracteristicas);
              return (
                <div key={ferramenta.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{ferramenta.nome}</h3>
                    <Badge variant={ferramenta.quantidade > 0 ? "default" : "destructive"}>
                      {ferramenta.quantidade} un.
                    </Badge>
                  </div>
                  {ferramenta.tag && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Tag: {ferramenta.tag}
                    </p>
                  )}
                  {ferramenta.categoria && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Categoria: {ferramenta.categoria}
                    </p>
                  )}
                  {caracteristicasTexto && (
                    <p className="text-xs text-muted-foreground">
                      {caracteristicasTexto}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {filteredFerramentas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma ferramenta encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
