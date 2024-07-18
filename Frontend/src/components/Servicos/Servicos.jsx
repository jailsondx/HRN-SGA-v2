import React, { useState } from 'react';
import ApagarTicket from '../ApagarTicket/ApagarTicket';
import ZerarTickets from '../ZerarTickets/ZerarTickets';

import './Servicos.css';


const Servicos = () => {
    const [componentType, setComponentType] = useState('');

    const handleServiceClick = (typeComponent) => {
        setComponentType(typeComponent);
    };

    const renderComponent = () => {
        switch (componentType) {
            case 'Gerenciar':
                return <ZerarTickets />;
            case 'Apagar':
                return <ApagarTicket />;
            case 'Relatorios':
                // Adicione seu componente de relatórios aqui quando estiver disponível
                return <div>Relatórios ainda não implementado</div>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className='container-Service'>
                <div className='container-Service-Option'>
                    <span className='item-Service-Option' onClick={() => handleServiceClick('Gerenciar')} style={{cursor: 'pointer'}}>Gerenciar Tickets</span>
                    <span className='item-Service-Option' onClick={() => handleServiceClick('Apagar')} style={{cursor: 'pointer'}}>Apagar Tickets</span>
                    <span className='item-Service-Option' onClick={() => handleServiceClick('Relatorios')} style={{cursor: 'pointer'}}>Gerar Relatórios</span>
                </div>
                <div className='container-Service-Render-Component'>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default Servicos;
