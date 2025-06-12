
import React, { useState } from 'react';
import GestioneMappe from './GestioneMappe';
import GestioneOggetti from './GestioneOggetti';
import GestioneLog from './GestioneLog';

function AdminPanel() {
  const [sezione, setSezione] = useState('utenti');

  return (
    <div className="admin-panel">
      <h2>Pannello Gestore</h2>
      <div className="tabs">
        <button onClick={() => setSezione('utenti')}>Utenti</button>
        <button onClick={() => setSezione('mappe')}>Mappe</button>
        <button onClick={() => setSezione('oggetti')}>Oggetti</button>
        <button onClick={() => setSezione('log')}>Log</button>
      </div>
      <div className="contenuto-admin">
        {sezione === 'utenti' && <Utenti />}
        {sezione === 'mappe' && <GestioneMappe />}
        {sezione === 'oggetti' && <GestioneOggetti />}
        {sezione === 'log' && <GestioneLog />}
      </div>
    </div>
  );
}

function Utenti() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      setUsers(res.data);
    } catch (err) {
      setMessage('Errore nel caricamento utenti');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await axios.post('/api/admin/change-role', {
        userId: id,
        newRole: role
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      setMessage('Ruolo aggiornato');
      fetchUsers();
    } catch (err) {
      setMessage('Errore aggiornamento ruolo');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Gestione Utenti</h3>
      {loading ? <p>Caricamento...</p> : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ruolo</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select onChange={e => changeRole(u.id, e.target.value)} defaultValue={u.role}>
                    <option value="giocatore">Giocatore</option>
                    <option value="moderatore">Moderatore</option>
                    <option value="masterquest">MasterQuest</option>
                    <option value="guide">Guida</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminPanel;
