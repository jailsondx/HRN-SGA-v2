import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './zera.css';

const ZerarTickets = () => {
  const [recepcaoLocation, setRecepcaoLocation] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('showModal state changed:', showModal);
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    console.log('Confirm clicked');
    const username = sessionStorage.getItem('username');
    try {
      const response = await axios.delete('http://localhost:3001/api/zerartickets', {
        data: { recepcaoLocation, username },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Erro ao zerar tickets:', error);
      alert('Erro ao zerar tickets');
    } finally {
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recepcao">Selecione a Recepção:</label>
          <select
            id="recepcaoLocation"
            value={recepcaoLocation}
            onChange={(e) => setRecepcaoLocation(e.target.value)}
            required
          >
            <option value="" disabled>Selecione a Recepção</option>
            <option value="Recepcao Principal">Recepção Principal</option>
            <option value="Recepcao Emergencia">Recepção Emergência</option>
            <option value="Recepcao Ambulatorio">Recepção Ambulatório</option>
          </select>
        </div>
        <button type="submit">Zerar Tickets</button>
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Ação</h2>
            <p>Tem certeza que deseja zerar os tickets para {recepcaoLocation}?</p>
            <button onClick={handleConfirm}>Confirmar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ZerarTickets;
