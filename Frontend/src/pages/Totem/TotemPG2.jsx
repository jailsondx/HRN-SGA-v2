import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketButtonPG2 from '../../components/TicketButton/TicketButtonPG2';
import './Totem.css';

function TotemPG2() {
  const navigate = useNavigate();
  const totemLocation = localStorage.getItem('totemLocation');

  useEffect(() => {
    if (!totemLocation) {
      navigate('/Totem');
    }
  }, [totemLocation, navigate]);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);


  return (
    <div className='body-Totem'>
      <TicketButtonPG2 />
    </div>
  );
}

export default TotemPG2;
