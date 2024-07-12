import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await axios.post(`${NODE_URL}/api/login`, { username, password });

        if (response.status == 200) {
          sessionStorage.setItem('username', username); // Armazena apenas o username na sessão
          navigate('/gerencia');
        } else {
          alert('Usuario ou Senha inválidas. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro no login. Por favor, verifique suas credenciais e tente novamente.');
      }
    } else {
      alert('Por favor, insira um nome de usuário e senha, os campos nao podem ser vazios.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nome de Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
