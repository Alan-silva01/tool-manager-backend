
/**
 * Utilitários para formatação de números de WhatsApp
 */

/**
 * Formata o número para exibição no app
 * Entrada: 559991372552 (formato do banco)
 * Saída: (99)99137-2552 (formato de exibição)
 */
export const formatWhatsAppForDisplay = (numero: string): string => {
  if (!numero) return '';
  
  // Remove qualquer caractere não numérico
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Se o número começa com 55 (Brasil), remove o prefixo
  const numberWithoutCountryCode = cleanNumber.startsWith('55') 
    ? cleanNumber.slice(2) 
    : cleanNumber;
  
  // Verifica se tem pelo menos 10 dígitos (DDD + número)
  if (numberWithoutCountryCode.length < 10) {
    return numero; // Retorna o número original se não estiver no formato esperado
  }
  
  // Extrai DDD (2 primeiros dígitos)
  const ddd = numberWithoutCountryCode.slice(0, 2);
  
  // Extrai o número (sem o DDD)
  const phoneNumber = numberWithoutCountryCode.slice(2);
  
  // Adiciona o 9 extra se necessário e formata
  if (phoneNumber.length === 8) {
    // Número fixo: (99)1234-5678
    const firstPart = phoneNumber.slice(0, 4);
    const secondPart = phoneNumber.slice(4);
    return `(${ddd})${firstPart}-${secondPart}`;
  } else if (phoneNumber.length === 9) {
    // Número celular: (99)99137-2552
    const firstPart = phoneNumber.slice(0, 5);
    const secondPart = phoneNumber.slice(5);
    return `(${ddd})${firstPart}-${secondPart}`;
  } else {
    // Formato inesperado, retorna original
    return numero;
  }
};

/**
 * Formata o número para salvar no banco
 * Entrada: 99991372552 (formato digitado pelo admin)
 * Saída: 55991372552 (formato do banco)
 */
export const formatWhatsAppForSave = (numero: string): string => {
  if (!numero) return '';
  
  // Remove qualquer caractere não numérico
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Se já começa com 55, retorna como está
  if (cleanNumber.startsWith('55')) {
    return cleanNumber;
  }
  
  // Se tem 11 dígitos (DDD + 9 + número), é um celular brasileiro
  if (cleanNumber.length === 11) {
    const ddd = cleanNumber.slice(0, 2);
    const nineDigit = cleanNumber.slice(2, 3);
    const phoneNumber = cleanNumber.slice(3);
    
    // Se o terceiro dígito é 9 (celular), remove-o antes de salvar
    if (nineDigit === '9') {
      return `55${ddd}${phoneNumber}`;
    }
  }
  
  // Se tem 10 dígitos (DDD + número fixo)
  if (cleanNumber.length === 10) {
    return `55${cleanNumber}`;
  }
  
  // Para outros casos, adiciona 55 na frente se não tiver
  return cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
};

/**
 * Valida se o número está em um formato válido
 */
export const validateWhatsAppNumber = (numero: string): boolean => {
  if (!numero) return false;
  
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Deve ter pelo menos 12 dígitos (55 + DDD + número) ou 10-11 para entrada
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
  
  // Aplica máscara baseada no tamanho
  if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 7) {
    return `(${cleanValue.slice(0, 2)})${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 11) {
    const ddd = cleanValue.slice(0, 2);
    const firstPart = cleanValue.slice(2, 7);
    const secondPart = cleanValue.slice(7, 11);
    return `(${ddd})${firstPart}-${secondPart}`;
  } else {
    // Limita a 11 dígitos
    const limitedValue = cleanValue.slice(0, 11);
    const ddd = limitedValue.slice(0, 2);
    const firstPart = limitedValue.slice(2, 7);
    const secondPart = limitedValue.slice(7, 11);
    return `(${ddd})${firstPart}-${secondPart}`;
  }
};
