import React, { useState, useEffect } from "react";
import './TopMenu.css';

const TopMenuGerencia = ({ onSelectComponent }) => {
  const username = sessionStorage.getItem('username');
  const userLevel = sessionStorage.getItem('level'); // Obtém o nível de acesso do usuário

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
      </nav>
    </div>
  );
}

export default TopMenuGerencia;
