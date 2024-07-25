const DBconnection = require("../connection");
const bcrypt = require('bcrypt');
require('dotenv').config();

async function LoginUser(username, password) {
    if (!username || !password) {
        return { status: false, motivo: 'Usuário e senha são obrigatórios' };
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    const value = username;

    try {
        const [rows] = await DBconnection.query(query, value);

        if (rows.length > 0) {
            const match = await bcrypt.compare(password, rows[0].password);

            if (match) {
                console.log('Usuário com USERNAME e PASSWORD válidos:', rows[0].username);
                return { status: true, level: rows[0].access_level };
            } else {
                console.log('Usuário com SENHA invalida');
                return { status: false, motivo: 'Senha inválida' };
            }
        } else {
          console.log('Usuário com LOGIN invalido');
            return { status: false, motivo: 'Usuário inválido' };
        }
        
    } catch (error) {
        console.error('Erro na consulta SQL:', error);
        return { status: false, motivo: 'Erro na consulta SQL' };
    }
}

module.exports = LoginUser;
