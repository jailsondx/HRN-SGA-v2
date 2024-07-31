import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import ChamaButton from '../ChamaButton/ChamaButton';
import ListaTickets from '../ListaTickets/ListaTickets';
import EspecialChamaButton from '../EspecialChamaButton/EspecialChamaButton';
import ContadorAtendimentos from '../Mini Modulos/ContadorAtendimentos/ContadorAtendimentos';
import Weather from '../Mini Modulos/Weather/Weather';
import { VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';
import './TelaAtendimento.css';


// Certifique-se de que o NODE_URL está correto
const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TelaAtendimento = () => {
  const [mostrarMais, setMostrarMais] = useState(false);
  const [socket, setSocket] = useState(null);
  const ticketAtendimento = useSelector((state) => state.value.value);
  const [tableRef, setTableRef] = useState('');

  useEffect(() => {
    const recepcaoLocation = VerificaLocalStorageRecepcao();
    const guicheLocation = VerificaLocalStorageGuiche();
    const newSocket = io(NODE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Erro na conexão WebSocket:', error);
    });

    newSocket.emit('Atendimento', recepcaoLocation, guicheLocation);
    setSocket(newSocket);

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
          <div className='container-Title-Module-Atendimento-g'>
            <span className='span-Title-g'>Ticket em Atendimento</span>
          </div>
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

        <div className='container-Mini-Containers'>
          <ContadorAtendimentos refLocation={tableRef} />
          <Weather refLocation={tableRef} />
        </div>

      </div>
      <div className='container-Atendimento-Lista'>
        <ListaTickets refLocation={tableRef} />
      </div>
    </div>
  );
};

export default TelaAtendimento;
