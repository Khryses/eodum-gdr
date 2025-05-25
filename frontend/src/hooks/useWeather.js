import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useWeather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get('/api/system/weather')
      .then(res => setWeather(res.data))
      .catch(err => console.error('Errore meteo:', err));
  }, []);

  return weather;
}
