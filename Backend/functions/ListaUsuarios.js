const DBconnection = require("../connection");
require('dotenv').config();

async function listaUsuarios() {
    const DBtable = 'users';

    try {
        // Consulta SQL para selecionar todos os usuários
        const sql = `SELECT * FROM ${DBtable}`;
        const [rows] = await DBconnection.query(sql);

        // Retorna os usuários encontrados
        return { success: true, data: rows };
    } catch (error) {
        console.error('Erro ao buscar USUARIOS:', error);
        return { success: false, message: 'Erro ao buscar os USUARIOS', error };
    }
}

module.exports = listaUsuarios;
