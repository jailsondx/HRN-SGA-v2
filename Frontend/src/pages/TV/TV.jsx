// src/components/TV.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { falarTexto } from '../../functions/SpeechText';
import { VerificaLocalStorageTV } from '../../functions/LocalStorageVerification';
import TVTicket from '../../components/TV/TV-Ticket/TV-Ticket';
import TVList from '../../components/TV/TV-List/TV-List';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TV = () => {
  const [ticket, setTicket] = useState('');
  const [guiche, setGuiche] = useState('');
  const [tvLocation, setTvLocation] = useState(localStorage.getItem('tvLocation'));
  const [showOptions, setShowOptions] = useState(!tvLocation);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Função para lidar com a mudança de seleção da localização
  const handleSelectChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Função para confirmar a seleção da localização e salvá-la no localStorage
  const handleConfirm = () => {
    localStorage.setItem('tvLocation', selectedLocation);
    setTvLocation(selectedLocation);
    setShowOptions(false);
  };

  // Função para cancelar a seleção da localização
  const handleCancel = () => {
    setSelectedLocation('');
    setShowOptions(false);
  };

  // Exibir opções de localização se nenhuma localização estiver definida
  useEffect(() => {
    if (!tvLocation) {
      setShowOptions(true);
    }
  }, [tvLocation]);

  useEffect(() => {
    const socket = io(NODE_URL, {
      reconnection: true,            // Habilitar reconexão automática
      reconnectionAttempts: 10,      // Número de tentativas de reconexão
      reconnectionDelay: 1000,       // Tempo de espera antes da primeira tentativa de reconexão (em ms)
      reconnectionDelayMax: 5000,    // Tempo máximo de espera entre tentativas de reconexão (em ms)
      timeout: 20000,                // Tempo de espera antes de considerar a conexão como perdida (em ms)
    });

    // Verifica e define a localização da TV a partir do localStorage
    const recepcaoLocation = VerificaLocalStorageTV();

    // Entra na sala 'SalaTV' com o valor de recepcaoLocation
    socket.emit('SalaTV', recepcaoLocation);

    // Handler para evento de mensagem de ticket em atendimento
    socket.on('Mensagem:TicketEmAtendimento', (ticketData) => {
      if (!ticketData.includes('Não há ticket do tipo')) {
        setTicket(ticketData[2]);
        setGuiche(ticketData[1]);
        falarTexto(ticketData[2]);
        falarTexto(ticketData[1]);
      }
    });

    // Handlers para eventos de conexão e reconexão
    socket.on('connect', () => {
      console.log('Conectado ao servidor Socket.IO');
    });

    socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.IO');
      window.location.reload();
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log(`Tentativa de reconexão: ${attempt}`);
    });

    socket.on('reconnect', (attempt) => {
      console.log(`Reconectado após ${attempt} tentativas`);
      socket.emit('SalaTV', recepcaoLocation); // Reentrar na sala após reconexão
    });

    // Limpeza ao desmontar o componente
    return () => {
      socket.off('Mensagem:TicketEmAtendimento');
      socket.disconnect();
    };
  }, []);

  return (
    <div className='body-Tv'>
      {showOptions ? (
        <div className='options-container'>
          <label htmlFor='tvLocation'>Escolha a localização dessa TV:</label>
          <select id='tvLocation' onChange={handleSelectChange} value={selectedLocation}>
            <option value='' disabled>Selecione uma opção</option>
            <option value='TV Recepcao Principal'>Recepção Principal</option>
            <option value='TV Recepcao Emergencia'>Recepção Emergência</option>
            <option value='TV Recepcao Ambulatorio'>Recepção Ambulatório</option>
          </select>
          <div className='tv-buttons-container'>
            <button onClick={handleConfirm} disabled={!selectedLocation}>Confirmar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div>
          <TVTicket ticket={ticket} guiche={guiche}/>
          <span className='label-Local-g'>Local: {tvLocation}</span>
        </div>
      )}
    </div>
  );
};

export default TV;
