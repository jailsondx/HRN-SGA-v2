import React, { useState } from 'react';
import axios from 'axios';
import ConfirmModal from '../Modal/ConfirmModal';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './ZerarTickets.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ZerarTickets = () => {
  const [recepcaoLocation, setRecepcaoLocation] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleConfirm = async () => {
    const username = sessionStorage.getItem('username');
    try {
      const response = await axios.delete(`${NODE_URL}/api/zerartickets`, {
        data: { recepcaoLocation, username },
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erro ao zerar tickets:', error);
      setSnackbarMessage('Erro ao zerar tickets');
      setSnackbarSeverity('error');
    }
    setShowModal(false);
    setSnackbarOpen(true);
  };

  const handleOpenModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className='div-pai-ZerarTicket'>
      <form className='form-Zerar-Ticket' onSubmit={handleOpenModal}>
        <div className='div-Title-Form-g'>
          <span className='span-Title-g'>Limpar Tickets</span>
          <br/>
          <span className='span-P-Title-g'>Limpa todos os tickets, zerando os contadores</span>
        </div>
        <div>
          <select
            className='select-g'
            id="recepcaoLocation"
            value={recepcaoLocation}
            onChange={(e) => setRecepcaoLocation(e.target.value)}
            required
          >
            <option value="" disabled>Selecione a Recepção</option>
            <option value="Recepcao Principal">Recepção Principal</option>
            <option value="Recepcao Emergencia">Recepção Emergência</option>
            <option value="Recepcao Ambulatorio">Recepção Ambulatório</option>
          </select>
        </div>
        <button type="submit">Zerar Tickets</button>
      </form>
      <ConfirmModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        onConfirm={handleConfirm}
        message="Tem certeza que deseja zerar os tickets?"
      />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ZerarTickets;
