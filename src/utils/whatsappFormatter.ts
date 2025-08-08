
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
  
  // Para números de 8 dígitos (número sem o 9), adiciona o 9 na exibição
  if (phoneNumber.length === 8) {
    // Adiciona o 9 e formata: (99)99137-2552
    const nineDigit = '9';
    const firstPart = nineDigit + phoneNumber.slice(0, 4);
    const secondPart = phoneNumber.slice(4);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('formatWhatsAppForDisplay - resultado 8 dígitos:', result);
    return result;
  } else if (phoneNumber.length === 9) {
    // Já tem 9 dígitos, só formata: (99)99137-2552
    const firstPart = phoneNumber.slice(0, 5);
    const secondPart = phoneNumber.slice(5);
    const result = `(${ddd})${firstPart}-${secondPart}`;
    console.log('formatWhatsAppForDisplay - resultado 9 dígitos:', result);
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
 * Saída: 55991372552 (formato do banco - sem o 9 extra)
 */
export const formatWhatsAppForSave = (numero: string): string => {
  if (!numero) return '';
  
  // Remove qualquer caractere não numérico
  const cleanNumber = numero.replace(/\D/g, '');
  
  console.log('formatWhatsAppForSave - input:', numero, 'clean:', cleanNumber);
  
  // Se já começa com 55, precisa verificar se tem o 9 extra para remover
  if (cleanNumber.startsWith('55')) {
    const withoutCountryCode = cleanNumber.slice(2);
    console.log('formatWhatsAppForSave - já tem 55, sem país:', withoutCountryCode);
    
    if (withoutCountryCode.length === 11) {
      // 55 + DDD (2) + 9 + número (8) = 13 dígitos total
      const ddd = withoutCountryCode.slice(0, 2);
      const possibleNine = withoutCountryCode.slice(2, 3);
      const phoneNumber = withoutCountryCode.slice(3);
      
      console.log('formatWhatsAppForSave - DDD:', ddd, 'Possível 9:', possibleNine, 'Número:', phoneNumber);
      
      // Se o terceiro dígito após o DDD é 9, remove ele
      if (possibleNine === '9' && phoneNumber.length === 8) {
        const result = `55${ddd}${phoneNumber}`;
        console.log('formatWhatsAppForSave - removendo 9 extra, resultado:', result);
        return result;
      }
    }
    
    // Se não tem 9 extra ou já está no formato correto, retorna como está
    console.log('formatWhatsAppForSave - já no formato correto:', cleanNumber);
    return cleanNumber;
  }
  
  // Não começa com 55, então adiciona
  if (cleanNumber.length === 11) {
    // DDD (2) + 9 + número (8) = 11 dígitos
    const ddd = cleanNumber.slice(0, 2);
    const possibleNine = cleanNumber.slice(2, 3);
    const phoneNumber = cleanNumber.slice(3);
    
    console.log('formatWhatsAppForSave - sem 55, DDD:', ddd, 'Possível 9:', possibleNine, 'Número:', phoneNumber);
    
    // Se o terceiro dígito é 9, remove ele antes de adicionar o 55
    if (possibleNine === '9' && phoneNumber.length === 8) {
      const result = `55${ddd}${phoneNumber}`;
      console.log('formatWhatsAppForSave - adicionando 55 e removendo 9, resultado:', result);
      return result;
    }
  }
  
  if (cleanNumber.length === 10) {
    // DDD (2) + número (8) = 10 dígitos - formato fixo
    const result = `55${cleanNumber}`;
    console.log('formatWhatsAppForSave - adicionando 55 a formato fixo, resultado:', result);
    return result;
  }
  
  // Para outros casos, adiciona 55 na frente se não tiver
  const result = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
  console.log('formatWhatsAppForSave - caso padrão, resultado:', result);
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
  
  // Se tem 11 dígitos, é o formato completo com o 9
  if (cleanNumber.length === 11) {
    console.log('convertDisplayToInput - resultado:', cleanNumber);
    return cleanNumber;
  }
  
  // Se tem 10 dígitos, precisa adicionar o 9
  if (cleanNumber.length === 10) {
    const ddd = cleanNumber.slice(0, 2);
    const phoneNumber = cleanNumber.slice(2);
    const result = `${ddd}9${phoneNumber}`;
    console.log('convertDisplayToInput - adicionando 9, resultado:', result);
    return result;
  }
  
  console.log('convertDisplayToInput - formato inesperado, retornando limpo:', cleanNumber);
  return cleanNumber;
};
