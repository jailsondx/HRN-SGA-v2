import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Weather.css';

const NODE_URL = import.meta.env.VITE_NODE_SERVER_URL;

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const currentTime = new Date().getTime();
      const oneHour = 3600000;

      if (!lastFetchTime || currentTime - lastFetchTime >= oneHour) {
        try {
          const response = await axios.get(`${NODE_URL}/api/weather`);
          setWeather(response.data);
          setLastFetchTime(currentTime);
          setError('');
        } catch (error) {
          console.error('Erro ao buscar dados meteorológicos:', error);
          setError('Erro ao buscar dados meteorológicos');
        }
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 60000); // Verifica a cada 60 segundos

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [lastFetchTime]);

  return (
    <div className='div-Pai-Weather'>
      <div className='container-Title-Module-Atendimento-g'>
        <span className='span-P-Title-g'>Tempo em Sobral-CE</span>
      </div>
      {error && <div className='div-Error'>{error}</div>}
      {weather ? (
        <div className='div-WeatherInfo'>
          <div className='div-IconWeather'>
            <img className='IconWeather' src="sun.gif" alt="Sol" />
          </div>
          <div className='container-WeatherDetails'>
            <span className='span-WeatherDetail'><b>Temperatura: </b>{weather.main.temp} °C</span>
            <span className='span-WeatherDetail'><b>Sensação Térmica: </b>{weather.main.feels_like} °C</span>
            <span className='span-WeatherDetail'><b>Clima: </b>{weather.weather[0].description}</span>
          </div>
        </div>
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  );
};

export default Weather;
