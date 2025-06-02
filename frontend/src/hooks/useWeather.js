import { useEffect, useState } from 'react';
import api from '../api';

export default function useWeather() {
  const [weather, setWeather] = useState(null);

  // Funzione per calcolare i dati meteo localmente (fallback)
  const calculateLocalWeather = () => {
    const now = new Date();
    const hours = now.getHours();
    const month = now.getMonth();
    const day = now.getDate();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    
    // Determina la stagione basata sul mese
    let season, minTemp, maxTemp;
    if (month >= 11 || month <= 1) {
      season = 'Inverno';
      minTemp = -20; 
      maxTemp = 5;
    } else if (month >= 2 && month <= 4) {
      season = 'Primavera';
      minTemp = -5; 
      maxTemp = 15;
    } else if (month >= 5 && month <= 7) {
      season = 'Estate';
      minTemp = 10; 
      maxTemp = 30;
    } else {
      season = 'Autunno';
      minTemp = 0; 
      maxTemp = 20;
    }
    
    // Calcola temperatura basata su ora del giorno + variazione stagionale
    const baseTemp = minTemp + (maxTemp - minTemp) * Math.sin((hours - 6) * Math.PI / 12);
    const dailyVariation = Math.sin(day * 0.1) * 5; // Variazione giornaliera
    const temperature = Math.round(Math.max(minTemp, Math.min(maxTemp, baseTemp + dailyVariation)));
    
    // Clima montano: spesso nuvoloso/nebbioso, soprattutto di notte
    const isNight = hours < 6 || hours > 20;
    const weatherConditions = isNight 
      ? ['foggy', 'foggy', 'cloudy', 'cloudy', 'cloudy'] // Di notte più nebbia
      : ['cloudy', 'cloudy', 'foggy', 'sunny', 'rainy']; // Di giorno variabile
    
    // Aggiungi neve in inverno
    if (season === 'Inverno' && temperature < 0) {
      weatherConditions.push('snowy', 'snowy');
    }
    
    const conditionIndex = Math.floor(Math.sin(day * 0.3 + hours * 0.1) * weatherConditions.length / 2) + Math.floor(weatherConditions.length / 2);
    const condition = weatherConditions[Math.max(0, Math.min(weatherConditions.length - 1, conditionIndex))];
    
    // Calcola fase lunare (ciclo di 28 giorni)
    const moonPhases = [
      'new', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full', 'waning_gibbous', 'last_quarter', 'waning_crescent'
    ];
    const moonIndex = Math.floor((dayOfYear % 28) / 3.5);
    const moonPhase = moonPhases[Math.max(0, Math.min(7, moonIndex))];
    
    // Ultimo aggiornamento (ogni 6 ore: 00:00, 06:00, 12:00, 18:00)
    const lastUpdateHour = Math.floor(hours / 6) * 6;
    const updateTime = lastUpdateHour === 0 ? '00:00' : 
                      lastUpdateHour === 6 ? '06:00' : 
                      lastUpdateHour === 12 ? '12:00' : '18:00';
    
    return {
      temperature,
      condition,
      season,
      moonPhase,
      isNight,
      lastUpdate: `Oggi ${updateTime}`,
      location: 'Eodum - Regione Montana',
      humidity: Math.round(60 + Math.sin(day * 0.2) * 20), // 40-80%
      windSpeed: Math.round(5 + Math.sin(hours * 0.1) * 10) // 0-15 km/h
    };
  };

  const fetchWeather = async () => {
    try {
      const response = await api.get('/system/weather');
      setWeather(response.data);
    } catch (error) {
      console.error('Errore nel recupero del meteo, uso dati locali:', error);
      // Fallback a calcolo locale
      setWeather(calculateLocalWeather());
    }
  };

  useEffect(() => {
    // Carica dati iniziali
    fetchWeather();
    
    // Aggiorna ogni 30 secondi (in produzione potrebbe essere ogni 5-10 minuti)
    const interval = setInterval(fetchWeather, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return weather;
}