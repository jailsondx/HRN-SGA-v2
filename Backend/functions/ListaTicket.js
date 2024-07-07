const DBconnection = require("../connection");
const FormataNumeroTicket = require("./FormataNumeroTicket");
require('dotenv').config();

async function listaTicket(localAtendimento, res) {
    let DBtable;

    // Determinar a tabela do banco de dados com base na localização do atendimento
    switch (localAtendimento) {
        case 'Recepcao Principal':
            DBtable = process.env.DB_TABLE_PRINCIPAL;
            break;
        case 'Recepcao Emergencia':
            DBtable = process.env.DB_TABLE_EMERGENCIA;
            break;
        default:
            res.status(400).json({ error: "Local de atendimento inválido" });
            return;
    }

    try {
        // Consulta SQL para selecionar tickets com estado "GERADO"
        const sql = `SELECT * FROM ${DBtable} WHERE estado = "GERADO" LIMIT 20`;
        const [rows] = await DBconnection.query(sql);

        // Formatar o número do ticket e devolver os resultados
        const updatedRows = rows.map(row => {
            row.numero = FormataNumeroTicket(row.numero);
            return row;
        });

        // Enviar a resposta com os tickets atualizados
        res.json(updatedRows);
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
        res.status(500).json({ error: 'Erro ao buscar os tickets' });
    }
}

module.exports = listaTicket;
