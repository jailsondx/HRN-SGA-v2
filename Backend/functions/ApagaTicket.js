const DBconnection = require("../connection");
const FormataNumeroTicket = require("./FormataNumeroTicket");
const LogsSGA = require("./LogsDB");
require('dotenv').config();

async function ApagaTicket(ticketId, recepcaoLocation, username, action) {
  var DBtable;

  switch (recepcaoLocation) {
    case 'Recepcao Principal':
      DBtable = process.env.DB_TABLE_PRINCIPAL;
      break;
    case 'Recepcao Emergencia':
      DBtable = process.env.DB_TABLE_EMERGENCIA;
      break;
    case 'Recepcao Ambulatorio':
      DBtable = process.env.DB_TABLE_AMBULATORIO;
      break;
    default:
      throw new Error('Localização do totem inválida');
  }

  const sqlInfor = `SELECT * FROM ${DBtable} WHERE id = ?`;
  const sql = `DELETE FROM ${DBtable} WHERE id = ?`;

  try {
    // Executa a query de forma assíncrona e espera o resultado
    const [resultInfor] = await DBconnection.query(sqlInfor, [ticketId]);
    const afetado = resultInfor[0].tipo+'-'+FormataNumeroTicket(resultInfor[0].numero);

    // Executa a query de forma assíncrona e espera o resultado
    const [result] = await DBconnection.query(sql, [ticketId]);

    if (result.affectedRows > 0) {
      const data = {
        'Origem': 'ApagaTickets.js',
        'Localizacao': recepcaoLocation,
        'Ticket ID': ticketId,
        'Status': 'Apagado com Sucesso'
      };

      console.table(data);
      LogsSGA(username, action, afetado);
      return { success: true, message: 'Ticket apagado com sucesso' };
    } else {
      return { success: false, message: 'Ticket não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao apagar o ticket:', error);
    return { success: false, message: 'Erro ao apagar o ticket' };
  }
}

module.exports = ApagaTicket;
