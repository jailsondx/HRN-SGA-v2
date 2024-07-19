// CustomModal.js
import React from 'react';
import Modal from 'react-modal';
import './Modal.css';

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className='div-Modal'>
        <p>{message}</p>
        <button className='button-Modal-Confirm' onClick={onConfirm}>Confirmar</button>
        <button className='button-Modal-Cancel' onClick={onRequestClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default CustomModal;
