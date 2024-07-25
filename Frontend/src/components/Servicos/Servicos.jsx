import React, { useState } from 'react';
import { FcAcceptDatabase, FcHighPriority, FcInspection } from "react-icons/fc";
import ApagarTicket from '../ApagarTicket/ApagarTicket';
import ZerarTickets from '../ZerarTickets/ZerarTickets';

import './Servicos.css';
import GeralRelatorio from '../Relatorios/GeralRelatorio/GeralRelatorio';


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
                //return <div>Relatórios ainda não implementado</div>;
                return <GeralRelatorio/>
            default:
                return null;
        }
    };

    return (
        <div>
            <div className='container-Service'>
                <div className='container-Service-Option'>
                    <div className='Submenu-item'>
                        <FcAcceptDatabase className='Icon-SubMenu' />
                        <span className='item-Service-Option' onClick={() => handleServiceClick('Gerenciar')}>Gerenciar Tickets</span>
                    </div>
             
                    <div className='Submenu-item'>
                        <FcHighPriority className='Icon-SubMenu' />
                        <span className='item-Service-Option' onClick={() => handleServiceClick('Apagar')}>Apagar Tickets</span>
                    </div>

                    <div className='Submenu-item'>
                        <FcInspection className='Icon-SubMenu' />
                        <span className='item-Service-Option' onClick={() => handleServiceClick('Relatorios')}>Gerar Relatórios</span>
                    </div>

                   

                </div>
                <div className='container-Service-Render-Component'>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default Servicos;
