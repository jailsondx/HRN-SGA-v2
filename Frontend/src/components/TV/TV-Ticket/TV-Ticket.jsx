import React from 'react';

import './TV-Ticket.css'
import TVList from '../TV-List/TV-List';

const TVTicket = ({ticket, guiche}) => {
    const ticketExibido = ticket;
    const guicheExibido = guiche;

    return (
        <div className='container-Chamada-TV'>
            <div className='container-TicketExibido-TV'>
                <div className='ticketExibido'>{ticketExibido}</div>
                <div className='guicheExibido'>{guicheExibido}</div>
            </div>
            <div className='container-ListExibido-TV'>
                <TVList/>
            </div>

        </div>
    );
}

export default TVTicket;