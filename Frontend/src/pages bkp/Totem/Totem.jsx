import { io } from 'socket.io-client'
import TicketButton from '../../components/TicketButton/TicketButton';

function Totem() {

  const caixa = 'Totem Principal';

  const socket = io('ws://localhost:3001');
  // client-side
  socket.on("connect", () => {
    var logData = {
      'Arquivo de Origem':'Totem.jsx',
      'ID de WS':caixa,
      'Status da conexao WS': socket.connected,
    }

    socket.emit('Totem_Atendimento', caixa);
    console.table(logData);
  });
  


  //const [socket, setSocket] = useState(null);

  return (
    <div className='Totem'>
        <h1>Totem</h1>
        <TicketButton socket={socket} id="A" texto="Acompanhante" />
        <TicketButton socket={socket} id="V" texto="Visitante" />
        <TicketButton socket={socket} id="I" texto="Internação" />
        <TicketButton socket={socket} id="O" texto="Outros" />
        <TicketButton socket={socket} id="AP" texto="Atendimento Prioritario" />
    </div>
  )
}

export default  Totem;

