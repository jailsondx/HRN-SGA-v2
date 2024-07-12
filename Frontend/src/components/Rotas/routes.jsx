// Routes.js

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TotemPG1 from '../../pages/Totem/TotemPG1'
import TotemPG2 from '../../pages/Totem/TotemPG2'
import Totem from '../../pages/Totem/Totem'
import TV from '../../pages/TV/TV'
import Atendimento from '../../pages/Atendimento/Atendimento';
import Gerencia from '../../pages/Gerencia/Gerencia';
import Login from '../../pages/Login/Login';



function Rotas (){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' />
          <Route path='/Login' element={<Login />} />
          <Route path='/Gerencia' element={<Gerencia />} />
          <Route path='/Totem' element={<Totem />} />
          <Route path='/TotemPG1' element={<TotemPG1 />} />
          <Route path='/TotemPG2' element={<TotemPG2 />} />
          <Route path='/TV' element={<TV />} />
          <Route path='/Atendimento' element={<Atendimento />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Rotas;
