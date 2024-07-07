function FormataNumeroTicket(value) {
    // Converte o valor para string
    const valueStr = String(value);
    
    // Completa com zeros à esquerda até que a string tenha 6 dígitos
    const paddedValue = valueStr.padStart(3, '0');
    
    return paddedValue;
}

module.exports = FormataNumeroTicket;

