const express = require('express');
const GeraTicket = require('../functions/GeraTicket'); // Ajuste o caminho conforme necessário
const chamaTicket = require('../functions/ChamaTicket');
const listaTicket = require('../functions/ListaTicket');
const CadastroUser = require('../functions/CadastroUser');
const LoginUser = require('../functions/LoginUser');
const ApagaTicket = require('../functions/ApagaTicket');
const ZerarTickets = require('../functions/ZerarTickets');

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
      res.status(200).json({ message: 'Ticket gerado com sucesso.', numero: result.proximoNumero });
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
  const action = 'Tickets Zerados';

  try {
    const result = await ZerarTickets(recepcaoLocation, username, action);

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


// Rota para receber os dados para cadastro do usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Verificação de parâmetros obrigatórios
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    // Chamada à função de cadastro de usuário
    const cadastroStatus = await CadastroUser(username, password, fullName);

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
      res.status(200).json({ message: 'Sucesso no login.' });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas.', reason: result.motivo });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login.' });
  }
});




module.exports = router;
