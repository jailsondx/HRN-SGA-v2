import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { format } from 'date-fns';

import './MediaAtendimento.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const CalcularMediaTempo = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const totemLocations = ['Recepcao Principal', 'Recepcao Emergencia'];

      try {
        const responses = await Promise.all(
          totemLocations.map(location =>
            axios.get(`${NODE_URL}/api/Grafico-TempoAtendimento`, {
              params: {
                data: today,
                local: location,
              },
            })
          )
        );

        const data = [
          ['Local do Totem', 'Média de Tempo (min)'],
          ...responses.map((response, index) => [
            totemLocations[index],
            Number(response.data.media_segundos) / 60, // Convertendo para minutos
          ]),
        ];

        setChartData(data);
        setError('');
      } catch (error) {
        console.error('Erro ao buscar os dados do gráfico:', error);
        setError('Erro ao buscar os dados do gráfico.');
      }
    };

    fetchChartData();
  }, []);

  const options = {
    title: 'Média de Tempo por Recepção',
    hAxis: { title: 'Recepção', titleTextStyle: { color: '#333' } },
    vAxis: { title: 'Média de Tempo (min)', minValue: 0 },
    chartArea: { width: '50%', height: '50%' },
    colors: ['#89CFF0'], // Adicionando cores personalizadas
  };

  return (
    <div className='container-CalcularMediaTempo'>
      <div className='container-Title-Module-g'>
        <span className='span-P-Title-g'>Tempo de Atendimento Hoje</span>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {chartData.length > 1 ? (
        <Chart
          chartType='ColumnChart'
          width='100%'
          height='400px'
          data={chartData}
          options={options}
        />
      ) : (
        <p>Carregando dados do gráfico...</p>
      )}
    </div>
  );
};

export default CalcularMediaTempo;
