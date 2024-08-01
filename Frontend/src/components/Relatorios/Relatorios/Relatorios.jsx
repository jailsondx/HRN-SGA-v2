import React from 'react';
import GeralRelatorio from '../GeralRelatorio/GeralRelatorio'
import DetalhadoRelatorio from '../DetalhadoRelatorio/DetalhadoRelatorio';

import '../Relatorios.css';

const Relatorios = () => {
    return (
        <div className='container-Relatorios'>
            <GeralRelatorio />
            <DetalhadoRelatorio />
        </div>
    );
}

export default Relatorios;