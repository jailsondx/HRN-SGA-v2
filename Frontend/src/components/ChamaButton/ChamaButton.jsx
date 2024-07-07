import React, { useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import buttons from '../ButtonsType/ButtonsType';
import { useDispatch } from 'react-redux';
import { setValue } from '../../GlobalTicket';

import './ChamaButton.css';
import { VerificaLocalStorage, VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';


const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ChamaButton = ({ socket }) => {
  const socketTelaAtendimento = socket;
  const recepcaoLocation = VerificaLocalStorageRecepcao();
  const guicheLocation = VerificaLocalStorageGuiche();
  const chamaTicket = useDispatch();

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

  return (
    <div className='container-Button'>
      {buttons.slice(0, 4).map(button => (
        <Button variant="success" className='Button-Chama-Ticket' id={button.id} onClick={enviarMensagem} key={button.id}>
          {button.label}
        </Button>
      ))}
      {buttons.slice(4, 10).map(button => (
        <Button variant="success" className='Button-Chama-Ticket' id={button.id} onClick={enviarMensagem} key={button.id}>
          {button.label}
        </Button>
      ))}
      <br />
    </div>
  );
};

export default ChamaButton;
