const DBconnection = require("../connection");
const LogsSGA = require("./LogsDB");
require('dotenv').config();

async function ZerarTickets(recepcaoLocation, username, action) {
  let DBtable;
  const afetado = recepcaoLocation;

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

  const sql = `TRUNCATE TABLE ${DBtable}`;

  try {
    // Executa a query de forma assíncrona
    await DBconnection.query(sql);

    const data = {
      'Origem': 'ZerarTickets.js',
      'Localizacao': recepcaoLocation,
      'Status': 'Apagado com Sucesso'
    };

    console.table(data);
    LogsSGA(username, action, afetado);
    return { success: true, message: `Ticketes ${recepcaoLocation} \nZerado(a) com sucesso` };
  } catch (error) {
    console.error('Erro ao truncar tabela:', error);
    return { success: false, message: 'Erro ao truncar tabela' };
  }
}

module.exports = ZerarTickets;
