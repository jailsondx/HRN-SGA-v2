// Routes.js

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TotemPG1 from '../../pages/Totem/TotemPG1'
import TotemPG2 from '../../pages/Totem/TotemPG2'
import TV from '../../pages/TV/TV'
import Atendimento from '../../pages/Atendimento/Atendimento';


function Rotas (){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' />
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
