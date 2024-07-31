const { Server } = require('socket.io');
const chalk = require('chalk');

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Certifique-se de que este é o URL correto do seu front-end
      methods: ['*'],
      allowedHeaders: ['Content-Type'], // Permitir cabeçalhos específicos
      credentials: true // Permitir cookies e credenciais se necessário
    }
  });

  // Fila para armazenar as mensagens
  const messageQueue = [];

  // Função para processar a fila de mensagens
  const processQueue = async () => {
    while (true) {
      if (messageQueue.length > 0) {
        const mensagem = messageQueue.shift();
        switch (mensagem[0]) {
          case 'Recepcao Principal':
            io.to('TV Recepcao Principal').emit('Mensagem:TicketEmAtendimento', mensagem);
            break;
          case 'Recepcao Emergencia':
            io.to('TV Recepcao Emergencia').emit('Mensagem:TicketEmAtendimento', mensagem);
            break;
          case 'Recepcao Ambulatorio':
            io.to('TV Recepcao Ambulatorio').emit('Mensagem:TicketEmAtendimento', mensagem);
            break;
        }

        // Espera 5 segundos antes de processar a próxima mensagem
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        // Se não houver mensagens na fila, espera 1 segundo antes de verificar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  // Inicia o processamento da fila de mensagens
  processQueue();

  // Configuração do Socket.io
  io.on('connection', (socket) => {
    //console.log(chalk.green('Um usuário se conectou'));

    // Escuta mensagens da sala Atendimento e adiciona à fila
    socket.on('Mensagem:TicketChamado', (mensagem) => {
      messageQueue.push(mensagem);
    });

    // Entrar na sala Atendimento
    socket.on('Atendimento', (recepcaoLocation, guicheLocation) => {
      const atendimento = [recepcaoLocation, guicheLocation];
      socket.join(atendimento);
      console.log('Recepcionista', chalk.bold.blue(atendimento), 'Conectado');
    });

    // Entrar na sala TV
    socket.on('SalaTV', (tvLocation) => {
      socket.join(tvLocation);
      console.log('Televisao:', chalk.bold.yellow(tvLocation), 'Conectado');
    });

    socket.on('disconnect', () => {
      //console.log(chalk.red('Um usuário desconectou'));
    });
  });
};

module.exports = configureSocket;
