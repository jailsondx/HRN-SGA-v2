import React, { useState } from 'react';
import { FcPodiumWithSpeaker, FcPrivacy, FcAnswers } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { validatePassword } from '../../functions/ValidatePassword';
import './CadastroUser.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const Cadastro = () => {
  // Definição dos estados
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
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

    if (!username || !password || !fullName) {
      setFeedbackMessage('Por favor, preencha todos os campos.');
      setAlertSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(password)) {
      setFeedbackMessage('A senha deve ter pelo menos 8 caracteres e incluir letras e números.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${NODE_URL}/api/cadastro`, { username, password, fullName });
      const { message } = response.data;

      setFeedbackMessage(message);
      setAlertSeverity('success');
      setOpenSnackbar(true);
      setFullName('');
      setUsername('');
      setPassword('');
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
      <h2>Cadastro de Novo Usuário</h2>
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='container-Cadastro'>
          <div className='container-Icon-Cadastro'>
            <FcPrivacy className="Icon-Cadastro" />
          </div>
          <div className='container-Input-Cadastro'>
            <span>Senha</span>
            <div className='password-container'>
              <input
                className='input-Password-Cadastro'
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          </div>
          <div className='container-Icon-VisiblePassword' onClick={toggleShowPassword}>
                {showPassword ? <AiFillEyeInvisible className="Icon-Visibility"/> : <AiFillEye className="Icon-Visibility"/>}
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
