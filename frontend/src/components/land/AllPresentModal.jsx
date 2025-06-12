import React, { useState, useEffect } from 'react';
import { X, Users, MapPin } from 'lucide-react';
import api from '../../api';

function AllPresentModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex
}) {
  const [playersData, setPlayersData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPresent();
    
    // Polling ogni 5 secondi per aggiornamenti in tempo reale
    const interval = setInterval(fetchAllPresent, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllPresent = async () => {
    try {
      const response = await api.get('/system/all-present');
      setPlayersData(response.data.playersByLocation || {});
      setLoading(false);
    } catch (error) {
      console.error('Errore nel recupero dei presenti:', error);
      // Dati di fallback per demo
      setPlayersData({
        'Piazza Centrale': [
          { name: 'Aeliana Tempesta', status: 'active' },
          { name: 'Kael Ombraferro', status: 'active' },
          { name: 'Darius Ventonero', status: 'entering' }
        ],
        'Taverna del Corvo Nero': [
          { name: 'Marcus Ferroscuro', status: 'active' },
          { name: 'Elena Ventogelido', status: 'active' }
        ],
        'Biblioteca Antica': [
          { name: 'Sage Pergamena', status: 'active' }
        ],
        'Arena dei Sussurri': [
          { name: 'Gareth Laminera', status: 'active' },
          { name: 'Vera Ombralama', status: 'leaving' },
          { name: 'Zara Temprapura', status: 'active' }
        ]
      });
      setLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content')) {
      return;
    }
    
    setIsDragging('allPresent');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('allPresent');
    e.preventDefault();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entering': return 'text-blue-400';
      case 'leaving': return 'text-red-400';
      case 'active':
      default: return 'text-cyan-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'entering': return '(entrando)';
      case 'leaving': return '(uscendo)';
      case 'active':
      default: return '';
    }
  };

  const getTotalPlayers = () => {
    return Object.values(playersData).reduce((total, players) => total + players.length, 0);
  };

  return (
    <div
      className="fixed w-[700px] h-[500px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 40,
        cursor: isDragging === 'allPresent' ? 'grabbing' : 'grab',
      }}
      onMouseDown={onFocus}
    >
      <div 
        className="flex justify-between items-center p-6 pb-4 cursor-grab border-b border-cyan-600/20"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">
            Tutti i Presenti nella Land ({getTotalPlayers()})
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="text-cyan-400 hover:text-red-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="scrollable-content px-6 pb-6 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-cyan-400">Caricamento...</div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {Object.entries(playersData).map(([location, players]) => (
              <div key={location} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {location} ({players.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {players.map((player, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-900/40 rounded border border-cyan-600/10"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        player.status === 'active' ? 'bg-cyan-400 animate-pulse' :
                        player.status === 'entering' ? 'bg-blue-400 animate-bounce' :
                        'bg-red-400'
                      }`}></div>
                      <span className={`text-sm ${getStatusColor(player.status)}`}>
                        {player.name}
                      </span>
                      {player.status !== 'active' && (
                        <span className={`text-xs ${getStatusColor(player.status)}`}>
                          {getStatusText(player.status)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(playersData).length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                <p className="text-cyan-400">Nessun giocatore presente nella Land</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllPresentModal;