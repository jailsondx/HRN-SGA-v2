import React, { useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import buttons from '../ButtonsType/ButtonsType';
import { useDispatch } from 'react-redux';
import { setValue } from '../../Store';

import './ChamaButton.css';
import { VerificaLocalStorage, VerificaLocalStorageGuiche, VerificaLocalStorageRecepcao } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ChamaButton = ({ socket }) => {
  // Obtendo a instância do socket e informações de localização
  const socketTelaAtendimento = socket;
  const recepcaoLocation = VerificaLocalStorageRecepcao();
  const guicheLocation = VerificaLocalStorageGuiche();
  const chamaTicket = useDispatch();

  // Função para enviar mensagem ao servidor quando um botão é clicado
  const enviarMensagem = async (event) => {
    const ticketID = event.target.id;

    // Verifica se a recepção e o guichê estão definidos
    if (VerificaLocalStorage() == null) {
      alert('Recepção e/ou Guiché não foi definido');
    } else {
      try {
        // Envia requisição POST ao servidor para chamar o ticket
        const response = await axios.post(`${NODE_URL}/api/chamaTicket`, { id: ticketID, local: recepcaoLocation });
        const ticketGuiche = [recepcaoLocation, guicheLocation, response.data];

        if(response.data.includes("Não")){
          chamaTicket(setValue(ticketGuiche[2]));
        } else {
          // Atualiza o estado com o valor do ticket e envia mensagem pelo socket
          chamaTicket(setValue(ticketGuiche[2]));
          socketTelaAtendimento.emit('Mensagem:TicketChamado', ticketGuiche);
        }
        

      } catch (error) {
        console.error('There was an error sending the data!', error);
      }
    }
  };

  return (
    <div className='container-ChamaButton'>
      <div className='container-row-Buttons'>
        {/* Renderiza os primeiros 4 botões */}
        {buttons.slice(0, 4).map(button => (
          <button className='Button-Chama-Ticket' id={button.id} onClick={enviarMensagem} key={button.id}>
            {button.label}
          </button>
        ))}
      </div>

      <div className='container-row-Buttons'>
        {/* Renderiza os próximos 6 botões */}
        {buttons.slice(4, 10).map(button => (
          <button className='Button-Chama-Ticket' id={button.id} onClick={enviarMensagem} key={button.id}>
            {button.label}
          </button>
        ))}
      </div>


    </div>
  );
};

export default ChamaButton;
