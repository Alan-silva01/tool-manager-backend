
/**
 * Formata o número durante a digitação
 * Input: 99991372552 -> Output: (99)99137-2552
 */
export const formatWhatsAppDisplay = (value: string): string => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica máscara conforme o tamanho
  if (numbers.length <= 2) {
    return numbers.length > 0 ? `(${numbers}` : '';
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    return `(${limitedNumbers.slice(0, 2)})${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

/**
 * Normaliza o número para salvar no banco
 * Input: (99)99137-2552 -> Output: 559991372552
 */
export const normalizeWhatsAppToSave = (formattedValue: string): string | null => {
  if (!formattedValue) return null;
  
  // Remove tudo que não é número
  const numbers = formattedValue.replace(/\D/g, '');
  
  console.log('normalizeWhatsAppToSave - números extraídos:', numbers);
  
  // Deve ter exatamente 11 dígitos (DDD + 9 dígitos)
  if (numbers.length !== 11) {
    console.log('normalizeWhatsAppToSave - tamanho inválido:', numbers.length);
    return null;
  }
  
  // Extrai DDD (2 primeiros dígitos)
  const ddd = numbers.slice(0, 2);
  
  // Pega os 9 dígitos restantes e remove o primeiro (o "9" extra)
  const remainingDigits = numbers.slice(2); // 991372552
  const last8Digits = remainingDigits.slice(1); // 91372552
  
  // Monta o formato final: 55 + DDD + 8 últimos dígitos
  const result = `55${ddd}${last8Digits}`;
  
  console.log('normalizeWhatsAppToSave - resultado:', result);
  return result;
};

/**
 * Valida se o número está no formato correto para salvar
 */
export const validateWhatsAppFormat = (formattedValue: string): boolean => {
  if (!formattedValue) return true; // Campo vazio é válido
  
  const numbers = formattedValue.replace(/\D/g, '');
  return numbers.length === 11;
};

/**
 * Converte número do banco para exibição no campo de edição
 * Input: 559991372552 -> Output: (99)99137-2552
 */
export const convertBankToDisplay = (bankValue: string): string => {
  if (!bankValue) return '';
  
  const numbers = bankValue.replace(/\D/g, '');
  
  // Se começa com 55, remove
  const withoutCountryCode = numbers.startsWith('55') ? numbers.slice(2) : numbers;
  
  // Se tem 10 dígitos (DDD + 8), adiciona o 9
  if (withoutCountryCode.length === 10) {
    const ddd = withoutCountryCode.slice(0, 2);
    const phoneNumber = withoutCountryCode.slice(2);
    const fullNumber = `${ddd}9${phoneNumber}`;
    return formatWhatsAppDisplay(fullNumber);
  }
  
  // Se já tem 11 dígitos, apenas formata
  if (withoutCountryCode.length === 11) {
    return formatWhatsAppDisplay(withoutCountryCode);
  }
  
  return '';
};
