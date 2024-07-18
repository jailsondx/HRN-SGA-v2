const DBconnection = require("../connection");

// Função para obter a data atual no formato 'YYYY-MM-DD'
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Função para obter a hora atual no formato 'HH:MM:SS'
function getCurrentTime() {
    const date = new Date();
    return date.toTimeString().split(' ')[0];
}

async function LogsSGA(username, action, afetado) {
    const DBtable = 'logs_sga';
    const dataAtual = getCurrentDate();
    const horaAtual = getCurrentTime();

    try {
        // Consulta SQL para inserir o novo Log no banco de dados
        const query = `INSERT INTO ${DBtable} (log_username, log_action, log_afetado, log_data, log_hora) VALUES (?, ?, ?, ?, ?)`;
        
        // Executando a consulta
        const [result] = await DBconnection.query(query, [username, action, afetado, dataAtual, horaAtual]);

        // Checar o resultado e retornar sucesso ou a mensagem adequada
        if (result.affectedRows > 0) {
            return { success: true, message: "Log registrado com sucesso!" };
        } else {
            return { success: false, message: "Else: Falha ao registrar Log." };
        }
    } catch (error) {
        // Tratamento de erro
        console.error('Erro no registro do Log:', error);
        return { success: false, message: "Catch: Erro ao registrar Log.", error };
    }
}

module.exports = LogsSGA;
