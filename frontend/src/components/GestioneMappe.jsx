
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GestioneMappe() {
  const [maps, setMaps] = useState([]);
  const [message, setMessage] = useState('');

  const fetchMaps = async () => {
    try {
      const res = await axios.get('/api/maps');
      setMaps(res.data);
    } catch (err) {
      setMessage('Errore nel caricamento delle mappe');
    }
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  return (
    <div>
      <h2>Gestione Mappe</h2>
      {message && <p>{message}</p>}
      <ul>
        {maps.map(m => (
          <li key={m.id}>
            <strong>{m.name}</strong> - {m.district}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestioneMappe;
