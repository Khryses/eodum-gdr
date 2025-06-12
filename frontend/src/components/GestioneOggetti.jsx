
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GestioneOggetti() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (err) {
      setMessage('Errore nel caricamento oggetti');
    }
  };

  const creaOggetto = async () => {
    try {
      await axios.post('/api/items', { name, description: desc, price });
      fetchItems();
      setMessage('Oggetto creato');
    } catch (err) {
      setMessage('Errore nella creazione oggetto');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Gestione Oggetti</h2>
      <input placeholder="Nome" onChange={e => setName(e.target.value)} />
      <input placeholder="Descrizione" onChange={e => setDesc(e.target.value)} />
      <input type="number" placeholder="Prezzo" onChange={e => setPrice(e.target.value)} />
      <button onClick={creaOggetto}>Crea</button>
      {message && <p>{message}</p>}
      <ul>
        {items.map(i => (
          <li key={i.id}>{i.name} - €{i.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default GestioneOggetti;
