// Função para falar o texto usando a API de Text-to-Speech
export function falarTexto(texto) {
    // Verifica se a API de SpeechSynthesis está disponível no navegador
    if ('speechSynthesis' in window) {
        // Cria um novo objeto SpeechSynthesisUtterance
        var utterance = new SpeechSynthesisUtterance(texto);

        // Verifica se o texto do utterance contém '-'
        if (utterance.text.includes('-')) {
            const dialog = splitIntoTwoParts(utterance.text);

            switch(dialog[0]){
                case 'SESMT':
                    dialog[0] = 'SESMITE'; 
                    break;
                case 'EX':
                    dialog[0] = 'É XIS'; 
                    break;
            }

            // Cria um novo utterance para o texto antes do "-"
            utterance = new SpeechSynthesisUtterance(dialog[0]+dialog[1]);
        }

        //Toca o som de notificacao
        playSound();
        // Define um tempo de espera de 2 segundos (2000 ms) antes de falar o texto
        setTimeout(() => {
            // Fala o texto
            window.speechSynthesis.speak(utterance);
        }, 2000);

    } else {
        console.error('API de Text-to-Speech não suportada neste navegador.');
    }
}

function splitIntoTwoParts(value) {
    // Encontra a posição do primeiro "-"
    const index = value.indexOf('-');

    // Verifica se "-" foi encontrado
    if (index !== -1) {
        // Divide a string em duas partes, usando a posição do primeiro "-"
        return [value.substring(0, index), value.substring(index + 1)];
    } else {
        // Se não houver "-", retorna a string inteira no índice [0] e uma string vazia no índice [1]
        return [value, ''];
    }
}


function playSound() {
    // Cria um novo objeto de áudio
    const audio = new Audio('Notification-base.mp3');
  
    // Define a reprodução do áudio
    audio.play().catch(error => {
      // Tratamento de erros, caso a reprodução falhe
      console.error('Erro ao reproduzir o som:', error);
    });
  }
  
  