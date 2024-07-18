import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaTicketsGerencia.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaTicketsGerencia = ({ recepcaoLocation }) => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (ticketId) => {
    //if (window.confirm(`Você tem certeza que deseja apagar o ticket ${ticketId}?`)) {
      const username = sessionStorage.getItem('username');
      try {
        await axios.delete(`${NODE_URL}/api/deletaticket`, {
          data: { ticketId, recepcaoLocation, username },
        });
        setTickets((prevTickets) => prevTickets.filter(ticket => ticket.id !== ticketId));
      } catch (error) {
        console.error('Erro ao apagar ticket:', error);
        setError('Erro ao apagar ticket');
      }
    //}
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
                        onClick={() => handleDelete(ticket.id)} 
                    />
                </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListaTicketsGerencia;
