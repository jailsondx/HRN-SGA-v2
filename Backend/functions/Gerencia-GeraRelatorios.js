const DBconnection = require("../connection");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const { getFormattedDate } = require("./Datas");

async function exportarRelatorioCSV(startDate, endDate, recepcoes) {
    try {
        // Consulta SQL para selecionar os dados da tabela gerencia_tickets dentro do intervalo de datas e recepções selecionadas
        const consultaSql = `SELECT * FROM gerencia_tickets WHERE data_ref BETWEEN ? AND ? AND recepcao_ref IN (?)`;
        const [rows] = await DBconnection.query(consultaSql, [startDate, endDate, recepcoes]);
        
        // Formatar data_ref antes de escrever no CSV
        const formattedRows = rows.map(row => ({
            ...row,
            data_ref: getFormattedDate(row.data_ref)
        }));
        
        // Caminho para salvar o arquivo CSV
        const filePath = path.join(__dirname, `../relatorios/Relatorio-${startDate}-a-${endDate}.csv`);
        
        // Configurar o escritor de CSV
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                {id: 'tipo', title: 'Tipo do Ticket'},
                {id: 'qtd', title: 'Quantidade do Tipo'},
                {id: 'data_ref', title: 'Data de Referência'},
                {id: 'recepcao_ref', title: 'Recepção Referência'},
                {id: 'tempo_med_atendimento', title: 'Tempo Médio de Atendimento (seg)'}
            ]
        });
        
        // Escrever os dados no arquivo CSV
        await csvWriter.writeRecords(formattedRows);
        
        console.log(`Relatório CSV gerado com sucesso em: ${filePath}`);
        return filePath;
    } catch (error) {
        console.error('Erro ao gerar o relatório CSV:', error);
        throw new Error('Erro ao gerar o relatório CSV');
    }
}

module.exports = exportarRelatorioCSV;
