import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketButtonPG1 from '../../components/TicketButton/TicketButtonPG1';
import './Totem.css';

function Totem() {
  const navigate = useNavigate();
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
    } else {
      navigate('/TotemPG1');
    }
  }, [totemLocation, navigate]);

  return (
    <div className='body-Totem'>
      {showOptions ? (
        <div className='options-container'>
          <label htmlFor='totemLocation'>Escolha a localização desse Totem:</label>
          <select id='totemLocation' onChange={handleSelectChange} value={selectedLocation}>
            <option value='' disabled>Selecione uma opção</option>
            <option value='Recepcao Principal'>Recepção Principal</option>
            <option value='Recepcao Emergencia'>Recepção Emergência</option>
            <option value='Recepcao Ambulatorio'>Recepção Ambulatório</option>
          </select>
          <div className='totem-buttons-container'>
            <button onClick={handleConfirm} disabled={!selectedLocation}>Confirmar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      ) : (
        <label>Definido como {totemLocation}</label>
      )}
    </div>
  );
}

export default Totem;
