const DBconnection = require("../connection");
const {getCurrentDate, getCurrentTime} = require('./Datas');
const FormataNumeroTicket = require("./FormataNumeroTicket");

async function chamaTicket(localAtendimento, tipoTicket) {
    const DBtable = getDBTable(localAtendimento);

    if (!DBtable) {
        throw new Error('Local de atendimento inválido');
    }

    if (tipoTicket === 'PROX') {
        return await SQLChamaTicketOrdem(DBtable);
    } else {
        return await SQLChamaTicket(DBtable, tipoTicket);
    }
}

function getDBTable(localDeAtendimento) {
    switch (localDeAtendimento) {
        case 'Recepcao Principal':
            return process.env.DB_TABLE_PRINCIPAL;
        case 'Recepcao Emergencia':
            return process.env.DB_TABLE_EMERGENCIA;
        default:
            return null;
    }
}

async function updateTable(DBtable, tipo, numero){
    const dataAtual = getCurrentDate();
    const horaAtual = getCurrentTime();
    // Preparando a consulta SQL
    const sql = `UPDATE ${DBtable} SET estado_atendimento = ?, data_registro_atendimento = ?, hora_registro_atendimento = ? WHERE tipo = ? AND numero = ?`;
    const values = [true, dataAtual, horaAtual, tipo, numero];
    // Executando a consulta
    await DBconnection.query(sql, values);
}

async function SQLChamaTicket(DBtable, tipo) {

    const recebeTicket = `SELECT * FROM ${DBtable} WHERE estado_atendimento = false AND tipo = ? ORDER BY id ASC LIMIT 1`;

    try {
        const [rows] = await DBconnection.query(recebeTicket, [tipo]);
        
        if (rows.length > 0) {
            const ticketChamado = `${rows[0].tipo}-${FormataNumeroTicket(rows[0].numero)}`;

            //Funcao para fazer o update da tabela para definir o ticket como atendido
            updateTable(DBtable, rows[0].tipo, rows[0].numero);
            
            return ticketChamado;
        } else {
            const ticketChamado = `Não há ticket do tipo: ${tipo} esperando Atendimento`;
            console.log('Nenhum ticket encontrado (SQLChamaTicket Function).');
            return ticketChamado;
        }
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
        throw error;
    }
}

async function SQLChamaTicketOrdem(DBtable) {

    const recebeTicket = `SELECT * FROM ${DBtable} WHERE estado_atendimento = false ORDER BY id ASC LIMIT 1`;

    try {
        const [rows] = await DBconnection.query(recebeTicket);
        
        if (rows.length > 0) {
            const ticketChamado = `${rows[0].tipo}-${FormataNumeroTicket(rows[0].numero)}`;
            
            //Funcao para fazer o update da tabela para definir o ticket como atendido
            updateTable(DBtable, rows[0].tipo, rows[0].numero);

            return ticketChamado;
        } else {
            const ticketChamado = 'Não há ticket esperando Atendimento';
            console.log('Nenhum ticket encontrado (SQLChamaTicketOrdem Function).');
            return ticketChamado;
        }
    } catch (error) {
        console.error('Erro ao buscar o ticket:', error);
        throw error;
    }
}

module.exports = chamaTicket;
