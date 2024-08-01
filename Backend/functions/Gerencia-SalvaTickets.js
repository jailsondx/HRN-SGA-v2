const DBconnection = require("../connection");
const TempoMedioAtendimento = require("./TempoMedioAtendimento");
const chalk = require('chalk');
require('dotenv').config();

// FUNÇÃO PRINCIPAL para gerenciar e salvar tickets
async function GerenciaSalvaTickets(localAtendimento) {
    let DBtable = determinarTabela(localAtendimento);

    // Execução da função de backup para a tabela de tickets detalhados
    try {
        await copiarTabela(DBtable, 'gerencia_tickets_detalhado');
    } catch (error) {
        console.error('Erro ao realizar BACKUP dos tickets:', error);
        throw new Error('Erro ao realizar BACKUP dos tickets');
    }

    //TryCatche Principal 
    try {
        console.log(chalk.bgCyan(`Conectado à tabela: ${chalk.bgBlue(DBtable)}`));

        // Consulta SQL para selecionar tickets com estado "GERADO"
        const consultaSql = `SELECT * FROM ${DBtable} WHERE estado_atendimento = true`;
        const [rows] = await DBconnection.query(consultaSql);
        console.log(chalk.bgGreen(`Consulta SQL executada com sucesso. Número de tickets encontrados: ${rows.length}`));

        const tipoContagem = contarOcorrencias(rows);

        // Inserir ou atualizar os dados na tabela gerencia_tickets
        for (const [dataRef, tipos] of Object.entries(tipoContagem)) {
            for (const [tipo, qtd] of Object.entries(tipos)) {
                // Obter o tempo médio de atendimento para a data e recepção
                const tempoMedio = await TempoMedioAtendimento(dataRef, localAtendimento);

                await inserirOuAtualizarDados(tipo, qtd, localAtendimento, dataRef, tempoMedio.media_segundos);
            }
        }

        console.log(chalk.bgGreen('Todos os dados foram inseridos ou atualizados com sucesso na tabela '+chalk.bgBlue('gerencia_tickets')));
        return rows; // Retorna os tickets atualizados
    } catch (error) {
        console.error(chalk.bgRed('Erro ao buscar o ticket:', error));
        throw new Error('Erro ao buscar os tickets');
    }
}

// Função para determinar a tabela do banco de dados com base na localização do atendimento
function determinarTabela(localAtendimento) {
    switch (localAtendimento) {
        case 'Recepcao Principal':
            return process.env.DB_TABLE_PRINCIPAL;
        case 'Recepcao Emergencia':
            return process.env.DB_TABLE_EMERGENCIA;
        case 'Recepcao Ambulatorio':
            return process.env.DB_TABLE_AMBULATORIO;
        default:
            throw new Error("Local de atendimento inválido");
    }
}

// Função para copiar dados de uma tabela para outra
async function copiarTabela(origem, destino) {
    const connection = await DBconnection.getConnection(); // Obter uma conexão do pool

    try {
        // Iniciar uma transação
        await connection.beginTransaction();

        // Selecionar todos os dados da tabela de origem
        const [rows] = await connection.query(`SELECT * FROM ${origem}`);

        if (rows.length === 0) {
            console.log(chalk.bgMagenta('Nenhum dado encontrado na tabela de origem.'));
            await connection.rollback();
            connection.release(); // Liberar a conexão de volta ao pool
            return;
        }

        // Inserir dados na tabela de destino, omitindo a chave primária e adicionando o nome da tabela na coluna 'recepcao_ref'
        for (const row of rows) {
            const { id, ...rowWithoutId } = row; // Omitir a coluna 'id'
            const columns = Object.keys(rowWithoutId).join(', ') + ', recepcao_ref';
            const values = [...Object.values(rowWithoutId), origem]; // Adicionar o nome da tabela de origem
            const placeholders = values.map(() => '?').join(', ');

            const sql = `INSERT INTO ${destino} (${columns}) VALUES (${placeholders})`;
            await connection.query(sql, values);
        }

        // Confirmar a transação
        await connection.commit();
        console.log(chalk.bgYellow('Dados copiados com sucesso.'));
    } catch (error) {
        console.error(chalk.bgRed('Erro ao copiar dados:', error));
        await connection.rollback();
    } finally {
        // Liberar a conexão de volta ao pool
        connection.release();
    }
}



// Função para contar as ocorrências de cada tipo e agrupar por data_registro_atendimento
function contarOcorrencias(rows) {
    const tipoContagem = {};
    rows.forEach(row => {
        const { tipo, data_registro_atendimento } = row;
        const formattedDate = new Date(data_registro_atendimento).toISOString().split('T')[0]; // Garantir formato YYYY-MM-DD
        if (!tipoContagem[formattedDate]) {
            tipoContagem[formattedDate] = {};
        }
        tipoContagem[formattedDate][tipo] = (tipoContagem[formattedDate][tipo] || 0) + 1;
    });
    return tipoContagem;
}

// Função para inserir ou atualizar os dados na tabela gerencia_tickets
async function inserirOuAtualizarDados(tipo, qtd, localAtendimento, dataRef, tempoMedio) {
    try {
        // Verificar se já existe uma entrada com o mesmo tipo, recepcao_ref e data_ref
        const selectSql = `SELECT * FROM gerencia_tickets WHERE tipo = ? AND recepcao_ref = ? AND data_ref = ?`;
        const [existingRows] = await DBconnection.query(selectSql, [tipo, localAtendimento, dataRef]);

        if (existingRows.length > 0) {
            // Atualizar a quantidade existente
            const updateSql = `
                UPDATE gerencia_tickets 
                SET qtd = qtd + ?, tempo_med_atendimento = ? 
                WHERE tipo = ? AND recepcao_ref = ? AND data_ref = ?
            `;
            await DBconnection.query(updateSql, [qtd, tempoMedio, tipo, localAtendimento, dataRef]);
            //console.log(`Quantidade e tempo médio atualizados: { tipo: ${tipo}, qtd: ${qtd}, data_ref: ${dataRef}, recepcao_ref: ${localAtendimento}, tempo_med_atendimento: ${tempoMedio} }`);
        } else {
            // Inserir uma nova entrada
            const insertSql = `
                INSERT INTO gerencia_tickets (tipo, qtd, recepcao_ref, data_ref, tempo_med_atendimento) 
                VALUES (?, ?, ?, ?, ?)
            `;
            await DBconnection.query(insertSql, [tipo, qtd, localAtendimento, dataRef, tempoMedio]);
            //console.log(`Dados inseridos com sucesso: { tipo: ${tipo}, qtd: ${qtd}, data_ref: ${dataRef}, recepcao_ref: ${localAtendimento}, tempo_med_atendimento: ${tempoMedio} }`);
        }
    } catch (error) {
        console.error('Erro ao inserir ou atualizar dados:', error);
        throw new Error('Erro ao inserir ou atualizar dados');
    }
}

module.exports = GerenciaSalvaTickets;
