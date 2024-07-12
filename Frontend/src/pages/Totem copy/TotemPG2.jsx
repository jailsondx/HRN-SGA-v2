import React, { useState, useEffect } from 'react';
import TicketButtonPG2 from '../../components/TicketButton/TicketButtonPG2';
import './Totem.css';

function Totem() {
  const [totemLocation, setTotemLocation] = useState(localStorage.getItem('totemLocation'));
  const [showOptions, setShowOptions] = useState(!totemLocation);
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleSelectChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleConfirm = () => {
    localStorage.setItem('totemLocation', selectedLocation);
    setTotemLocation(selectedLocation);
    setShowOptions(false);
  };

  const handleCancel = () => {
    setSelectedLocation('');
    setShowOptions(false);
  };

  useEffect(() => {
    if (!totemLocation) {
      setShowOptions(true);
    }
  }, [totemLocation]);

  return (
    <div className='body-Totem'>
      {showOptions ? (
        <div className='options-container'>
          <label htmlFor='totemLocation'>Escolha a localização desse Totem:</label>
          <select id='totemLocation' onChange={handleSelectChange} value={selectedLocation}>
            <option value='' disabled>Selecione uma opção</option>
            <option value='rec_principal'>Recepção Principal</option>
            <option value='rec_emergencia'>Recepção Emergência</option>
            <option value='rec_ambulatorio'>Recepção Ambulatório</option>
          </select>
          <div className='totem-buttons-container'>
            <button onClick={handleConfirm} disabled={!selectedLocation}>Confirmar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      ) : (
        <TicketButtonPG2 />
      )}
    </div>
  );
}

export default Totem;
