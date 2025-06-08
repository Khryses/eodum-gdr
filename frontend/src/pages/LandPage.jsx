
import React, { useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../contexts/UserContext';

const LandPage = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const setOnline = async () => {
      if (user && user.token) {
        try {
          await api.post('/presenze/online');
          console.log('✅ Stato online aggiornato');
        } catch (error) {
          console.error('❌ Errore impostando online:', error);
        }
      }
    };

    setOnline();
  }, [user]);

  return (
    <div>
      {/* Contenuto della LandPage */}
      <h1>Benvenuto nella Città di Eodum</h1>
    </div>
  );
};

export default LandPage;
