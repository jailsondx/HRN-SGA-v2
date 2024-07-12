import React from 'react';

import './ContadorAtendimentos.css'

function ContadorAtendimentos() {
    return (
        <div className='container-ContadorAtendimentos'>
            <span className='span-Label-Title-MiniContainer'>Atendimentos Hoje</span>
            <div className='cont-quantidade'>Quantidade:</div>
        </div>
    );
}

export default ContadorAtendimentos;