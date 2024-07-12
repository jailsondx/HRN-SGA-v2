import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaTickets.css';
import { VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ListaTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  const recepcaoLocation = VerificaLocalStorageRecepcao();

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
        setError('Erro ao buscar tickets');
      }
    };

    recebeTickets();
    //Atualiza a lista a cada 60 segundos
    setInterval(recebeTickets, 60000);
    
  }, [recepcaoLocation]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container-Lista-Tickets'>
      <span className='span-Label-Lista-Tickets'>Lista de Tickets</span>
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
