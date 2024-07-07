import axios from 'axios';
import buttons from '../ButtonsType/ButtonsType';
import { useNavigate } from 'react-router-dom';

import './TicketButton.css';
import { VerificaLocalStorageTotem } from '../../functions/LocalStorageVerification';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TicketButtonPG2 = () => {
  const totemLocation = VerificaLocalStorageTotem();
  const navigate = useNavigate();

  const handleClick = async (event) => {
    const ticketID = event.target.id;
    const totemLocation = VerificaLocalStorageTotem();
    console.log(ticketID);
    navigate('/TotemPG1');

    try {
      const response = await axios.post(NODE_URL+'/api/geraTicket', { id: ticketID, local: totemLocation });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('There was an error sending the data!', error);
    }
  };

  return (
    <div>
      <div className='Totem-Buttons-Container'>

          <div className='btn1-2'>
            {buttons.slice(4, 6).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
          ))}
          </div>
        
        <div className='btn1-2'>
          {buttons.slice(6, 8).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
          ))}
        </div>
        <div className='btn1-2'>
        {buttons.slice(8,10).map(button => (
            <button className='TicketButton' id={button.id} onClick={handleClick} key={button.id}>
              {button.label}
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TicketButtonPG2;
