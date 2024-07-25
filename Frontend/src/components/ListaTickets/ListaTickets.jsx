import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaTickets.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaTickets = ({ refLocation }) => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const recebeTickets = async () => {
      try {
        const response = await axios.get(`${NODE_URL}/api/listaTickets`, {
          params: {
            local: refLocation,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        setError('Erro ao buscar tickets');
      }
    };

    recebeTickets();
    const intervalId = setInterval(recebeTickets, 60000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);

  }, [refLocation]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container-Lista-Tickets'>
      <div className='container-Title-Module-Atendimento-g'>
        <span className='span-P-Title-g'>Lista de Tickets</span>
      </div>
      <div>
        <ul className='container-Tickets-Gerados'>
          {tickets.map((ticket) => (
            <li className='list-Tickets-Item' key={ticket.id}>
              {ticket.tipo} - {ticket.numero}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListaTickets;
