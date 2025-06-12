import { useEffect } from 'react';
import api from '../api';

export default function useUserData(onRoleChange) {
  useEffect(() => {
    const fetchUserData = async () => {
      const hasRole = localStorage.getItem('role');
      if (!hasRole) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.role) {
            localStorage.setItem('role', res.data.role);
            if (onRoleChange) onRoleChange(res.data.role);
          }
        } catch (err) {
          console.error('Errore recupero dati utente:', err);
        }
      }
    };

    fetchUserData();
  }, [onRoleChange]);
}
