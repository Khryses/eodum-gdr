
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SidebarSinistra() {
  const [isGestore, setIsGestore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        if (res.data.email === 'admin@eodum.it') {
          setIsGestore(true);
        }
      } catch (err) {
        console.error('Errore ruolo');
      }
    }
    checkRole();
  }, []);

  return (
    <div className="sidebar-sinistra">
      <button onClick={() => navigate('/land')}>Land</button>
      <button onClick={() => navigate('/market')}>Mercato</button>
      <button onClick={() => navigate('/scheda')}>Scheda</button>
      {isGestore && <button onClick={() => navigate('/admin')}>Console Admin</button>}
    </div>
  );
}

export default SidebarSinistra;
