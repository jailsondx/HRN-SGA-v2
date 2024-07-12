import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcPodiumWithSpeaker, FcPrivacy } from "react-icons/fc";
import { FaRegEye  } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import axios from 'axios';

import './TelaLogin.css'

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const TelaLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [snackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const navigate = useNavigate();

    // Função para fechar o Snackbar
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (username && password) {
      try {
        const response = await axios.post(`${NODE_URL}/api/login`, { username, password });

        if (response.status == 200) {
          sessionStorage.setItem('username', username); // Armazena apenas o username na sessão
          navigate('/gerencia');
        } else {
          setFeedbackMessage('Erro ao Obter Resposta Correta do Servidor');
          setAlertSeverity('error');
          setOpenSnackbar(true);
          //alert('Usuario ou Senha inválidas. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error('Erro no login (TelaLogin.jsx: handleLogin => TryCache)\n\n', error);
        setFeedbackMessage('Usuario ou Senha inválidas.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        //alert('Erro no login. Por favor, verifique suas credenciais e tente novamente.');
      }
    } else {
      setFeedbackMessage('Por favor, preencha todos os campos.');
      setAlertSeverity('warning');
      setOpenSnackbar(true);
      //alert('Por favor, insira um nome de usuário e senha, os campos nao podem ser vazios.');
    }
  };

    // Função para alternar a visibilidade da senha
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

  return (
    <div className='form-Login'>
      <span className='span-Title-g'>Login</span>
      <form onSubmit={handleLogin}>

        <div className='container-Login'>
          <div className='container-Icon-Login'>
            <FcPodiumWithSpeaker className="Icon-Login" />
          </div>
          <div className='container-Input-Login'>
            <span>Login</span>
            <input
              className='input-Username-Login'
              type="text"
              placeholder="Nome de Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className='container-Login'>
          <div className='container-Icon-Login'>
            <FcPrivacy className="Icon-Login" />
          </div>
          <div className='container-Input-Login'>
            <span>Senha</span>
            <div className='password-container'>
              <input
                className='input-Password-Login'
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className='container-Icon-VisiblePassword-Login' onClick={toggleShowPassword}>
                {showPassword ? <FaEyeLowVision  className="Icon-Visibility-Password-g"/> : <FaRegEye className="Icon-Visibility-Password-g"/>}
          </div>
        </div>

        <button type="submit">Login</button>
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

export default TelaLogin;
