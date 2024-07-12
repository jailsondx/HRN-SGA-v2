import axios from 'axios';
import buttons from '../ButtonsType/ButtonsType';
import { useNavigate } from 'react-router-dom';

import './TicketButton.css';
import { VerificaLocalStorageTotem } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TicketButtonPG1 = () => {
  const totemLocation = VerificaLocalStorageTotem();
  const navigate = useNavigate();

  const handleClick = async (event) => {
    const ticketID = event.target.id;
    //const totemLocation = VerificaLocalStorageTotem();
    console.log(ticketID);

    try {
      const response = await axios.post(NODE_URL+'/api/geraTicket', { id: ticketID, local: totemLocation });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('There was an error sending the data!', error);
    }
  };

  const proximaPagina = () => {
    navigate('/TotemPG2');
  };

  return (
    <div>
      <div className='Totem-Buttons-Container'>

          <div className='btn1-2'>
            {buttons.slice(0, 2).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
          ))}
          </div>
        
        <div className='btn1-2'>
          {buttons.slice(2, 3).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
          ))}
          
            <button className='TicketButton' id='O' onClick={proximaPagina}>
              Outros
            </button>
          
        </div>
        <div className='btn1'>
        {buttons.slice(3,4).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
            ))}
        </div>
        <span className='label-Local-g'>Local: {totemLocation}</span>
      </div>
    </div>
  );
};

export default TicketButtonPG1;
