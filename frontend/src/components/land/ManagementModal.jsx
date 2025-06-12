import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Save, Map, MapPin, FileText, AlertTriangle, Users, Ban, Activity, MessageCircle, User, Shield, Database } from 'lucide-react';
import api from '../../api';
import { loadDocumentation, saveDocumentation } from '../../data/documentation';

function ManagementModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex,
  onMapUpdate,
  initialTab = 'map'
}) {
  const [activeMenu, setActiveMenu] = useState(initialTab === 'documentation' ? 'documentation' : 'management');
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dati
  const [zones, setZones] = useState({});
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [documentationData, setDocumentationData] = useState(loadDocumentation());

  // Form states
  const [newZone, setNewZone] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ name: '', zone: '', image: '', description: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'info', expiresIn: '' });
  const [banForm, setBanForm] = useState({ userId: '', reason: '', duration: '' });
  const [editingCharacter, setEditingCharacter] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'zones':
        case 'locations':
          await loadMapData();
          break;
        case 'users':
          await loadUsers();
          break;
        case 'bans':
          await loadBannedUsers();
          break;
        case 'characters':
          await loadCharacters();
          break;
        case 'logs':
          await loadSystemLogs();
          break;
        case 'announcements':
          await loadAnnouncements();
          break;
        case 'stats':
          await loadStats();
          break;
      }
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
    } finally {
      setLoading(false);
    }
  };

  // API Calls
  const loadMapData = async () => {
    try {
      const response = await api.get('/maps');
      setZones(response.data);
    } catch (error) {
      console.error('Errore caricamento mappe:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Errore caricamento utenti:', error);
    }
  };

  const loadBannedUsers = async () => {
    try {
      const response = await api.get('/admin/banned');
      setBannedUsers(response.data.bannedUsers || []);
    } catch (error) {
      console.error('Errore caricamento ban:', error);
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await api.get('/admin/characters');
      setCharacters(response.data.characters || []);
    } catch (error) {
      console.error('Errore caricamento personaggi:', error);
    }
  };

  const loadSystemLogs = async () => {
    try {
      const response = await api.get('/admin/logs?limit=100');
      setSystemLogs(response.data.logs || []);
    } catch (error) {
      console.error('Errore caricamento log:', error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Errore caricamento annunci:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
    }
  };

  // Handlers per Mappe
  const handleCreateZone = async () => {
    if (!newZone.name.trim()) return;
    try {
      await api.post('/maps/zones', newZone);
      setNewZone({ name: '', description: '' });
      await loadMapData();
      if (onMapUpdate) onMapUpdate();
    } catch (error) {
      alert('Errore nella creazione della zona: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateLocation = async () => {
    if (!newLocation.name.trim() || !newLocation.zone) return;
    try {
      await api.post('/maps/locations', newLocation);
      setNewLocation({ name: '', zone: '', image: '', description: '' });
      await loadMapData();
      if (onMapUpdate) onMapUpdate();
    } catch (error) {
      alert('Errore nella creazione della location: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteZone = async (zoneName) => {
    if (!confirm(`Eliminare la zona "${zoneName}" e tutte le sue location?`)) return;
    try {
      await api.delete(`/maps/zones/${encodeURIComponent(zoneName)}`);
      await loadMapData();
      if (onMapUpdate) onMapUpdate();
    } catch (error) {
      alert('Errore nell\'eliminazione: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteLocation = async (zoneName, locationName) => {
    if (!confirm(`Eliminare la location "${locationName}"?`)) return;
    try {
      await api.delete('/maps/locations', { data: { zone: zoneName, name: locationName } });
      await loadMapData();
      if (onMapUpdate) onMapUpdate();
    } catch (error) {
      alert('Errore nell\'eliminazione: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handlers per Utenti
  const handleKickUser = async (userId, userName) => {
    const reason = prompt(`Motivo del kick per ${userName}:`);
    if (reason === null) return;

    try {
      await api.post(`/admin/users/${userId}/kick`, { reason });
      await loadUsers();
      alert(`${userName} è stato kickato`);
    } catch (error) {
      alert('Errore nel kick: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBanUser = async () => {
    if (!banForm.userId || !banForm.reason) return;

    try {
      await api.post(`/admin/users/${banForm.userId}/ban`, {
        reason: banForm.reason,
        duration: banForm.duration ? parseInt(banForm.duration) : null
      });
      setBanForm({ userId: '', reason: '', duration: '' });
      await loadUsers();
      await loadBannedUsers();
      alert('Utente bannato con successo');
    } catch (error) {
      alert('Errore nel ban: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUnbanUser = async (userId, userName) => {
    if (!confirm(`Rimuovere il ban per ${userName}?`)) return;

    try {
      await api.delete(`/admin/banned/${userId}`);
      await loadBannedUsers();
      alert(`Ban rimosso per ${userName}`);
    } catch (error) {
      alert('Errore nella rimozione del ban: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handlers per Personaggi
  const handleUpdateCharacter = async (characterId, updates) => {
    try {
      await api.put(`/admin/characters/${characterId}`, updates);
      await loadCharacters();
      setEditingCharacter(null);
      alert('Personaggio aggiornato con successo');
    } catch (error) {
      alert('Errore nell\'aggiornamento: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handlers per Annunci
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) return;

    try {
      const payload = {
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        type: newAnnouncement.type
      };

      if (newAnnouncement.expiresIn) {
        payload.expiresIn = parseInt(newAnnouncement.expiresIn);
      }

      await api.post('/admin/announcements', payload);
      setNewAnnouncement({ title: '', message: '', type: 'info', expiresIn: '' });
      await loadAnnouncements();
      alert('Annuncio creato con successo');
    } catch (error) {
      alert('Errore nella creazione dell\'annuncio: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Eliminare questo annuncio?')) return;

    try {
      await api.delete(`/admin/announcements/${announcementId}`);
      await loadAnnouncements();
      alert('Annuncio eliminato');
    } catch (error) {
      alert('Errore nell\'eliminazione: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handler per Documentazione
  const handleSaveDocumentation = () => {
    saveDocumentation(documentationData);
    alert('Documentazione salvata con successo');
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content, input, textarea, button, select')) {
      return;
    }

    setIsDragging('management');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('management');
    e.preventDefault();
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('it-IT');
  const getStatusColor = (isOnline) => (isOnline ? 'text-green-400' : 'text-gray-400');
  const getLogTypeColor = (action) => {
    const colors = {
      user_kick: 'text-yellow-400',
      user_ban: 'text-red-400',
      user_unban: 'text-green-400',
      character_edit: 'text-blue-400',
      announcement_create: 'text-cyan-400',
      announcement_delete: 'text-orange-400'
    };
    return colors[action] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div
        className="fixed w-[900px] h-[600px] bg-gray-900 border border-red-600 rounded-xl shadow-2xl flex items-center justify-center"
        style={{
          top: position.y,
          left: position.x,
          zIndex: zIndex || 60,
        }}
      >
        <div className="text-red-400">Caricamento console di gestione...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed w-[900px] h-[600px] bg-gray-900 border border-red-600 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 60,
        cursor: isDragging === 'management' ? 'grabbing' : 'grab',
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex justify-between items-center p-6 pb-4 cursor-grab border-b border-red-600/20"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-bold text-red-400">Console di Gestione Admin</h2>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-300 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Menu principale */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveMenu('documentation')}
          className={`px-4 py-2 text-sm font-medium ${activeMenu === 'documentation' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Documentazione
        </button>
        <button
          onClick={() => setActiveMenu('management')}
          className={`px-4 py-2 text-sm font-medium ${activeMenu === 'management' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Gestione Sistema
        </button>
      </div>

      {/* Sottomenu */}
      {activeMenu === 'management' && (
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {[
            { key: 'zones', label: 'Zone', icon: Map },
            { key: 'locations', label: 'Location', icon: MapPin },
            { key: 'users', label: 'Utenti', icon: Users },
            { key: 'bans', label: 'Ban', icon: Ban },
            { key: 'characters', label: 'Personaggi', icon: User },
            { key: 'announcements', label: 'Annunci', icon: MessageCircle },
            { key: 'logs', label: 'Log', icon: Activity },
            { key: 'stats', label: 'Statistiche', icon: Database }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${activeTab === key ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <Icon className="w-3 h-3 inline mr-1" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Contenuto */}
      <div className="scrollable-content p-6 h-[calc(100%-140px)] overflow-y-auto custom-scrollbar">
        {activeMenu === 'documentation' && (
          <div className="space-y-4">
            <div>
              <label className="text-red-300 text-sm block mb-1">Caratteristiche</label>
              <textarea
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-24 resize-none"
                value={documentationData.caratteristiche}
                onChange={(e) => setDocumentationData({ ...documentationData, caratteristiche: e.target.value })}
              />
            </div>
            <div>
              <label className="text-red-300 text-sm block mb-1">Abilità</label>
              <textarea
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-24 resize-none"
                value={documentationData.abilita}
                onChange={(e) => setDocumentationData({ ...documentationData, abilita: e.target.value })}
              />
            </div>
            <div>
              <label className="text-red-300 text-sm block mb-1">Creazione Personaggio</label>
              <textarea
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-24 resize-none"
                value={documentationData.creazione}
                onChange={(e) => setDocumentationData({ ...documentationData, creazione: e.target.value })}
              />
            </div>
            <div>
              <label className="text-red-300 text-sm block mb-1">Regole</label>
              <textarea
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-24 resize-none"
                value={documentationData.regole}
                onChange={(e) => setDocumentationData({ ...documentationData, regole: e.target.value })}
              />
            </div>
            <button
              onClick={handleSaveDocumentation}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
            >
              <Save className="w-4 h-4 inline mr-2" />Salva Documentazione
            </button>
          </div>
        )}

        {/* Zone */}
        {activeMenu === 'management' && activeTab === 'zones' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-3">Aggiungi Nuova Zona</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  className="bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="Nome zona..."
                />
                <input
                  type="text"
                  value={newZone.description}
                  onChange={(e) => setNewZone({ ...newZone, description: e.target.value })}
                  className="bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="Descrizione..."
                />
              </div>
              <button
                onClick={handleCreateZone}
                disabled={!newZone.name.trim()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white rounded text-sm"
              >
                <Save className="w-4 h-4 inline mr-2" />Crea Zona
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(zones).map(([zoneName, zoneData]) => (
                <div key={zoneName} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-red-400 font-semibold">{zoneName}</h4>
                      <p className="text-gray-400 text-sm">{zoneData.description}</p>
                      <p className="text-cyan-500 text-xs mt-1">{Object.keys(zoneData.places || {}).length} location(s)</p>
                    </div>
                    <button
                      onClick={() => handleDeleteZone(zoneName)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {activeMenu === 'management' && activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-3">Aggiungi Nuova Location</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  className="bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="Nome location..."
                />
                <select
                  value={newLocation.zone}
                  onChange={(e) => setNewLocation({ ...newLocation, zone: e.target.value })}
                  className="bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                >
                  <option value="">Seleziona zona...</option>
                  {Object.keys(zones).map(zoneName => (
                    <option key={zoneName} value={zoneName}>{zoneName}</option>
                  ))}
                </select>
              </div>
              <input
                type="url"
                value={newLocation.image}
                onChange={(e) => setNewLocation({ ...newLocation, image: e.target.value })}
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm mb-4"
                placeholder="URL immagine..."
              />
              <textarea
                value={newLocation.description}
                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-20 resize-none mb-4"
                placeholder="Descrizione..."
              />
              <button
                onClick={handleCreateLocation}
                disabled={!newLocation.name.trim() || !newLocation.zone}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white rounded text-sm"
              >
                <Save className="w-4 h-4 inline mr-2" />Crea Location
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(zones).map(([zoneName, zoneData]) => (
                <div key={zoneName} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-red-400 font-semibold mb-3">{zoneName}</h4>
                  <div className="space-y-2">
                    {Object.entries(zoneData.places || {}).map(([locationName, locationData]) => (
                      <div key={locationName} className="bg-gray-700/30 rounded p-3 flex justify-between items-center">
                        <div>
                          <span className="text-cyan-300 font-medium">{locationName}</span>
                          <p className="text-gray-400 text-xs mt-1">{locationData.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteLocation(zoneName, locationName)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utenti */}
        {activeMenu === 'management' && activeTab === 'users' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {users.map(user => (
                <div key={user.id} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-cyan-300 font-medium">{user.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({user.email})</span>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className={getStatusColor(user.isOnline)}>
                          {user.isOnline ? '🟢 Online' : '⚫ Offline'}
                        </span>
                        {user.currentLocation && <span className="ml-2">📍 {user.currentLocation}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleKickUser(user.id, user.name)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm">Kick</button>
                      <button onClick={() => setBanForm({ ...banForm, userId: user.id })} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm">Ban</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {banForm.userId && (
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-600/30 mt-4">
                <h3 className="text-red-300 font-semibold mb-3">Ban Utente</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={banForm.reason}
                    onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                    placeholder="Motivo del ban..."
                  />
                  <input
                    type="number"
                    value={banForm.duration}
                    onChange={(e) => setBanForm({ ...banForm, duration: e.target.value })}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                    placeholder="Durata in ore (lascia vuoto per permanente)"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleBanUser} disabled={!banForm.reason} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white rounded text-sm">Conferma Ban</button>
                    <button onClick={() => setBanForm({ userId: '', reason: '', duration: '' })} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm">Annulla</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ban */}
        {activeMenu === 'management' && activeTab === 'bans' && (
          <div className="space-y-4">
            {bannedUsers.length === 0 ? (
              <div className="text-center text-gray-400 py-8">Nessun utente bannato</div>
            ) : (
              bannedUsers.map(ban => (
                <div key={ban.userId} className="bg-red-900/20 rounded-lg p-4 border border-red-600/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-red-300 font-medium">{ban.userName}</span>
                      <span className="text-gray-400 text-sm ml-2">({ban.userEmail})</span>
                      <div className="text-xs text-gray-400 mt-1">
                        <div>Motivo: {ban.reason}</div>
                        <div>Bannato da: {ban.bannedByName}</div>
                        <div>Data: {formatDate(ban.bannedAt)}</div>
                        {ban.banUntil && <div>Scade: {formatDate(ban.banUntil)}</div>}
                        {ban.permanent && <div className="text-red-400">PERMANENTE</div>}
                      </div>
                    </div>
                    <button onClick={() => handleUnbanUser(ban.userId, ban.userName)} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm">Rimuovi Ban</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Personaggi */}
        {activeMenu === 'management' && activeTab === 'characters' && (
          <div className="space-y-4">
            {characters.map(character => (
              <div key={character.id} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-cyan-300 font-medium">{character.name}</span>
                    <span className="text-gray-400 text-sm ml-2">({character.email})</span>
                    <div className="text-xs text-gray-400 mt-1">
                      <div>Sesso: {character.gender}</div>
                      <div>Razza: {character.race}</div>
                      {character.currentLocation && <div>📍 {character.currentLocation}</div>}
                    </div>
                  </div>
                  <button onClick={() => setEditingCharacter(character)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm">Modifica</button>
                </div>
              </div>
            ))}

            {editingCharacter && (
              <div className="bg-gray-800/40 rounded-lg p-4 border border-yellow-600/30">
                <h3 className="text-yellow-300 font-semibold mb-3">Modifica Personaggio</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingCharacter.name}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                    className="w-full bg-gray-700 text-yellow-100 px-3 py-2 rounded text-sm"
                    placeholder="Nome Cognome"
                  />
                  <input
                    type="text"
                    value={editingCharacter.gender}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, gender: e.target.value })}
                    className="w-full bg-gray-700 text-yellow-100 px-3 py-2 rounded text-sm"
                    placeholder="Genere"
                  />
                  <input
                    type="text"
                    value={editingCharacter.race}
                    onChange={(e) => setEditingCharacter({ ...editingCharacter, race: e.target.value })}
                    className="w-full bg-gray-700 text-yellow-100 px-3 py-2 rounded text-sm"
                    placeholder="Razza"
                  />
                  <textarea
                    value={JSON.stringify(editingCharacter.attributes || {}, null, 2)}
                    onChange={(e) => {
                      try { setEditingCharacter({ ...editingCharacter, attributes: JSON.parse(e.target.value) }); } catch {}
                    }}
                    className="w-full bg-gray-700 text-yellow-100 px-3 py-2 rounded text-sm h-24 font-mono"
                    placeholder="{...caratteristiche}"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const [nome, ...cognome] = editingCharacter.name.split(' ');
                        handleUpdateCharacter(editingCharacter.id, {
                          nome,
                          cognome: cognome.join(' '),
                          sesso: editingCharacter.gender,
                          razza: editingCharacter.race,
                          caratteristiche: editingCharacter.attributes
                        });
                      }}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-sm"
                    >
                      Salva
                    </button>
                    <button onClick={() => setEditingCharacter(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm">Annulla</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Annunci */}
        {activeMenu === 'management' && activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-3">Crea Annuncio</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="Titolo"
                />
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-20 resize-none"
                  placeholder="Messaggio"
                />
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="emergency">Emergency</option>
                </select>
                <input
                  type="number"
                  value={newAnnouncement.expiresIn}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresIn: e.target.value })}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="Scadenza ore (opzionale)"
                />
                <button onClick={handleCreateAnnouncement} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm">
                  <Save className="w-4 h-4 inline mr-2" />Crea Annuncio
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-red-900/20 rounded-lg p-4 border border-red-600/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-red-300 font-semibold">{ann.title}</div>
                      <div className="text-gray-400 text-sm whitespace-pre-line">{ann.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(ann.createdAt)} - {ann.type}</div>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log */}
        {activeMenu === 'management' && activeTab === 'logs' && (
          <div className="space-y-2">
            {systemLogs.map(log => (
              <div key={log.id} className="bg-gray-800/20 rounded-lg p-3 border border-gray-600/30 text-xs">
                <span className={getLogTypeColor(log.action)}>[{log.action}]</span> {formatDate(log.timestamp)} - {log.data?.adminName || 'Sistema'} ➜ {log.data?.targetUserName || log.data?.announcementId || ''} {log.data?.reason ? `(${log.data.reason})` : ''}
              </div>
            ))}
          </div>
        )}

        {/* Statistiche */}
        {activeMenu === 'management' && activeTab === 'stats' && (
          <div className="space-y-4 text-sm">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-2">Utenti</h3>
              <div>Totali: {stats.users?.total || 0}</div>
              <div>Online: {stats.users?.online || 0}</div>
              <div>Admin: {stats.users?.admins || 0}</div>
              <div>Bannati: {stats.users?.banned || 0}</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-2">Sistema</h3>
              <div>Uptime: {stats.system ? Math.floor(stats.system.uptime) : 0}s</div>
              <div>Annunci attivi: {stats.system?.announcements || 0}</div>
              <div>Versione: {stats.system?.version || 'N/A'}</div>
              <div>Ultimo aggiornamento: {stats.timestamp ? formatDate(stats.timestamp) : ''}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagementModal;
