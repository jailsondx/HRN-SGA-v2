const DBconnection = require("../connection");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const { getFormattedDate } = require("./Datas");
/*
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então adicionamos 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
    */

async function exportarRelatorioCSV() {
    try {
        // Consulta SQL para selecionar todos os dados da tabela gerencia_tickets
        const consultaSql = `SELECT * FROM gerencia_tickets`;
        const [rows] = await DBconnection.query(consultaSql);
        
        // Formatar data_ref antes de escrever no CSV
        const formattedRows = rows.map(row => ({
            ...row,
            //data_ref: formatDate(row.data_ref)
            data_ref: getFormattedDate(row.data_ref)
        }));
        
        // Caminho para salvar o arquivo CSV
        const filePath = path.join(__dirname, 'relatorio_gerencia_tickets.csv');
        
        // Configurar o escritor de CSV
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                {id: 'tipo', title: 'Tipo do Ticket'},
                {id: 'qtd', title: 'Quantidade do Tipo'},
                {id: 'recepcao_ref', title: 'Recepção de Referência'},
                {id: 'data_ref', title: 'Data de Referência'}
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
