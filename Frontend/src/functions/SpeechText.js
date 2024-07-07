// Função para falar o texto usando a API de Text-to-Speech
export function falarTexto(texto) {
    // Verifica se a API de SpeechSynthesis está disponível no navegador
    if ('speechSynthesis' in window) {
        // Cria um novo objeto SpeechSynthesisUtterance
        var utterance = new SpeechSynthesisUtterance(texto);

        // Fala o texto
        window.speechSynthesis.speak(utterance);

    } else {
        console.error('API de Text-to-Speech não suportada neste navegador.');
    }
}

