import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

import '../Relatorios.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const GeralRelatorio = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRecepcoes, setSelectedRecepcoes] = useState([]);
    const [error, setError] = useState(null);
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

    const handleCheckboxChange = (recepcao) => {
        setSelectedRecepcoes((prevSelected) =>
            prevSelected.includes(recepcao)
                ? prevSelected.filter((item) => item !== recepcao)
                : [...prevSelected, recepcao]
        );
    };

    const handleExport = async () => {
        if (!startDate || !endDate || selectedRecepcoes.length === 0) {
            setFeedbackMessage('ERRO: Por favor, preencha todos os campos mínimos necessários.');
            setAlertSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.get(`${NODE_URL}/api/GeralRelatorio`, {
                responseType: 'blob',
                params: {
                    startDate,
                    endDate,
                    recepcoes: selectedRecepcoes.join(','),
                },
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Relatorio-Geral-${startDate}-a-${endDate}.csv`); // Nome do arquivo que será baixado
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setError(null); // Clear error if successful
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
                <span className='span-Title-g'>Relatório Geral</span>
            </div>

            <div className='container-Dados-CSV'>
                <div className='div-Relatorio-Datas'>
                    <div className='inputs-textData'>
                        <span>Data de Início:</span>
                        <span>Data de Fim:</span>
                    </div>
                    <div className='inputs-Data'>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </div>
                </div>

                <div className='div-Relatorio-Recepcoes'>
                    <span>
                        <input
                            type="checkbox"
                            checked={selectedRecepcoes.includes('Recepcao Principal')}
                            onChange={() => handleCheckboxChange('Recepcao Principal')}
                        />
                        Recepção Principal
                    </span>
                    <span>
                        <input
                            type="checkbox"
                            checked={selectedRecepcoes.includes('Recepcao Emergencia')}
                            onChange={() => handleCheckboxChange('Recepcao Emergencia')}
                        />
                        Recepção Emergência
                    </span>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedRecepcoes.includes('Recepcao Ambulatorio')}
                            onChange={() => handleCheckboxChange('Recepcao Ambulatorio')}
                        />
                        Recepção Ambulatório
                    </label>
                </div>
            </div>

            <button onClick={handleExport}>Exportar CSV</button>
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

export default GeralRelatorio;
