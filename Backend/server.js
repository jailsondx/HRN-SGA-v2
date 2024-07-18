const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const rotas = require('./Rotas/routes');
const configureSocket = require('./socketConfig');

require('dotenv').config();

const IP = process.env.NODE_SERVER_IP;
const PORT = process.env.NODE_SERVER_PORT;

const app = express();
const server = http.createServer(app);

// Inicializa Conexao com o BD
// DBconnection;

// Middleware
app.use(cors());
app.use(bodyParser.json());





// Aumenta o limite de listeners de eventos
require('events').EventEmitter.defaultMaxListeners = 20;

// Configura o pool de conexões HTTP
http.globalAgent.maxSockets = Infinity;






// Rota para receber os dados de Geracao de Tickets
app.use('/api', rotas);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor rodando...');
});



// Configuração do Socket.IO
configureSocket(server);

// Iniciar o servidor
server.listen(PORT, () => {
  console.log('Servidor',chalk.bold.green('NodeJS'),'Rodando no IP ' + chalk.magenta(IP) + ' na porta ' + chalk.blue(PORT));
});
