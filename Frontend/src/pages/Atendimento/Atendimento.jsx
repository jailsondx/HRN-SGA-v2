import React, { useState, useEffect } from 'react';
import TopMenu from '../../components/TopMenu/TopMenu'
import TelaAtendimento from '../../components/TelaAtendimento/TelaAtendimento';
import { Provider } from 'react-redux';

import './Atendimento.css'
import globalTicket from '../../GlobalTicket';

const Atendimento = () => {
  return (
      <div>
        <TopMenu />
          <div className='Tela-Atendimento'>
          <Provider store={globalTicket}>
            <TelaAtendimento />
         </Provider>
          </div>
      </div>
  );
}

export default Atendimento;
