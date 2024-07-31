import React, { useState } from 'react';
import { FcPodiumWithSpeaker, FcPrivacy, FcAnswers } from "react-icons/fc";
import { FaRegEye  } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { validatePassword } from '../../functions/ValidatePassword';
import './CadastroUser.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const Cadastro = () => {
  // Definição dos estados
  const [cadUsername, setCadUsername] = useState('');
  const [cadPassword, setCadPassword] = useState('');
  const [cadFullName, setCadFullName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [snackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  // Função para fechar o Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Função para submissão do formulário
  const handleRegister = async (event) => {
    event.preventDefault();
    const username = sessionStorage.getItem('username');

    if (!cadUsername || !cadPassword || !cadFullName) {
      setFeedbackMessage('Por favor, preencha todos os campos.');
      setAlertSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(cadPassword)) {
      setFeedbackMessage('A senha deve ter pelo menos 8 caracteres e incluir letras e números.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${NODE_URL}/api/cadastro`, { username, cadUsername, cadPassword, cadFullName });
      const { message } = response.data;

      setFeedbackMessage(message);
      setAlertSeverity('success');
      setOpenSnackbar(true);
      setCadFullName('');
      setCadUsername('');
      setCadPassword('');
    } catch (error) {
      if (error.response && error.response.data) {
        setFeedbackMessage(error.response.data.error);
      } else {
        setFeedbackMessage('Erro no cadastro. Por favor, tente novamente.');
      }
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='form-Cadastro'>
      <div className='div-Title-Form-g'>
        <span className='span-Title-g'>Cadastro de Novo Usuário</span>
      </div>

      <form onSubmit={handleRegister}>
        <div className='container-Cadastro'>
          <div className='container-Icon-Cadastro'>
            <FcAnswers className="Icon-Cadastro" />
          </div>
          <div className='container-Input-Cadastro'>
            <span>Nome Completo</span>
            <input
              className='input-FullName-Cadastro'
              type="text"
              placeholder="Nome Completo"
              value={cadFullName}
              onChange={(e) => setCadFullName(e.target.value)}
            />
          </div>
        </div>

        <div className='container-Cadastro'>
          <div className='container-Icon-Cadastro'>
            <FcPodiumWithSpeaker className="Icon-Cadastro" />
          </div>
          <div className='container-Input-Cadastro'>
            <span>Login</span>
            <input
              className='input-Username-Cadastro'
              type="text"
              placeholder="Nome de Usuário"
              value={cadUsername}
              onChange={(e) => setCadUsername(e.target.value)}
            />
          </div>
        </div>

        <div className='container-Cadastro'>
          <div className='container-Icon-Cadastro'>
            <FcPrivacy className="Icon-Cadastro" />
          </div>
          <div className='container-Input-Cadastro'>
            <span>Senha</span>
            <div className='cadPassword-container'>
              <input
                className='input-Password-Cadastro'
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={cadPassword}
                onChange={(e) => setCadPassword(e.target.value)}
              />
            </div>
          </div>
          <div className='container-Icon-VisiblePassword-Cadastro' onClick={toggleShowPassword}>
                {showPassword ? <FaEyeLowVision  className="Icon-Visibility-Password-g"/> : <FaRegEye className="Icon-Visibility-Password-g"/>}
          </div>
        </div>

        <button type="submit">Cadastrar</button>
      </form>

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
};

export default Cadastro;
