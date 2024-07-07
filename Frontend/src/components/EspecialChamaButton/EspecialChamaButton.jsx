import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { setValue } from '../../GlobalTicket';

import './EspecialChamaButton.css';
import { VerificaLocalStorage, VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const EspecialChamaButton = ({ id, socket }) => {
  const socketTelaAtendimento = socket;
  const chamaTicket = useDispatch();
  var recepcaoLocation = VerificaLocalStorageRecepcao();
  var guicheLocation = VerificaLocalStorageGuiche();

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
    } else {
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
    <div className='container-Button'>
      <Button
        variant="warning"
        className='Button-Chama-Ticket-Proximo' 
        id='PROX' 
        onClick={enviarMensagem} 
        key='proximo'
      >
        Chamar Proximo
      </Button>
      <Button
        variant="secondary"
        className='Button-Chama-Ticket-Repeat' 
        id='REPEAT' 
        onClick={enviarMensagemRepeat} 
        key={id}
      >
        Chamar Novamente
      </Button>
    </div>
  );
};

export default EspecialChamaButton;
