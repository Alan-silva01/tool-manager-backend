
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
        description: "Este dispositivo não suporta leitura NFC ou o leitor ACR 122U não está conectado",
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
          reject(new Error('Timeout na leitura NFC - Verifique se o leitor ACR 122U está conectado'));
        }, 15000); // 15 segundos de timeout para leitores USB

        ndef.addEventListener("reading", (event: any) => {
          clearTimeout(timeoutId);
          
          console.log('NFC lido do ACR 122U:', event);
          
          try {
            let matricula = '';
            
            // Processar dados do leitor ACR 122U
            for (const record of event.message.records) {
              console.log('Processando record:', record);
              
              if (record.recordType === "text") {
                const textDecoder = new TextDecoder(record.encoding || 'utf-8');
                const text = textDecoder.decode(record.data);
                console.log('Texto decodificado:', text);
                
                // Extrair números da string (matrícula)
                const numbers = text.match(/\d+/g);
                if (numbers && numbers.length > 0) {
                  matricula = numbers.join(''); // Juntar todos os números encontrados
                  console.log('Matrícula extraída:', matricula);
                  break;
                }
              } else if (record.recordType === "url") {
                const textDecoder = new TextDecoder();
                const url = textDecoder.decode(record.data);
                console.log('URL decodificada:', url);
                
                // Extrair matrícula da URL
                const urlNumbers = url.match(/\d+/g);
                if (urlNumbers && urlNumbers.length > 0) {
                  matricula = urlNumbers.join('');
                  console.log('Matrícula extraída da URL:', matricula);
                  break;
                }
              } else if (record.recordType === "mime") {
                // Alguns leitores ACR 122U podem enviar dados como MIME
                const textDecoder = new TextDecoder();
                const mimeData = textDecoder.decode(record.data);
                console.log('Dados MIME:', mimeData);
                
                const mimeNumbers = mimeData.match(/\d+/g);
                if (mimeNumbers && mimeNumbers.length > 0) {
                  matricula = mimeNumbers.join('');
                  console.log('Matrícula extraída do MIME:', matricula);
                  break;
                }
              }
            }

            // Se não encontrou matrícula nos records, tentar extrair do serial number
            if (!matricula && event.serialNumber) {
              const serialNumbers = event.serialNumber.match(/\d+/g);
              if (serialNumbers && serialNumbers.length > 0) {
                matricula = serialNumbers.join('');
                console.log('Matrícula extraída do serial number:', matricula);
              }
            }

            if (matricula) {
              console.log('Matrícula final encontrada:', matricula);
              resolve({ matricula });
            } else {
              console.error('Nenhuma matrícula encontrada nos dados do NFC');
              reject(new Error('Matrícula não encontrada no cartão NFC'));
            }
          } catch (error) {
            console.error('Erro ao processar dados do NFC:', error);
            reject(error);
          }
        });

        ndef.addEventListener("readingerror", (error: any) => {
          clearTimeout(timeoutId);
          console.error('Erro na leitura NFC:', error);
          reject(new Error('Erro na leitura do NFC - Verifique se o cartão está próximo ao leitor ACR 122U'));
        });

        // Iniciar a leitura
        console.log('Iniciando scan NFC...');
        ndef.scan().catch((error: any) => {
          clearTimeout(timeoutId);
          console.error('Erro ao iniciar scan:', error);
          reject(error);
        });
      });

    } catch (error) {
      console.error('Erro ao ler NFC:', error);
      toast({
        title: "Erro na leitura NFC",
        description: error instanceof Error ? error.message : "Erro desconhecido - Verifique se o leitor ACR 122U está conectado",
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
