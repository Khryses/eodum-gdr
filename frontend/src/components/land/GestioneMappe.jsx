// src/components/land/GestioneMappe.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Trash2 } from 'lucide-react';

export default function GestioneMappe({ onMapUpdate }) {
  const [maps, setMaps] = useState({});
  const [newZone, setNewZone] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [newLocation, setNewLocation] = useState({ name: '', description: '', image: '' });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api.get('/api/maps')
      .then(res => setMaps(res.data))
      .catch(err => console.error('Errore nel caricamento mappe', err));
  }, [refresh]);

  const handleCreateZone = async () => {
    if (!newZone.trim()) return;
    try {
      await api.post('/api/maps/zones', { name: newZone });
      setNewZone('');
      setRefresh(prev => !prev);
      onMapUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Errore nella creazione');
    }
  };

  const handleDeleteZone = async (zone) => {
    if (!window.confirm('Eliminare zona e tutte le sue location?')) return;
    await api.delete(`/api/maps/zones/${zone}`);
    setRefresh(prev => !prev);
    onMapUpdate?.();
  };

  const handleCreateLocation = async () => {
    try {
      await api.post('/api/maps/locations', {
        name: newLocation.name,
        zone: selectedZone,
        image: newLocation.image,
        description: newLocation.description
      });
      setNewLocation({ name: '', description: '', image: '' });
      setRefresh(prev => !prev);
      onMapUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Errore nella creazione');
    }
  };

  const handleDeleteLocation = async (zone, location) => {
    if (!window.confirm('Eliminare questa location?')) return;
    await api.delete('/api/maps/locations', { data: { zone, name: location } });
    setRefresh(prev => !prev);
    onMapUpdate?.();
  };

  return (
    <div className="p-4 text-sm text-white">
      <h2 className="text-lg font-bold mb-4">Gestione Mappe</h2>
      <div className="mb-4">
        <input value={newZone} onChange={e => setNewZone(e.target.value)} placeholder="Nuova zona" className="p-1 bg-gray-800 border border-cyan-700" />
        <button onClick={handleCreateZone} className="ml-2 px-2 py-1 bg-cyan-700 hover:bg-cyan-600 rounded">Aggiungi Zona</button>
      </div>
      <div className="flex gap-6">
        <div className="w-1/3">
          {Object.keys(maps).map(zone => (
            <div key={zone} className="mb-2">
              <button onClick={() => setSelectedZone(zone)} className="text-left font-semibold text-cyan-300 hover:underline">
                {zone}
              </button>
              <button onClick={() => handleDeleteZone(zone)} className="ml-2 text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="w-2/3">
          {selectedZone && (
            <>
              <h3 className="text-md font-bold">{selectedZone}</h3>
              <div className="space-y-2 mt-2">
                {maps[selectedZone]?.places && Object.entries(maps[selectedZone].places).map(([name, info]) => (
                  <div key={name} className="p-2 border border-cyan-800 rounded bg-gray-800">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-xs italic text-cyan-400">{info.description}</div>
                      </div>
                      <button onClick={() => handleDeleteLocation(selectedZone, name)} className="text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Nuova Location</h4>
                <input value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Nome" className="block w-full p-1 mt-1 bg-gray-800 border border-cyan-700" />
                <input value={newLocation.image} onChange={e => setNewLocation({ ...newLocation, image: e.target.value })} placeholder="URL Immagine" className="block w-full p-1 mt-1 bg-gray-800 border border-cyan-700" />
                <textarea value={newLocation.description} onChange={e => setNewLocation({ ...newLocation, description: e.target.value })} placeholder="Descrizione" className="block w-full p-1 mt-1 bg-gray-800 border border-cyan-700" rows="2" />
                <button onClick={handleCreateLocation} className="mt-2 px-2 py-1 bg-cyan-700 hover:bg-cyan-600 rounded">Aggiungi Location</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
