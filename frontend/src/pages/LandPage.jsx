
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const LandPage = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const setOnline = async () => {
      if (user && user.token) {
        try {
          await axios.post(
            'http://localhost:4000/api/presenze/online',
            {},
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
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
