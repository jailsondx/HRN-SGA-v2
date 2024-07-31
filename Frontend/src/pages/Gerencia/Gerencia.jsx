import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopMenuGerencia from '../../components/TopMenu/TopMenuGerencia';
import Cadastro from '../../components/CadastroUser/CadastroUser'
import Servicos from '../../components/Servicos/Servicos';

import './Gerencia.css'
import ListaUsuarios from '../../components/ListaUsuarios/ListaUsuarios';
import MediaAtendimento from '../../components/Dashboard/Painel-MediaAtendimento/MediaAtendimento';



const Home = () => <div>Home Content</div>;
const About = () => <div>About Content</div>;

const Gerencia = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState('Home');

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/Login');
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Home':
        return <MediaAtendimento />
        //return <Home />;
      case 'Sobre':
        return <About />;
      case 'Servicos':
        return <Servicos />;
      case 'Cadastro':
        return <Cadastro />;
      case 'Usuarios':
        return <ListaUsuarios />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <TopMenuGerencia onSelectComponent={setSelectedComponent} />
      <div className="container-TelaGerencia">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Gerencia;
