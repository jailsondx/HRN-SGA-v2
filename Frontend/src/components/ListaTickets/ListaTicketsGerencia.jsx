import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmModal from '../Modal/ConfirmModal';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './ListaTicketsGerencia.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaTicketsGerencia = ({ recepcaoLocation }) => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const recebeTickets = async () => {
      try {
        const response = await axios.get(`${NODE_URL}/api/listaTickets`, {
          params: {
            local: recepcaoLocation,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        setError('Tickets não encontrados');
      }
    };

    if (recepcaoLocation) {
      recebeTickets();
      const intervalId = setInterval(recebeTickets, 60000);

      // Limpa o intervalo quando o componente é desmontado
      return () => clearInterval(intervalId);
    }
  }, [recepcaoLocation]);

  const handleDelete = async () => {
    const username = sessionStorage.getItem('username');
    try {
      await axios.delete(`${NODE_URL}/api/deletaticket`, {
        data: { ticketId: selectedTicketId, recepcaoLocation, username },
      });
      setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== selectedTicketId));
      setSnackbarMessage('Ticket apagado com sucesso');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erro ao apagar ticket:', error);
      setSnackbarMessage('Erro ao apagar ticket');
      setSnackbarSeverity('error');
    }
    setShowModal(false);
    setSnackbarOpen(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>{error}</div>;
  }

  const handleOpenModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicketId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Pesquisar tickets" 
        value={searchTerm} 
        onChange={handleSearch} 
        className='input-search-bar'
      />
      <div className='scrollable-list'>
        <ul>
          {filteredTickets.map((ticket) => (
            <li className='li-Tickets-Itens' key={ticket.id}>
                <div className='div-list-Tickets-Text'>
                    {ticket.tipo} - {ticket.numero}
                </div>
                <div className='div-list-Tickets-Button'>
                    <img 
                        src='escudo-vermelho.png' 
                        alt='Apagar' 
                        className='Icon-delete-ticket-g' 
                        onClick={() => handleOpenModal(ticket.id)} 
                    />
                </div>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmModal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        onConfirm={handleDelete}
        message="Tem certeza que deseja apagar este ticket?"
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

export default ListaTicketsGerencia;
