/**
 * Utilitários para formatação de números de WhatsApp
 */

/**
 * Formata o número para exibição no app
 * Entrada: 5599991372552 (formato do banco)
 * Saída: (99)99137-2552 (formato de exibição)
 */
export const formatWhatsAppForDisplay = (numero: string): string => {
  if (!numero) return '';
  
  console.log('formatWhatsAppForDisplay - input:', numero);
  
  // Remove qualquer caractere não numérico
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Se o número começa com 55 (Brasil), remove o prefixo
  const numberWithoutCountryCode = cleanNumber.startsWith('55') 
    ? cleanNumber.slice(2) 
    : cleanNumber;
  
  console.log('formatWhatsAppForDisplay - sem país:', numberWithoutCountryCode);
  
  // Verifica se tem pelo menos 10 dígitos (DDD + número)
  if (numberWithoutCountryCode.length < 10) {
    console.log('formatWhatsAppForDisplay - número muito curto, retornando original');
    return numero; // Retorna o número original se não estiver no formato esperado
  }
  
  // Extrai DDD (2 primeiros dígitos)
  const ddd = numberWithoutCountryCode.slice(0, 2);
  
  // Extrai o número (sem o DDD)
  const phoneNumber = numberWithoutCountryCode.slice(2);
  
  console.log('formatWhatsAppForDisplay - DDD:', ddd, 'Número:', phoneNumber);
  
  // Para números de 9 dígitos, formata: (99)99137-2552
  if (phoneNumber.length === 9) {
    const firstPart = phoneNumber.slice(0, 5);
    const secondPart = phoneNumber.slice(5);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('formatWhatsAppForDisplay - resultado 9 dígitos:', result);
    return result;
  } else if (phoneNumber.length === 8) {
    // Para números de 8 dígitos (número sem o 9), adiciona o 9 na exibição
    const nineDigit = '9';
    const firstPart = nineDigit + phoneNumber.slice(0, 4);
    const secondPart = phoneNumber.slice(4);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('formatWhatsAppForDisplay - resultado 8 dígitos com 9 adicionado:', result);
    return result;
  } else {
    // Formato inesperado, retorna original
    console.log('formatWhatsAppForDisplay - formato inesperado, retornando original');
    return numero;
  }
};

/**
 * Formata o número para salvar no banco
 * Entrada: 99991372552 (formato digitado pelo admin)
 * Saída: 5599991372552 (formato do banco - sempre com 55 + número completo)
 */
export const formatWhatsAppForSave = (numero: string): string => {
  if (!numero) return '';
  
  // Remove qualquer caractere não numérico
  const cleanNumber = numero.replace(/\D/g, '');
  
  console.log('formatWhatsAppForSave - input:', numero, 'clean:', cleanNumber);
  
  // Se já começa com 55, retorna como está
  if (cleanNumber.startsWith('55')) {
    console.log('formatWhatsAppForSave - já tem 55, retornando:', cleanNumber);
    return cleanNumber;
  }
  
  // Se não começa com 55, adiciona o prefixo
  const result = `55${cleanNumber}`;
  console.log('formatWhatsAppForSave - adicionando 55, resultado:', result);
  return result;
};

/**
 * Valida se o número está em um formato válido
 */
export const validateWhatsAppNumber = (numero: string): boolean => {
  if (!numero) return false;
  
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Deve ter pelo menos 10 dígitos (DDD + número) ou até 13 (55 + DDD + 9 + número)
  return cleanNumber.length >= 10 && cleanNumber.length <= 13;
};

/**
 * Máscara para input de WhatsApp durante a digitação
 * Aplica formatação visual enquanto o usuário digita
 */
export const applyWhatsAppMask = (value: string): string => {
  if (!value) return '';
  
  // Remove tudo exceto números
  const cleanValue = value.replace(/\D/g, '');
  
  console.log('applyWhatsAppMask - input:', value, 'clean:', cleanValue);
  
  // Aplica máscara baseada no tamanho
  if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.slice(0, 2)})${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 11) {
    const ddd = cleanValue.slice(0, 2);
    const firstPart = cleanValue.slice(2, 7);
    const secondPart = cleanValue.slice(7, 11);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('applyWhatsAppMask - resultado:', result);
    return result;
  } else {
    // Limita a 11 dígitos
    const limitedValue = cleanValue.slice(0, 11);
    const ddd = limitedValue.slice(0, 2);
    const firstPart = limitedValue.slice(2, 7);
    const secondPart = limitedValue.slice(7, 11);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('applyWhatsAppMask - resultado limitado:', result);
    return result;
  }
};

/**
 * Remove formatação do número para processamento
 * Entrada: (99)99137-2552
 * Saída: 99991372552
 */
export const removeWhatsAppFormatting = (numero: string): string => {
  if (!numero) return '';
  return numero.replace(/\D/g, '');
};

/**
 * Converte número do formato de exibição para o formato de entrada
 * Usado quando o usuário vai editar um número que já está formatado
 * Entrada: (99)99137-2552 (formato de exibição)
 * Saída: 99991372552 (formato de entrada para edição)
 */
export const convertDisplayToInput = (numeroFormatado: string): string => {
  if (!numeroFormatado) return '';
  
  console.log('convertDisplayToInput - input:', numeroFormatado);
  
  // Remove formatação: (99)99137-2552 -> 99991372552
  const cleanNumber = numeroFormatado.replace(/\D/g, '');
  
  console.log('convertDisplayToInput - resultado:', cleanNumber);
  return cleanNumber;
};
