
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface CaracteristicaItem {
  chave: string;
  valor: string;
}

interface FerramentaCaracteristicasProps {
  caracteristicas: any;
  onChange: (caracteristicas: any) => void;
}

// Função para capitalizar primeira letra de cada palavra
const capitalizarTexto = (texto: string): string => {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

// Função para formatar valor baseado na chave
const formatarValor = (chave: string, valor: string): string | number | boolean | object => {
  const chaveMinuscula = chave.toLowerCase();
  
  // Campos booleanos
  if (chaveMinuscula.includes('protetor') || 
      chaveMinuscula.includes('chave') ||
      chaveMinuscula.includes('segurança') ||
      valor.toLowerCase() === 'sim' ||
      valor.toLowerCase() === 'não' ||
      valor.toLowerCase() === 'true' ||
      valor.toLowerCase() === 'false') {
    return valor.toLowerCase() === 'sim' || valor.toLowerCase() === 'true';
  }
  
  // Campos numéricos (peso, potência, tensão, etc.)
  if (chaveMinuscula.includes('peso') ||
      chaveMinuscula.includes('potência') ||
      chaveMinuscula.includes('potencia') ||
      chaveMinuscula.includes('tensão') ||
      chaveMinuscula.includes('tensao') ||
      chaveMinuscula.includes('mandril') ||
      /\d+/.test(valor)) {
    return valor;
  }
  
  // Texto normal - capitalizar
  return capitalizarTexto(valor);
};

// Função para organizar características em estrutura hierárquica
const organizarCaracteristicas = (items: CaracteristicaItem[]): any => {
  const resultado: any = {};
  
  items.forEach(({ chave, valor }) => {
    if (!chave.trim() || !valor.trim()) return;
    
    const chaveFormatada = chave.toLowerCase().replace(/\s+/g, '_');
    const valorFormatado = formatarValor(chave, valor);
    
    // Verificar se é um campo de segurança
    if (chave.toLowerCase().includes('segurança') || 
        chave.toLowerCase().includes('seguranca') ||
        chave.toLowerCase().includes('protetor') ||
        chave.toLowerCase().includes('chave geral')) {
      
      if (!resultado.segurança) {
        resultado.segurança = {};
      }
      
      const subChave = chave.toLowerCase()
        .replace('segurança ', '')
        .replace('seguranca ', '')
        .trim();
      
      resultado.segurança[subChave] = valorFormatado;
    } else {
      resultado[chaveFormatada] = valorFormatado;
    }
  });
  
  return resultado;
};

export const FerramentaCaracteristicas: React.FC<FerramentaCaracteristicasProps> = ({
  caracteristicas,
  onChange
}) => {
  const [items, setItems] = useState<CaracteristicaItem[]>([]);

  // Carregar características existentes
  useEffect(() => {
    if (caracteristicas && typeof caracteristicas === 'object') {
      const itemsExistentes: CaracteristicaItem[] = [];
      
      const processarObjeto = (obj: any, prefixo: string = '') => {
        Object.entries(obj).forEach(([chave, valor]) => {
          const chaveCompleta = prefixo ? `${prefixo} ${chave}` : chave;
          
          if (typeof valor === 'object' && valor !== null && !Array.isArray(valor)) {
            processarObjeto(valor, chave);
          } else {
            itemsExistentes.push({
              chave: chave.replace(/_/g, ' '),
              valor: String(valor)
            });
          }
        });
      };
      
      processarObjeto(caracteristicas);
      setItems(itemsExistentes);
    }
  }, [caracteristicas]);

  const adicionarItem = () => {
    setItems([...items, { chave: '', valor: '' }]);
  };

  const removerItem = (index: number) => {
    const novosItems = items.filter((_, i) => i !== index);
    setItems(novosItems);
    
    if (novosItems.length === 0) {
      onChange({});
    } else {
      const caracteristicasFormatadas = organizarCaracteristicas(novosItems);
      onChange(caracteristicasFormatadas);
    }
  };

  const atualizarItem = (index: number, campo: 'chave' | 'valor', valor: string) => {
    const novosItems = [...items];
    novosItems[index][campo] = valor;
    setItems(novosItems);
    
    // Atualizar características em tempo real
    const caracteristicasFormatadas = organizarCaracteristicas(novosItems);
    onChange(caracteristicasFormatadas);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Características da Ferramenta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhuma característica adicionada. Clique em "Adicionar" para começar.
          </p>
        )}
        
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor={`chave-${index}`}>Característica</Label>
              <Input
                id={`chave-${index}`}
                placeholder="Ex: Cor, Peso, Potência, Segurança chave geral..."
                value={item.chave}
                onChange={(e) => atualizarItem(index, 'chave', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`valor-${index}`}>Valor</Label>
              <Input
                id={`valor-${index}`}
                placeholder="Ex: Preta, 15kg, 500W, sim..."
                value={item.valor}
                onChange={(e) => atualizarItem(index, 'valor', e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removerItem(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={adicionarItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Característica
        </Button>
        
        {items.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <Label className="text-sm font-medium">Preview das características:</Label>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(organizarCaracteristicas(items), null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
