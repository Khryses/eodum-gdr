import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useUserData(token) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Errore nel recupero del personaggio:', err);
      }
    };

    fetchUserData();
  }, [token]);

  return userData;
}
