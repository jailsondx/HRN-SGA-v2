const express = require('express');
const GeraTicket = require('../functions/GeraTicket'); // Ajuste o caminho conforme necessário
const chamaTicket = require('../functions/ChamaTicket');
const listaTicket = require('../functions/ListaTicket');
const CadastroUser = require('../functions/CadastroUser');
const LoginUser = require('../functions/LoginUser');
const ApagaTicket = require('../functions/ApagaTicket');
const ZerarTickets = require('../functions/ZerarTickets');
const listaUsuarios = require('../functions/ListaUsuarios');
const ContadorAtendimentos = require('../functions/ContadorAtendimentos');
const imprimirTexto = require('../functions/Impressao');
const exportarRelatorioCSV = require('../functions/Gerencia-GeraRelatorios');
const TempoMedioAtendimento = require('../functions/TempoMedioAtendimento');

const axios = require('axios');

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

const router = express.Router();

/// Rota para receber os dados de Geracao de Tickets
router.post('/geraTicket', async (req, res) => {
  const { id: ticket, local: totemLocation } = req.body;

  if (!ticket || !totemLocation) {
    return res.status(400).json({ error: 'Ticket ID e localização do totem são obrigatórios.' });
  }

  try {
    const result = await GeraTicket(ticket, totemLocation);

    if (result.success) {
      //Chama funcao para imprimir o ticket
      imprimirTexto(result.tipo + '-' + result.numero);
      res.status(200).json({ message: 'Ticket gerado com sucesso.'});
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erro ao gerar ticket:', error);
    res.status(500).json({ error: 'Erro ao gerar ticket.' });
  }
});

// Rota para receber os dados de Chamada de Tickets
router.post('/chamaTicket', async (req, res) => {
  try {
    const { id: ticket, local: recepcaoLocation } = req.body;

    if (!ticket || !recepcaoLocation) {
      return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    const ticketResponse = await chamaTicket(recepcaoLocation, ticket);
    res.json( ticketResponse );
  } catch (error) {
    console.error('Erro ao chamar o ticket:', error);
    res.status(500).json({ error: 'Erro interno ao chamar o ticket' });
  }
});


// Rota para listar os tickets
router.get('/listaTickets', async (req, res) => {
  try {
    const recepcaoLocation = req.query.local;
    
    if (!recepcaoLocation) {
      return res.status(400).json({ error: 'Local de recepção não fornecido' });
    }

    await listaTicket(recepcaoLocation, res);
  } catch (error) {
    console.error('Erro ao listar os tickets:', error);
    res.status(500).json({ error: 'Erro ao listar os tickets' });
  }
});


// Rota para Contador de Atendimentos
router.get('/ContadorAtendimentos', async (req, res) => {
  try {
    const recepcaoLocation = req.query.local;
    
    if (!recepcaoLocation) {
      return res.status(400).json({ error: 'Local de recepção não fornecido' });
    }

    const result = await ContadorAtendimentos(recepcaoLocation);

    if (result.success) {
      res.status(200).json({ total: result.total });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erro ao listar os atendimentos:', error);
    res.status(500).json({ error: 'Erro ao listar os atendimentos' });
  }
});


//Rota para APAGAR ticket
router.delete('/deletaticket', async (req, res) => {
  const { ticketId, recepcaoLocation, username } = req.body;
  const action = 'Apagar Ticket Especifico';
  console.log('API DELETATICKET:',ticketId, recepcaoLocation, username, action);

  try {
    const result = await ApagaTicket(ticketId, recepcaoLocation, username, action);

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas.', reason: result.message });
    }
  } catch (error) {
    console.error('Erro ao apagar o ticket:', error);
    res.status(500).json({ message: 'Erro ao apagar o ticket.' });
  }
});

//Rota para ZERAR ticket
router.delete('/zerartickets', async (req, res) => {
  const {recepcaoLocation, username } = req.body;
  const action = 'Zerar Tickets';

  try {
    const result = await ZerarTickets(recepcaoLocation, username, action);

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas.', reason: result.message });
    }
  } catch (error) {
    console.error('CATCH ROTA = Erro ao zerar os tickets:', error);
    res.status(500).json({ message: 'Erro ao zerar os tickets.' });
  }
});


// Rota para receber os dados para cadastro do usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { username, cadUsername, cadPassword, cadFullName } = req.body;
    const action = 'Cadastro de Usuario';

    // Verificação de parâmetros obrigatórios
    if (!cadUsername || !cadPassword || !cadFullName) {
      return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    // Chamada à função de cadastro de usuário
    const cadastroStatus = await CadastroUser(username, action, cadUsername, cadPassword, cadFullName);

    // Resposta com base no resultado do cadastro
    if (cadastroStatus.success) {
      res.json({ message: cadastroStatus.message });
    } else {
      // Considerando erros como nome de usuário existente etc.
      res.status(400).json({ error: cadastroStatus.message });
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno no cadastro' });
  }
});


// Rota de Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await LoginUser(username, password);

    if (result.status) {
      res.status(200).json({ message: 'Sucesso no login.', level: result.level });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas.', reason: result.motivo });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login.' });
  }
});

// Rota para listar todos os usuários
router.get('/usuarios', async (req, res) => {
  try {
    const result = await listaUsuarios();

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erro interno ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao listar usuários' });
  }
});

// Rota para calcular a média de tempo entre hora_registro_gerado e hora_registro_atendimento
router.get('/Grafico-TempoAtendimento', async (req, res) => {
  const { data, local: totemLocation } = req.query;

  if (!data || !totemLocation) {
    return res.status(400).json({ error: 'Data e localização do totem são obrigatórios.' });
  }

  try {
    //const result = await GraficoTempoAtendimento(data, totemLocation);
    const result = await TempoMedioAtendimento(data, totemLocation);

    if (result.success) {
      res.status(200).json({ media_segundos: result.media_segundos });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erro ao calcular a média de tempo:', error);
    res.status(500).json({ error: 'Erro ao calcular a média de tempo.' });
  }
});

//Rota para Exportar Relatorio
router.get('/exportcsv', async (req, res) => {
  const { startDate, endDate, recepcoes } = req.query;
  const recepcaoList = recepcoes ? recepcoes.split(',') : [];

  try {
      const filePath = await exportarRelatorioCSV(startDate, endDate, recepcaoList);
      res.download(filePath, `Relatorio-${startDate}-a-${endDate}.csv`, (err) => {
          if (err) {
              console.error('Erro ao fazer o download do arquivo:', err);
              res.status(500).send('Erro ao fazer o download do arquivo');
          }
      });
  } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      res.status(500).send(error.message);
  }
});


//APIs EXTERNAS
router.get('/weather', async (req, res) => {
  const { city } = req.query;

  try {
    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        id: '3387296', // ID para Sobral, BR
        appid: API_KEY,
        units: 'metric',
        lang: 'pt' // Definindo o idioma para português
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);
    res.status(500).json({ error: 'Erro ao buscar dados meteorológicos' });
  }
});


module.exports = router;
