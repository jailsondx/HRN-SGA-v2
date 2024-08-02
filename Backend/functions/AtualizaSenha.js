const DBconnection = require("../connection");
const bcrypt = require('bcrypt');
const LogsSGA = require("./LogsDB");

async function AtualizarSenha(username, action, targetUsername, newPassword) {
    const DBtable = 'users';
    const afetado = 'Usuário: ' + [targetUsername];

    try {
        // Verificar se o nome de usuário existe
        const checkUserQuery = `SELECT username FROM ${DBtable} WHERE username = ?`;
        const [checkUserResult] = await DBconnection.query(checkUserQuery, [targetUsername]);

        // Se o nome de usuário não existe, retornar uma mensagem de erro
        if (checkUserResult.length === 0) {
            return { success: false, message: "Nome de usuário não encontrado." };
        }

        // Hash da nova senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(newPassword, 10); // O número 10 representa o número de rounds de salting

        // Consulta SQL para atualizar a senha do usuário no banco de dados
        const updateQuery = `UPDATE ${DBtable} SET password = ? WHERE username = ?`;
        
        // Executando a consulta
        const [result] = await DBconnection.query(updateQuery, [hashedPassword, targetUsername]);

        // Checar o resultado e retornar sucesso ou a mensagem adequada
        if (result.affectedRows > 0) {
            await LogsSGA(username, action, afetado);
            return { success: true, message: "Senha atualizada com sucesso!" };
        } else {
            return { success: false, message: "Falha ao atualizar a senha." };
        }
    } catch (error) {
        // Tratamento de erro
        console.error('Erro ao atualizar senha:', error);
        return { success: false, message: "Erro ao atualizar senha.", error };
    }
}

module.exports = AtualizarSenha;
