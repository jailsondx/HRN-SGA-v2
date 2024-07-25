// SelectModal.js
import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

Modal.setAppElement('#root');

const SelectModal = ({ isOpen, onRequestClose, onSave, recepcao, setRecepcao, guiche, setGuiche, message}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className='div-Modal'>
        <p>{message}</p>
        <div className='select-Modal'>
            <span className='span-title-select-Modal'> Recepção: </span>
            <select value={recepcao} onChange={(e) => setRecepcao(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Recepcao Principal">Recepção Principal</option>
              <option value="Recepcao Emergencia">Recepção Emergência</option>
              <option value="Recepcao Ambulatorio">Recepção Ambulatório</option>
            </select>
        </div>

        <div className='select-Modal'>
        <span className='span-title-select-Modal'> Guichê: </span>
          <select value={guiche} onChange={(e) => setGuiche(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Guiche 01">Guichê 1</option>
            <option value="Guiche 02">Guichê 2</option>
            <option value="Guiche 03">Guichê 3</option>
          </select>
        </div>
       
        <button className='button-Modal-Confirm' onClick={onSave}>Salvar</button>
        <button className='button-Modal-Cancel' onClick={onRequestClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default SelectModal;
