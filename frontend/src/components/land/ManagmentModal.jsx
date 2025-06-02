import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Save, Map, MapPin, Image, FileText, AlertTriangle } from 'lucide-react';
import api from '../../api';

function ManagementModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex,
  onMapUpdate
}) {
  const [activeTab, setActiveTab] = useState('zones');
  const [zones, setZones] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [newZone, setNewZone] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({
    name: '',
    zone: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      // Per ora usiamo i dati hardcoded, poi implementeremo l'API
      const defaultZones = {
        "Centro": {
          description: "Il cuore pulsante di Eodum, dove il potere e la tecnologia si concentrano.",
          places: {
            "Piazza Centrale": {
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop",
              description: "Una vasta piazza lastricata in pietra grigia, circondata da antichi edifici dalle facciate logore dal tempo. Al centro si erge una fontana di marmo nero, le cui acque scorrono silenziose come lacrime di pietra."
            },
            "Fortezza": {
              image: "https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800&h=200&fit=crop",
              description: "Una massiccia struttura di pietra nera che domina il centro della città. Le sue mura spesse nascondono segreti antichi, mentre le torri si perdono nella nebbia perenne di Eodum."
            },
            "Banca": {
              image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=200&fit=crop",
              description: "Un edificio imponente con colonne di marmo e porte dorate. All'interno, il ticchettio degli abachi si mescola ai sussurri di transazioni segrete."
            }
          }
        },
        "Periferia": {
          description: "I confini di Eodum, dove la civilizzazione incontra l'ignoto.",
          places: {
            "Rovine": {
              image: "https://images.unsplash.com/photo-1578498721985-a2e6b5fdbe26?w=800&h=200&fit=crop",
              description: "Resti di antiche costruzioni emergono dalla nebbia come denti rotti. La vegetazione selvatica ha reclamato questi luoghi dimenticati, creando un labirinto di pietra e natura."
            },
            "Ponte": {
              image: "https://images.unsplash.com/photo-1578169252050-1a2f0ac6c2f0?w=800&h=200&fit=crop",
              description: "Un antico ponte di pietra attraversa un abisso avvolto nella nebbia. I suoi archi gotici risuonano dei passi di chi osa attraversarlo, mentre sotto si odono echi misteriosi."
            },
            "Area verde": {
              image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop",
              description: "Una distesa di erba pallida e alberi dalle foglie grigie. Qui la nebbia si dirada occasionalmente, rivelando fiori che brillano di una luce propria."
            }
          }
        },
        "Mercato": {
          description: "Il centro commerciale di Eodum, dove ogni cosa ha un prezzo.",
          places: {
            "Taverna del Corvo Nero": {
              image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=200&fit=crop",
              description: "Un locale buio e accogliente, illuminato solo dal crepitio del fuoco nel camino e da poche candele tremolanti. L'aria è densa di fumo e del profumo di birra scura."
            },
            "Bazar": {
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
              description: "Bancarelle di legno scuro si susseguono in file ordinate, coperte da tende logore. Mercanti incappucciati vendono merci strane: amuleti che brillano di luce propria."
            },
            "Magazzino": {
              image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=200&fit=crop",
              description: "Un edificio di mattoni rossi con ampie porte di ferro. All'interno, casse misteriose si accatastano fino al soffitto, alcune emettono strani bagliori."
            }
          }
        },
        "Quartiere": {
          description: "La zona residenziale di Eodum, dove gli abitanti conducono le loro vite quotidiane.",
          places: {
            "Biblioteca Antica": {
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=200&fit=crop",
              description: "Torreggianti scaffali di quercia scura si perdono nell'ombra, carichi di tomi polverosi e pergamene ingiallite. L'aria profuma di carta antica e inchiostro."
            },
            "Arena dei Sussurri": {
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
              description: "Un'arena circolare scavata nella roccia nera, circondata da gradinate di pietra logore dal tempo. Al centro, un cerchio di sabbia rossastra porta ancora i segni di antichi duelli."
            },
            "Campo": {
              image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&h=200&fit=crop",
              description: "Un ampio spiazzo di terra battuta dove l'erba fatica a crescere. Utilizzato per addestramenti e duelli, il terreno è segnato da innumerevoli scontri del passato."
            }
          }
        }
      };
      
      setZones(defaultZones);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel caricamento delle mappe:', error);
      setLoading(false);
    }
  };

  const handleSaveZone = () => {
    if (!newZone.name.trim()) return;
    
    const updatedZones = {
      ...zones,
      [newZone.name]: {
        description: newZone.description,
        places: {}
      }
    };
    
    setZones(updatedZones);
    setNewZone({ name: '', description: '' });
    
    // Notifica aggiornamento
    if (onMapUpdate) onMapUpdate();
  };

  const handleSaveLocation = () => {
    if (!newLocation.name.trim() || !newLocation.zone) return;
    
    const updatedZones = { ...zones };
    if (!updatedZones[newLocation.zone]) {
      updatedZones[newLocation.zone] = { description: '', places: {} };
    }
    
    updatedZones[newLocation.zone].places[newLocation.name] = {
      image: newLocation.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop',
      description: newLocation.description
    };
    
    setZones(updatedZones);
    setNewLocation({ name: '', zone: '', image: '', description: '' });
    
    // Notifica aggiornamento
    if (onMapUpdate) onMapUpdate();
  };

  const handleDeleteZone = (zoneName) => {
    if (confirm(`Sei sicuro di voler eliminare la zona "${zoneName}"? Questo rimuoverà anche tutte le location al suo interno.`)) {
      const updatedZones = { ...zones };
      delete updatedZones[zoneName];
      setZones(updatedZones);
      
      // Notifica aggiornamento
      if (onMapUpdate) onMapUpdate();
    }
  };

  const handleDeleteLocation = (zoneName, locationName) => {
    if (confirm(`Sei sicuro di voler eliminare la location "${locationName}"?`)) {
      const updatedZones = { ...zones };
      delete updatedZones[zoneName].places[locationName];
      setZones(updatedZones);
      
      // Notifica aggiornamento
      if (onMapUpdate) onMapUpdate();
    }
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
          <h2 className="text-xl font-bold text-red-400">Console di Gestione</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'zones' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          <Map className="w-4 h-4 inline mr-2" />
          Gestione Zone
        </button>
        <button 
          onClick={() => setActiveTab('locations')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'locations' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Gestione Location
        </button>
      </div>

      <div className="scrollable-content p-6 h-[calc(100%-140px)] overflow-y-auto custom-scrollbar">
        {activeTab === 'zones' && (
          <div className="space-y-6">
            {/* Aggiungi nuova zona */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Aggiungi Nuova Zona
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-red-400 text-sm block mb-1">Nome Zona</label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                    placeholder="Nome della zona..."
                  />
                </div>
                <div>
                  <label className="text-red-400 text-sm block mb-1">Descrizione</label>
                  <input
                    type="text"
                    value={newZone.description}
                    onChange={(e) => setNewZone({...newZone, description: e.target.value})}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                    placeholder="Descrizione breve..."
                  />
                </div>
              </div>
              
              <button
                onClick={handleSaveZone}
                disabled={!newZone.name.trim()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Crea Zona
              </button>
            </div>

            {/* Lista zone esistenti */}
            <div className="space-y-4">
              <h3 className="text-red-300 font-semibold">Zone Esistenti</h3>
              {Object.entries(zones).map(([zoneName, zoneData]) => (
                <div key={zoneName} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-red-400 font-semibold">{zoneName}</h4>
                      <p className="text-gray-400 text-sm">{zoneData.description}</p>
                      <p className="text-cyan-500 text-xs mt-1">
                        {Object.keys(zoneData.places).length} location(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingZone(zoneName)}
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                        title="Modifica zona"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteZone(zoneName)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Elimina zona"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Lista location nella zona */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {Object.keys(zoneData.places).map(locationName => (
                      <div key={locationName} className="bg-gray-700/30 rounded p-2 text-xs">
                        <span className="text-cyan-300">{locationName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            {/* Aggiungi nuova location */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-red-600/20">
              <h3 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Aggiungi Nuova Location
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-red-400 text-sm block mb-1">Nome Location</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                    placeholder="Nome della location..."
                  />
                </div>
                <div>
                  <label className="text-red-400 text-sm block mb-1">Zona</label>
                  <select
                    value={newLocation.zone}
                    onChange={(e) => setNewLocation({...newLocation, zone: e.target.value})}
                    className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  >
                    <option value="">Seleziona zona...</option>
                    {Object.keys(zones).map(zoneName => (
                      <option key={zoneName} value={zoneName}>{zoneName}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-red-400 text-sm block mb-1">URL Immagine</label>
                <input
                  type="url"
                  value={newLocation.image}
                  onChange={(e) => setNewLocation({...newLocation, image: e.target.value})}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm"
                  placeholder="https://..."
                />
              </div>
              
              <div className="mb-4">
                <label className="text-red-400 text-sm block mb-1">Descrizione</label>
                <textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                  className="w-full bg-gray-700 text-red-100 px-3 py-2 rounded text-sm h-20 resize-none"
                  placeholder="Descrizione dettagliata della location..."
                />
              </div>
              
              <button
                onClick={handleSaveLocation}
                disabled={!newLocation.name.trim() || !newLocation.zone}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Crea Location
              </button>
            </div>

            {/* Lista locations per zona */}
            <div className="space-y-4">
              <h3 className="text-red-300 font-semibold">Location Esistenti</h3>
              {Object.entries(zones).map(([zoneName, zoneData]) => (
                <div key={zoneName} className="bg-gray-800/20 rounded-lg p-4 border border-gray-600/30">
                  <h4 className="text-red-400 font-semibold mb-3">{zoneName}</h4>
                  
                  <div className="space-y-3">
                    {Object.entries(zoneData.places).map(([locationName, locationData]) => (
                      <div key={locationName} className="bg-gray-700/30 rounded p-3 flex items-start gap-3">
                        {locationData.image && (
                          <img 
                            src={locationData.image} 
                            alt={locationName}
                            className="w-16 h-10 object-cover rounded"
                            onError={(e) => {e.target.style.display = 'none'}}
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="text-cyan-300 font-medium">{locationName}</h5>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {locationData.description}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingLocation({zone: zoneName, name: locationName, ...locationData})}
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            title="Modifica location"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(zoneName, locationName)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Elimina location"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagementModal;