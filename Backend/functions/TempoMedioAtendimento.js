const DBconnection = require("../connection");
require('dotenv').config();

async function TempoMedioAtendimento(data, totemLocation) {
    let DBtable;

    switch (totemLocation) {
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

    const sql = `
        SELECT AVG(TIMESTAMPDIFF(SECOND, 
            CONCAT(data_registro_gerado, ' ', hora_registro_gerado), 
            CONCAT(data_registro_atendimento, ' ', hora_registro_atendimento)
        )) AS media_segundos
        FROM ${DBtable}
        WHERE data_registro_gerado = ?
    `;

    try {
        // Executa a query de forma assíncrona e espera o resultado
        const [rows] = await DBconnection.query(sql, [data]);

        if (rows.length > 0) {
            const mediaSegundos = rows[0].media_segundos;
            //const mediaMinutos = (mediaSegundos / 60).toFixed(2);
            return { success: true, media_segundos: mediaSegundos };
        } else {
            return { success: false, message: 'Nenhum registro encontrado para a data fornecida.' };
        }
    } catch (error) {
        console.error('Erro ao calcular a média de tempo:', error);
        return { success: false, message: 'Erro ao calcular a média de tempo.', error };
    }
}

module.exports = TempoMedioAtendimento;
