import React, { useState, useEffect } from 'react';
import TopMenu from '../../components/TopMenu/TopMenu'
import TelaAtendimento from '../../components/TelaAtendimento/TelaAtendimento';
import { Provider } from 'react-redux';

import './Atendimento.css'
import Store from '../../Store';

const Atendimento = () => {
  return (
      <div className='container-Tela-Atendimento'>
        <TopMenu />
          <div className='component-Tela-Atendimento'>
          <Provider store={Store}>
            <TelaAtendimento />
         </Provider>
          </div>
      </div>
  );
}

export default Atendimento;
