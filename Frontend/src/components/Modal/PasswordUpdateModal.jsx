// CustomModal.js
import React, { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";
import Modal from 'react-modal';
import './Modal.css';

Modal.setAppElement('#root');

const PasswordUpdateModal = ({ isOpen, onRequestClose, onConfirm, message, username }) => {
  const [updatePassword, setUpdatePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const handleConfirm = () => {
    onConfirm(updatePassword); // Passa a senha atualizada para o componente pai
    setUpdatePassword('');
    onRequestClose(); // Fecha o modal
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
        <div>
          <form>
            <p>Usuário: {username}</p>
            <div className='div-Update-Password'>
              <input
                className='input-Password-Cadastro'
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={updatePassword}
                onChange={(e) => setUpdatePassword(e.target.value)}
                autoComplete='off'
              />

              <div className='container-Icon-VisiblePassword-Update' onClick={toggleShowPassword}>
                {showPassword ? <FaEyeLowVision className="Icon-Visibility-Password-g" /> : <FaRegEye className="Icon-Visibility-Password-g" />}
              </div>
            </div>


          </form>
        </div>
        <button className='button-Modal-Confirm' onClick={handleConfirm}>Confirmar</button>
        <button className='button-Modal-Cancel' onClick={onRequestClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default PasswordUpdateModal;
