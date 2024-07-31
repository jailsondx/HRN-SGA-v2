const DBconnection = require("../connection");
const { getCurrentDate } = require("./Datas");
require('dotenv').config();

async function ContadorAtendimentos(recepcaoLocation) {
  let DBtable;

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
      throw new Error('Localização de recepção inválida');
  }

  try {
    // Consulta SQL para obter a contagem de atendimentos
    const sql = `SELECT COUNT(*) AS total FROM ${DBtable} WHERE estado_atendimento = true AND data_registro_atendimento = ?`;
    const [rows] = await DBconnection.query(sql, getCurrentDate());

    // Retorna o quantitativo obtido
    return { success: true, total: rows[0].total };
  } catch (error) {
    console.error('Erro ao obter quantitativo de atendimentos:', error);
    return { success: false, message: 'Erro ao obter quantitativo de atendimentos', error };
  }
}

module.exports = ContadorAtendimentos;
