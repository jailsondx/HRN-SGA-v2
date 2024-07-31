const DBconnection = require("../connection");
const bcrypt = require('bcrypt');
const LogsSGA = require("./LogsDB");

async function CadastroUser(username, action, cadUsername, cadPassword, cadFullName) {
    const DBtable = 'users';
    const afetado = 'Novo Usuario: '+[cadUsername];

    try {
        // Verificar se o nome de usuário já existe
        const checkUserQuery = `SELECT username FROM ${DBtable} WHERE username = ?`;
        const [checkUserResult] = await DBconnection.query(checkUserQuery, [cadUsername]);

        // Se o nome de usuário já existe, retornar uma mensagem de erro
        if (checkUserResult.length > 0) {
            return { success: false, message: "Nome de usuário já existe. Escolha outro nome de usuário." };
        }

        // Hash da senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(cadPassword, 10); // O número 10 representa o número de rounds de salting

        // Consulta SQL para inserir o novo usuário no banco de dados
        const query = `INSERT INTO ${DBtable} (username, password, full_name, access_level) VALUES (?, ?, ?, ?)`;
        
        // Executando a consulta
        const [result] = await DBconnection.query(query, [cadUsername, hashedPassword, cadFullName, 'basico']);

        // Checar o resultado e retornar sucesso ou a mensagem adequada
        if (result.affectedRows > 0) {
            await LogsSGA(username, action, afetado);
            return { success: true, message: "Usuário cadastrado com sucesso!" };
        } else {
            return { success: false, message: "Falha ao cadastrar usuário." };
        }
    } catch (error) {
        // Tratamento de erro
        console.error('Erro no cadastro:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: "Nome de usuário já está em uso, por favor escolha outro." };
        }
        return { success: false, message: "Erro ao cadastrar usuário.", error };
    }
}

module.exports = CadastroUser;
