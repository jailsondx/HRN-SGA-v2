import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContadorAtendimentos.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const ContadorAtendimentos = ({ refLocation }) => {
    const [totalAtendimentos, setTotalAtendimentos] = useState(null);
    const [error, setError] = useState('');

  useEffect(() => {
    const recebeAtendimentos = async () => {
      try {
        const response = await axios.get(`${NODE_URL}/api/ContadorAtendimentos`, {
          params: {
            local: refLocation,
          },
        });
        setTotalAtendimentos(response.data.total);
      } catch (error) {
        console.error('Erro ao buscar atendimentos:', error);
        setError('Erro ao buscar atendimentos');
      }
    };

    recebeAtendimentos();
    const intervalId = setInterval(recebeAtendimentos, 60000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);

  }, [refLocation]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='div-Pai-ContadorAtendimentos'>
      <div className='container-Title-Module-Atendimento-g'>
        <span className='span-P-Title-g'>Total de Atendimentos Hoje</span>
      </div>
      <div>
        <div className='div-ContadorAtendimentos'>
            <span className='span-infor-MiniContainer'>{totalAtendimentos !== null ? totalAtendimentos : 'Carregando...'}</span>
        </div>
      </div>
    </div>
  );
};

export default ContadorAtendimentos;
