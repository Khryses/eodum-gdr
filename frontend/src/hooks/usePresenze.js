import { useEffect, useState } from 'react';
import axios from 'axios';

export default function usePresenze() {
  const [presenze, setPresenze] = useState([]);

  useEffect(() => {
    const fetchPresenze = () => {
      axios.get('/api/system/presenze')
        .then(res => setPresenze(res.data))
        .catch(err => console.error('Errore presenze:', err));
    };

    fetchPresenze();
    const interval = setInterval(fetchPresenze, 10000); // ogni 10s
    return () => clearInterval(interval);
  }, []);

  return presenze;
}
