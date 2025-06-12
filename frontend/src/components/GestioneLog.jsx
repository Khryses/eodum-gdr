
import React, { useState } from 'react';
import axios from 'axios';

function GestioneLog() {
  const [message, setMessage] = useState('');
  const [formato, setFormato] = useState('json');
  const [selectedFiles, setSelectedFiles] = useState({});

  const esportaLog = async (tipo) => {
    try {
      const res = await axios.get(`/api/logs/export/${tipo}?format=${formato}`, {
        responseType: 'blob',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tipo}-log.${formato}`);
      document.body.appendChild(link);
      link.click();
      setMessage('Log esportato con successo');
    } catch (err) {
      setMessage('Errore esportazione log');
    }
  };

  const svuotaLog = async (tipo) => {
    try {
      await axios.delete(`/api/logs/clear/${tipo}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      setMessage('Log svuotato con successo');
    } catch (err) {
      setMessage('Errore svuotamento log');
    }
  };

  const uploadLog = async (tipo) => {
    const file = selectedFiles[tipo];
    if (!file || !file.name.endsWith('.json')) {
      setMessage('Seleziona un file JSON valido');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', tipo);

    try {
      await axios.post('/api/admin/import-log', formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Backup ripristinato con successo');
    } catch (err) {
      setMessage('Errore ripristino backup');
    }
  };

  const handleFileChange = (e, tipo) => {
    setSelectedFiles(prev => ({ ...prev, [tipo]: e.target.files[0] }));
  };

  return (
    <div>
      <h2>Gestione Log</h2>
      <label>Formato esportazione:</label>
      <select onChange={e => setFormato(e.target.value)} value={formato}>
        <option value="json">JSON (backup/ripristino)</option>
        <option value="csv">CSV (analisi)</option>
      </select>
      {['chat', 'mp', 'bacheca', 'acquisti', 'staff'].map(tipo => (
        <div key={tipo}>
          <h4>{tipo.toUpperCase()}</h4>
          <button onClick={() => esportaLog(tipo)}>Esporta</button>
          <input type="file" accept=".json" onChange={e => handleFileChange(e, tipo)} />
          <button onClick={() => uploadLog(tipo)}>Ripristina</button>
          <button onClick={() => svuotaLog(tipo)}>Svuota</button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}

export default GestioneLog;
