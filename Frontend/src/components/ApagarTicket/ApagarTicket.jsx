import React, { useState } from 'react';
import ListaTicketsGerencia from '../ListaTickets/ListaTicketsGerencia';

import './ApagarTicket.css';

const ApagarTicket = () => {
    const [recepcaoLocation, setRecepcaoLocation] = useState('');
    const [key, setKey] = useState(Date.now());

    const handleLista = (event) => {
        event.preventDefault();
        const selectedValue = event.target.elements.select.value;
        setRecepcaoLocation(selectedValue);
        setKey(Date.now()); // Atualiza a chave para forçar a recriação do componente
    };

    return (
        <div className='div-pai-ApagarTicket'>
            <form className='form-Apagar-Ticket' onSubmit={handleLista}>
                <div className='div-Title-Form-g'>
                    <span className='span-Title-g'>Escolha a Recepção</span>
                </div>
                <div>
                    <select 
                        className='select-g' 
                        name="select" 
                        value={recepcaoLocation} 
                        onChange={(e) => setRecepcaoLocation(e.target.value)}
                        required
                    >
                        <option value='' disabled>Selecione uma recepção</option>
                        <option value='Recepcao Principal'>Recepção Principal</option>
                        <option value='Recepcao Emergencia'>Recepção Emergência</option>
                        <option value='Recepcao Ambulatorio'>Recepção Ambulatório</option>
                    </select>
                    <button type="submit">Gerar Lista</button>
                </div>
            </form>
            <div>
                {recepcaoLocation && <ListaTicketsGerencia key={key} recepcaoLocation={recepcaoLocation} />}
            </div>
        </div>
    );
};

export default ApagarTicket;
