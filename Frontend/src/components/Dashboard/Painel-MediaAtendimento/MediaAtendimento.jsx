import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { format } from 'date-fns';

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
            axios.get(`${NODE_URL}/api/calcularMediaTempo`, {
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
            Number(response.data.media_minutos), // Convertendo para número
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
    chartArea: { width: '50%', height: '70%' },
    colors: ['#89CFF0'], // Adicionando cores personalizadas
  };

  return (
    <div className='container-CalcularMediaTempo'>
      <h2>Tempo de Atendimento Hoje</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {chartData.length > 1 ? (
        <Chart
          chartType='ColumnChart'
          width='30dvw'
          height='50dvh'
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
