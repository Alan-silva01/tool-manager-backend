import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useMateriais } from "@/hooks/useMateriais";

type Material = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
  unidade: string;
};

const Relatorios = () => {
  const { materiais, loading, error } = useMateriais();

  if (loading) {
    return <div>Carregando relatórios...</div>;
  }

  if (error) {
    return <div>Erro ao carregar relatórios: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <EstoqueBaixo materiais={materiais} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Materiais por Categoria</h3>
        {Object.entries(
          materiais.reduce((acc, material) => {
            const categoria = material.categoria || 'Sem categoria';
            if (!acc[categoria]) acc[categoria] = [];
            acc[categoria].push(material);
            return acc;
          }, {} as Record<string, Material[]>)
        ).map(([categoria, materiaisCategoria]) => (
          <Card key={categoria}>
            <CardHeader>
              <CardTitle className="text-base">{categoria}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materiaisCategoria.map((material) => (
                  <div key={material.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">{material.nome}</span>
                      <p className="text-sm text-muted-foreground">{material.descricao}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        material.quantidade_disponivel !== undefined && 
                        material.quantidade_minima !== undefined && 
                        material.quantidade_disponivel <= material.quantidade_minima 
                          ? "destructive" 
                          : "default"
                      }>
                        {material.quantidade_disponivel ?? 0} {material.unidade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EstoqueBaixo = ({ materiais }: { materiais: Material[] }) => {
  const materiaisEstoqueBaixo = materiais.filter(material => 
    material.quantidade_disponivel !== undefined && 
    material.quantidade_minima !== undefined && 
    material.quantidade_disponivel <= material.quantidade_minima
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Estoque Baixo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {materiaisEstoqueBaixo.length > 0 ? (
          <div className="space-y-2">
            {materiaisEstoqueBaixo.map((material) => (
              <div key={material.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <div>
                  <span className="font-medium">{material.nome}</span>
                  <p className="text-sm text-muted-foreground">{material.categoria}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">
                    {material.quantidade_disponivel} {material.unidade}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Mín: {material.quantidade_minima} {material.unidade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum material com estoque baixo</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Relatorios;
