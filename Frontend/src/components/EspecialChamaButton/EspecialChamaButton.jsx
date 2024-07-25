import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setValue } from '../../Store';

import './EspecialChamaButton.css';
import { VerificaLocalStorage, VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const EspecialChamaButton = ({ id, socket }) => {
  const socketTelaAtendimento = socket;
  const chamaTicket = useDispatch();
  const recepcaoLocation = VerificaLocalStorageRecepcao();
  const guicheLocation = VerificaLocalStorageGuiche();

  const enviarMensagem = async (event) => {
    const ticketID = event.target.id;

    if (VerificaLocalStorage() == null) {
      alert('Recepção e/ou Guiché não foi definido');
    } else {
      try {
        const response = await axios.post(`${NODE_URL}/api/chamaTicket`, { id: ticketID, local: recepcaoLocation });
        const ticketGuiche = [recepcaoLocation, guicheLocation, response.data];
        chamaTicket(setValue(ticketGuiche[2]));
        socketTelaAtendimento.emit('Mensagem:TicketChamado', ticketGuiche);
      } catch (error) {
        console.error('There was an error sending the data!', error);
      }
    }
  };

  const enviarMensagemRepeat = async () => {
    const ticketID = id;
    if (VerificaLocalStorage() == null) {
      alert('Recepção e/ou Guiché não foi definido');
    } else if (ticketID != null) {
      try {
        console.log('Ticket Repetido Chamado:', ticketID);
        const ticketGuiche = [recepcaoLocation, guicheLocation, ticketID];
        chamaTicket(setValue(ticketGuiche[2]));
        socketTelaAtendimento.emit('Mensagem:TicketChamado', ticketGuiche);
      } catch (error) {
        console.error('There was an error sending the data!', error);
      }
    }
  };

  return (
    <div className='container-EspecialChamaButton'>
      <button
        className='Button-Chama-Ticket-Proximo' 
        id='PROX' 
        onClick={enviarMensagem} 
        key='proximo'
      >
        Chamar Proximo
      </button>
      <button
        className='Button-Chama-Ticket-Repeat' 
        id='REPEAT' 
        onClick={enviarMensagemRepeat} 
        key={id}
      >
        Chamar Novamente
      </button>
    </div>
  );
};

export default EspecialChamaButton;
