const DBconnection = require("../connection");
const getCurrentDateTime = require("./DataAtual");
require('dotenv').config();

async function GeraTicket(tipoTicket, totemLocation) {
  var DBtable;

  switch (totemLocation) {
    case 'Recepcao Principal':
      DBtable = process.env.DB_TABLE_PRINCIPAL;
      break;
    case 'Recepcao Emergencia':
      DBtable = process.env.DB_TABLE_EMERGENCIA;
      break;
    default:
      throw new Error('Localização do totem inválida');
  }

  const tipo = tipoTicket;
  const dataAtual = getCurrentDateTime();
  const recebeUltimoNumero = 'SELECT MAX(numero) AS lastNumber FROM ' + DBtable + ' WHERE tipo = ?';

  try {
    // Executa a query de forma assíncrona e espera o resultado
    const [rows] = await DBconnection.query(recebeUltimoNumero, [tipo]);
    const ultimoNumero = rows[0].lastNumber || 0;

    // Incrementa o último número encontrado por 1
    const proximoNumero = ultimoNumero + 1;

    try {
      // Preparando a consulta SQL
      const sql = 'INSERT INTO ' + DBtable + ' (tipo, numero, estado, data_registro) VALUES (?, ?, ?, ?)';
      const values = [tipo, proximoNumero, 'GERADO', dataAtual];

      // Executando a consulta
      await DBconnection.query(sql, values);

      console.log('\nLocalizacao:', totemLocation, '\nTicket:', tipo + '-' + proximoNumero, '\nGerado com Sucesso');
      return { success: true, proximoNumero };
    } catch (error) {
      console.error('Erro ao inserir novo ticket:', error);
      return { success: false, message: 'Erro ao gerar ticket (inserção)' };
    }
  } catch (error) {
    console.error('Erro ao buscar o último número:', error);
    return { success: false, message: 'Erro ao buscar o último número' };
  }
}

module.exports = GeraTicket;
