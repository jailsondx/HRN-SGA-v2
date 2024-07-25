import React, { useState, useEffect } from "react";
import './TopMenu.css';

const TopMenuGerencia = ({ onSelectComponent }) => {

  const username = sessionStorage.getItem('username');

  return (
    <div className='Menu'>
      <nav className='Menu-Navbar'>
        <div className='Menu-Title'>
          <span className="span-Title-TopMenu">Gerência HRN SGA</span>
          <span className="span-SubTitle-TopMenu">{username}</span>
        </div>
        <div className="container-Buttons-TopMenu">
            <a className="menu-item" href="#" onClick={() => onSelectComponent('Home')}>Home</a>
            <a className="menu-item" href="#" onClick={() => onSelectComponent('About')}>About</a>
            <a className="menu-item" href="#" onClick={() => onSelectComponent('Servicos')}>Serviços</a>
            <a className="menu-item" href="#" onClick={() => onSelectComponent('Cadastro')}>Cadastro</a>
        </div>
      </nav>
    </div>
  );

}


export default TopMenuGerencia;
