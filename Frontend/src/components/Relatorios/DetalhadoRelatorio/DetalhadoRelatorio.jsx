import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

import '../Relatorios.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const DetalhadoRelatorio = () => {
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [snackbar, setOpenSnackbar] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Função para fechar o Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`${NODE_URL}/api/DetalhadoRelatorio`);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Relatorio-Detalhado.csv`); // Nome do arquivo que será baixado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setFeedbackMessage('Relatório gerado com sucesso!');
            setAlertSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            setFeedbackMessage('ERRO: Verifique os logs para mais detalhes.');
            setAlertSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <div className='div-Pai-Relatorios'>
            <div className='div-Title-Form-g'>
                <span className='span-Title-g'>Relatório Detalhado</span>
                <br/>
                <span className='span-P-Title-g'>últimos 7 dias</span>
            </div>

            <button onClick={handleExport}>Exportar Relatório</button>
            <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {feedbackMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DetalhadoRelatorio;
