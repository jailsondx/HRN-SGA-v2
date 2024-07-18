import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import ChamaButton from '../ChamaButton/ChamaButton';
import ListaTickets from '../ListaTickets/ListaTickets';
import EspecialChamaButton from '../EspecialChamaButton/EspecialChamaButton';
import ContadorAtendimentos from '../ContadorAtendimentos/ContadorAtendimentos';
import { VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';
import './TelaAtendimento.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TelaAtendimento = () => {
  const [mostrarMais, setMostrarMais] = useState(false);
  const [socket, setSocket] = useState(null);
  const ticketAtendimento = useSelector((state) => state.value.value);
  const [tableRef, setTableRef] = useState('');

  // Efeito para criar e gerenciar a conexão WebSocket
  useEffect(() => {
    const recepcaoLocation = VerificaLocalStorageRecepcao();
    const guicheLocation = VerificaLocalStorageGuiche();
    const newSocket = io(NODE_URL);

    newSocket.emit('Atendimento', recepcaoLocation, guicheLocation);
    setSocket(newSocket);

    // Atualizar o tableRef com a localização da recepção
    setTableRef(recepcaoLocation);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleMostrarMais = () => {
    setMostrarMais(!mostrarMais);
  };

  if (!socket) return <div>Loading...</div>;

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
        <ListaTickets refLocation={tableRef} />
      </div>
    </div>
  );
};

export default TelaAtendimento;
