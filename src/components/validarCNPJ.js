// src/utils/validarCNPJ.js

const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) {
    return { valid: false, error: "CNPJ deve ter 14 dígitos." };
  }

  const checkDigits = cnpj.slice(-2);
  const base = cnpj.slice(0, 12);

  const calculateCheckDigit = (base, weight) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weight[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const secondDigit = calculateCheckDigit(base + firstDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  if (checkDigits !== `${firstDigit}${secondDigit}`) {
    return { valid: false, error: "CNPJ inválido." };
  }

  return { valid: true };
};

export default validarCNPJ;
