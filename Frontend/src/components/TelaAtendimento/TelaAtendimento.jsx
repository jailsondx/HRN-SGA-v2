import React, { useState, useContext } from 'react';
import { io } from 'socket.io-client';
import ChamaButton from '../ChamaButton/ChamaButton';
import ListaTickets from '../ListaTickets/ListaTickets';
import EspecialChamaButton from '../EspecialChamaButton/EspecialChamaButton';
import { useSelector } from 'react-redux';

import './TelaAtendimento.css';
import { VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';
import ContadorAtendimentos from '../ContadorAtendimentos/ContadorAtendimentos';

const recepcaoLocation = VerificaLocalStorageRecepcao();
const guicheLocation = VerificaLocalStorageGuiche();

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;
const socket = io(NODE_URL);

const TelaAtendimento = () => {
  const [mostrarMais, setMostrarMais] = useState(false);
  //const [ticketAtendimento, setTicketAtendimento] = useState(null);
  const ticketAtendimento = useSelector((state) => state.value.value);

  socket.emit('Atendimento', recepcaoLocation, guicheLocation);

  const handleMostrarMais = () => {
    setMostrarMais(!mostrarMais);
  };

  return (
    <div className='container-Atendimento'>
      <div className={`container-Atendimento-Principal ${mostrarMais ? 'show' : 'hide'}`}>
        <div className='container-Ticket-Atendimento'>
          <span className='span-Label-Title'>Ticket em Atendimento</span>
          <div className='ticketChamado' id='ticketChamado'>{ticketAtendimento}</div>
        </div>
        <div className='container-Atendimento-Buttons'>
          <EspecialChamaButton id={ticketAtendimento} socket={socket} />
          <span className='moreButtons' onClick={handleMostrarMais}>
            {mostrarMais ? 'Esconder Botões' : 'Mais Botões'}
          </span>
          <div className={`container-chamaButton ${mostrarMais ? 'show' : 'hide'}`}>
            <ChamaButton socket={socket} />
          </div>
        </div>
        <ContadorAtendimentos />
      </div>
      <div className='container-Atendimento-Lista'>
        <ListaTickets />
      </div>
    </div>
  );
};

export default TelaAtendimento;
