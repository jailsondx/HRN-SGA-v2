const DBconnection = require("../connection");
require('dotenv').config();

async function GerenciaSalvaTickets(localAtendimento) {
    let DBtable;

    // Determinar a tabela do banco de dados com base na localização do atendimento
    switch (localAtendimento) {
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
            throw new Error("Local de atendimento inválido");
    }

    try {
        console.log(`Conectado à tabela: ${DBtable}`);

        // Consulta SQL para selecionar tickets com estado "GERADO"
        const consultaSql = `SELECT * FROM ${DBtable} WHERE estado_atendimento = true`;
        const [rows] = await DBconnection.query(consultaSql);
        console.log(`Consulta SQL executada com sucesso. Número de tickets encontrados: ${rows.length}`);

        // Contar as ocorrências de cada tipo e agrupar por data_registro_atendimento
        const tipoContagem = {};
        rows.forEach(row => {
            const { tipo, data_registro_atendimento } = row;
            const formattedDate = new Date(data_registro_atendimento).toISOString().split('T')[0]; // Garantir formato YYYY-MM-DD
            if (!tipoContagem[formattedDate]) {
                tipoContagem[formattedDate] = {};
            }
            tipoContagem[formattedDate][tipo] = (tipoContagem[formattedDate][tipo] || 0) + 1;
        });

        // Inserir ou atualizar os dados na tabela gerencia_tickets
        for (const [dataRef, tipos] of Object.entries(tipoContagem)) {
            for (const [tipo, qtd] of Object.entries(tipos)) {
                // Verificar se já existe uma entrada com o mesmo tipo, recepcao_ref e data_ref
                const selectSql = `SELECT * FROM gerencia_tickets WHERE tipo = ? AND recepcao_ref = ? AND data_ref = ?`;
                const [existingRows] = await DBconnection.query(selectSql, [tipo, localAtendimento, dataRef]);

                if (existingRows.length > 0) {
                    // Atualizar a quantidade existente
                    const updateSql = `UPDATE gerencia_tickets SET qtd = qtd + ? WHERE tipo = ? AND recepcao_ref = ? AND data_ref = ?`;
                    await DBconnection.query(updateSql, [qtd, tipo, localAtendimento, dataRef]);
                    console.log(`Quantidade atualizada: { tipo: ${tipo}, qtd: ${qtd}, data_ref: ${dataRef}, recepcao_ref: ${localAtendimento} }`);
                } else {
                    // Inserir uma nova entrada
                    const insertSql = `INSERT INTO gerencia_tickets (tipo, qtd, recepcao_ref, data_ref) VALUES (?, ?, ?, ?)`;
                    await DBconnection.query(insertSql, [tipo, qtd, localAtendimento, dataRef]);
                    console.log(`Dados inseridos com sucesso: { tipo: ${tipo}, qtd: ${qtd}, data_ref: ${dataRef}, recepcao_ref: ${localAtendimento} }`);
                }
            }
        }

        console.log('Todos os dados foram inseridos ou atualizados com sucesso na tabela gerencia_tickets');
        return rows; // Retorna os tickets atualizados
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
        throw new Error('Erro ao buscar os tickets');
    }
}

module.exports = GerenciaSalvaTickets;
