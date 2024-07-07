const express = require('express');
const GeraTicket = require('../functions/GeraTicket'); // Ajuste o caminho conforme necessário
const chamaTicket = require('../functions/ChamaTicket');
const listaTicket = require('../functions/ListaTicket');

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




module.exports = router;
