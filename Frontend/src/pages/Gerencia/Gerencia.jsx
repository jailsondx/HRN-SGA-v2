import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopMenuGerencia from '../../components/TopMenu/TopMenuGerencia';
import Cadastro from '../../components/CadastroUser/CadastroUser'

import './Gerencia.css'


const Home = () => <div>Home Content</div>;
const About = () => <div>About Content</div>;
const Services = () => <div>Services Content</div>;

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
        return <Home />;
      case 'About':
        return <About />;
      case 'Services':
        return <Services />;
      case 'Cadastro':
        return <Cadastro />;
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
