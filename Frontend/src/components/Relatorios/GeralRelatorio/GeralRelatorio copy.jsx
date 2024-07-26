import React from 'react';
import axios from 'axios';


const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;


const GeralRelatorio = () => {
    const handleExport = async () => {
        try {
            const response = await axios.get(`${NODE_URL}/api/export-csv`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'relatorio_gerencia_tickets.csv'); // Nome do arquivo que será baixado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
        }
    };

    return (
        <div>
            <button onClick={handleExport}>Exportar CSV</button>
        </div>
    );
};

export default GeralRelatorio;
