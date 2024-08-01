// SelectModal.js
import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

Modal.setAppElement('#root');

const SelectModal = ({ isOpen, onRequestClose, onSave, recepcao, setRecepcao, guiche, setGuiche, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className='div-Modal'>
        <div className='div-Title-Form-g'>
          <span className='span-Title-Modal'>{message}</span>
        </div>

        <div className='select-Modal'>

          <div className='select-Modal-text'>
            <span className='span-title-select-Modal'> Recepção: </span>
            <span className='span-title-select-Modal'> Guichê: </span>
          </div>

          <div className='select-Modal-options'>
            <select className='modal-select-option-list' value={recepcao} onChange={(e) => setRecepcao(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Recepcao Principal">Recepção Principal</option>
              <option value="Recepcao Emergencia">Recepção Emergência</option>
              <option value="Recepcao Ambulatorio">Recepção Ambulatório</option>
            </select>
            <select className='modal-select-option-list' value={guiche} onChange={(e) => setGuiche(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Guiche 01">Guichê 1</option>
              <option value="Guiche 02">Guichê 2</option>
              <option value="Guiche 03">Guichê 3</option>
            </select>
          </div>

        </div>


        <button className='button-Modal-Confirm' onClick={onSave}>Salvar</button>
        <button className='button-Modal-Cancel' onClick={onRequestClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default SelectModal;
