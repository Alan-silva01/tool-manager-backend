/**
 * Utilitários para formatação e máscara de números de WhatsApp
 */

/**
 * Formata o número para exibição no app
 * Entrada: 5599991372552 (formato do banco) -> Saída: (99) 99137-2552
 */
export const formatWhatsAppForDisplay = (numero: string): string => {
  if (!numero) return '';
  
  const cleanNumber = numero.replace(/\D/g, '');
  const numberWithoutCountryCode = cleanNumber.startsWith('55') 
    ? cleanNumber.slice(2) 
    : cleanNumber;
  
  if (numberWithoutCountryCode.length < 10) {
    return numero;
  }
  
  const ddd = numberWithoutCountryCode.slice(0, 2);
  const phoneNumber = numberWithoutCountryCode.slice(2);
  
  if (phoneNumber.length === 9) {
    return `(${ddd}) ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
  } else if (phoneNumber.length === 8) {
    return `(${ddd}) 9${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
  }
  
  return numero;
};

/**
 * Formata o número para salvar no banco
 * Entrada: 99991372552 -> Saída: 5599991372552
 */
export const formatWhatsAppForSave = (numero: string): string => {
  if (!numero) return '';
  const cleanNumber = numero.replace(/\D/g, '');
  if (cleanNumber.startsWith('55')) {
    return cleanNumber;
  }
  return `55${cleanNumber}`;
};

/**
 * Valida se o número está em um formato válido (10 a 13 dígitos numéricos)
 */
export const validateWhatsAppNumber = (numero: string): boolean => {
  if (!numero) return false;
  const cleanNumber = numero.replace(/\D/g, '');
  return cleanNumber.length >= 10 && cleanNumber.length <= 13;
};

/**
 * Máscara para input de WhatsApp durante a digitação
 */
export const applyWhatsAppMask = (value: string): string => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else {
    const limitedValue = cleanValue.slice(0, 11);
    const ddd = limitedValue.slice(0, 2);
    const rest = limitedValue.slice(2);
    if (rest.length <= 5) {
      return `(${ddd}) ${rest}`;
    }
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }
};

/**
 * Remove formatação do número
 */
export const removeWhatsAppFormatting = (numero: string): string => {
  if (!numero) return '';
  return numero.replace(/\D/g, '');
};

/**
 * Converte número do formato de exibição para o formato de entrada
 */
export const convertDisplayToInput = (numeroFormatado: string): string => {
  if (!numeroFormatado) return '';
  return numeroFormatado.replace(/\D/g, '');
};
