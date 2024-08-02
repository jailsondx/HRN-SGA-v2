import React, { useState } from "react";
import './TopMenu.css';
import { FaKeycdn } from "react-icons/fa";
import PasswordUpdateModal from "../Modal/PasswordUpdateModal";
import axios from 'axios';
import { validatePassword } from '../../functions/ValidatePassword';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TopMenuGerencia = ({ onSelectComponent }) => {
  const [showModal, setShowModal] = useState(false);
  const [snackbar, setOpenSnackbar] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const username = sessionStorage.getItem('username');
  const userLevel = sessionStorage.getItem('level'); // Obtém o nível de acesso do usuário

  const handleSave = async (newPassword) => {
    if (!validatePassword(newPassword)) {
      setFeedbackMessage('A senha deve ter pelo menos 8 caracteres e incluir letras e números.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${NODE_URL}/api/cadastro-update-password`, {
        username,            // O usuário que está solicitando a mudança
        targetUsername: username,  // O usuário que terá a senha atualizada (neste caso, o mesmo)
        newPassword
      });

      const { message, error } = response.data;

      if (message) {
        setFeedbackMessage(message);
        setAlertSeverity('success');
      } else if (error) {
        setFeedbackMessage(error);
        setAlertSeverity('error');
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      setFeedbackMessage('Erro ao atualizar senha. Por favor, tente novamente mais tarde.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setShowModal(false);
    }
  };

  // Função para fechar o Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className='Menu'>
      <nav className='Menu-Navbar'>
        <div className='Menu-Title'>
          <span className="span-Title-TopMenu">Gerência HRN SGA</span>
          <span className="span-SubTitle-TopMenu">{username}</span>
        </div>
        <div className="container-Buttons-TopMenu">
          <a className="menu-item" href="#" onClick={() => onSelectComponent('Home')}>Home</a>
          <a className="menu-item" href="#" onClick={() => onSelectComponent('Sobre')}>Sobre</a>
          <a className="menu-item" href="#" onClick={() => onSelectComponent('Servicos')}>Serviços</a>
          {userLevel === ('master' || 'supervisor') && (
            <a className="menu-item" href="#" onClick={() => onSelectComponent('Cadastro')}>Cadastro</a>
          )}
          {userLevel === 'master' && (
            <a className="menu-item" href="#" onClick={() => onSelectComponent('Usuarios')}>Usuarios</a>
          )}
        </div>
        <div className="Menu-Icon">
          <FaKeycdn className="Icon" onClick={() => setShowModal(true)} />
        </div>
      </nav>
      <PasswordUpdateModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onConfirm={handleSave} // Passa a função para receber a nova senha
        message="Definir nova senha"
        username={username}
      />

      <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default TopMenuGerencia;
