
import { useState } from 'react';
import { useToast } from './use-toast';

export interface NFCData {
  matricula: string;
}

export const useNFC = () => {
  const [isReading, setIsReading] = useState(false);
  const { toast } = useToast();

  const isNFCSupported = () => {
    return 'NDEFReader' in window;
  };

  const requestNFCPermission = async () => {
    try {
      if (!isNFCSupported()) {
        throw new Error('NFC não é suportado neste dispositivo');
      }

      const permission = await navigator.permissions.query({ name: 'nfc' as PermissionName });
      if (permission.state === 'denied') {
        throw new Error('Permissão NFC negada');
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar permissão NFC:', error);
      return false;
    }
  };

  const readNFC = async (): Promise<NFCData | null> => {
    if (!isNFCSupported()) {
      toast({
        title: "NFC não suportado",
        description: "Este dispositivo não suporta leitura NFC",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsReading(true);
      
      const hasPermission = await requestNFCPermission();
      if (!hasPermission) {
        toast({
          title: "Permissão necessária",
          description: "É necessário permitir o acesso ao NFC",
          variant: "destructive",
        });
        return null;
      }

      const ndef = new (window as any).NDEFReader();
      
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout na leitura NFC'));
        }, 10000); // 10 segundos de timeout

        ndef.addEventListener("reading", (event: any) => {
          clearTimeout(timeoutId);
          
          console.log('NFC lido:', event);
          
          try {
            // Processar os dados do NFC
            let matricula = '';
            
            for (const record of event.message.records) {
              if (record.recordType === "text") {
                const textDecoder = new TextDecoder(record.encoding || 'utf-8');
                const text = textDecoder.decode(record.data);
                
                // Assumir que a matrícula está no texto do NFC
                // Extrair apenas números
                const numbers = text.match(/\d+/);
                if (numbers) {
                  matricula = numbers[0];
                  break;
                }
              } else if (record.recordType === "url") {
                const textDecoder = new TextDecoder();
                const url = textDecoder.decode(record.data);
                
                // Extrair matrícula da URL se necessário
                const urlNumbers = url.match(/\d+/);
                if (urlNumbers) {
                  matricula = urlNumbers[0];
                  break;
                }
              }
            }

            if (matricula) {
              resolve({ matricula });
            } else {
              reject(new Error('Matrícula não encontrada no cartão NFC'));
            }
          } catch (error) {
            reject(error);
          }
        });

        ndef.addEventListener("readingerror", () => {
          clearTimeout(timeoutId);
          reject(new Error('Erro na leitura do NFC'));
        });

        // Iniciar a leitura
        ndef.scan().catch(reject);
      });

    } catch (error) {
      console.error('Erro ao ler NFC:', error);
      toast({
        title: "Erro na leitura NFC",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsReading(false);
    }
  };

  return {
    readNFC,
    isReading,
    isSupported: isNFCSupported()
  };
};
