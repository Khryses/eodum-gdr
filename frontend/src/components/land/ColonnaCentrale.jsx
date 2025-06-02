import React, { useState, useEffect } from 'react';
import { Map, MapPin, ArrowLeft, Send } from 'lucide-react';
import api from '../../api';

// Configurazione delle location con immagini e descrizioni
const locationData = {
  "Centro": {
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

export default function ColonnaCentrale() {
  const [zona, setZona] = useState(null);
  const [luogo, setLuogo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('Piazza Centrale');
  const [visitedLocations, setVisitedLocations] = useState(['Piazza Centrale']);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  // Effetto per sincronizzare la location attuale con il backend
  useEffect(() => {
    // Se siamo in un luogo specifico, notifica il backend
    if (luogo) {
      syncLocationWithBackend(luogo);
    }
  }, [luogo]);

  const syncLocationWithBackend = async (locationName) => {
    try {
      await api.post('/player/move', { 
        location: locationName,
        timestamp: new Date().toISOString()
      });
      
      setCurrentLocation(locationName);
      
      // Aggiungi alla lista dei luoghi visitati
      if (!visitedLocations.includes(locationName)) {
        setVisitedLocations(prev => [...prev, locationName]);
      }
      
      // Aggiungi messaggio di movimento alla chat
      addSystemMessage(`Ti sei spostato in: ${locationName}`);
      
    } catch (error) {
      console.error('Errore sincronizzazione location:', error);
      // Continua comunque con l'aggiornamento locale
      setCurrentLocation(locationName);
      if (!visitedLocations.includes(locationName)) {
        setVisitedLocations(prev => [...prev, locationName]);
      }
    }
  };

  const addSystemMessage = (message) => {
    setChat(prev => [...prev, { 
      user: "Sistema", 
      text: message, 
      type: "system",
      timestamp: new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'})
    }]);
  };

  const invia = async () => {
    if (!input.trim()) return;
    
    const message = {
      user: "Tu",
      text: input.trim(),
      type: "user",
      timestamp: new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'})
    };
    
    setChat(prev => [...prev, message]);
    
    try {
      // Invia il messaggio al backend
      await api.post('/chat/send', {
        message: input.trim(),
        location: currentLocation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Errore invio messaggio:', error);
    }
    
    setInput("");
  };

  const getCurrentLocationData = () => {
    for (const [zoneName, zoneData] of Object.entries(locationData)) {
      if (zoneData.places[currentLocation]) {
        return {
          zone: zoneName,
          ...zoneData.places[currentLocation]
        };
      }
    }
    return null;
  };

  const getAvailableLocations = () => {
    const available = [];
    for (const [zoneName, zoneData] of Object.entries(locationData)) {
      for (const placeName of Object.keys(zoneData.places)) {
        if (visitedLocations.includes(placeName)) {
          available.push({
            zone: zoneName,
            name: placeName,
            isCurrent: placeName === currentLocation
          });
        }
      }
    }
    return available;
  };

  // Render della mappa generale
  if (!zona && !luogo) {
    const availableLocations = getAvailableLocations();
    
    return (
      <div className="flex-1 bg-gray-950/60 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-300">Mappa di Eodum</h2>
        </div>
        
        <div className="bg-gray-800/40 border border-cyan-600/20 rounded p-6 flex-1 relative">
          {/* Zone della mappa - solo quelle con luoghi visitati */}
          {Object.entries(locationData).map(([zoneName, zoneData], index) => {
            const hasVisitedPlaces = Object.keys(zoneData.places).some(place => 
              visitedLocations.includes(place)
            );
            
            if (!hasVisitedPlaces) return null;
            
            return (
              <button
                key={index}
                onClick={() => setZona(zoneName)}
                className={`absolute bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-full shadow transition-all transform hover:scale-105 ${
                  Object.keys(zoneData.places).includes(currentLocation) ? 'ring-2 ring-yellow-400' : ''
                }`}
                style={{
                  top: [40, 190, 190, 330][index] || 40,
                  left: [200, 150, 350, 100][index] || 200,
                  transform: 'translate(-50%, 0)'
                }}
              >
                {zoneName}
                {Object.keys(zoneData.places).includes(currentLocation) && (
                  <span className="ml-2 text-yellow-300">📍</span>
                )}
              </button>
            );
          })}
          
          {/* Indicatore località visitate */}
          <div className="absolute bottom-4 right-4 bg-gray-900/80 p-3 rounded border border-cyan-600/30">
            <div className="text-xs text-cyan-400 mb-2">Luoghi accessibili: {visitedLocations.length}</div>
            <div className="text-xs text-cyan-500">📍 = Posizione attuale</div>
          </div>
        </div>
      </div>
    );
  }

  // Render della selezione luoghi in una zona
  if (zona && !luogo) {
    const zoneData = locationData[zona];
    const availablePlaces = Object.keys(zoneData.places).filter(place => 
      visitedLocations.includes(place)
    );

    return (
      <div className="flex-1 bg-gray-950/60 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-cyan-300">{zona}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {availablePlaces.map((place, i) => (
            <button
              key={i}
              onClick={() => setLuogo(place)}
              className={`bg-gray-800/50 border border-cyan-600/30 hover:border-cyan-400 text-cyan-200 p-4 rounded transition-all ${
                place === currentLocation ? 'ring-2 ring-yellow-400 bg-yellow-900/20' : ''
              }`}
            >
              <div className="font-semibold">{place}</div>
              {place === currentLocation && (
                <div className="text-yellow-300 text-xs mt-1">📍 Posizione attuale</div>
              )}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setZona(null)} 
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla mappa
        </button>
      </div>
    );
  }

  // Render della chat in un luogo specifico
  if (luogo) {
    const locationInfo = getCurrentLocationData();
    
    return (
      <div className="flex-1 bg-gray-950/60 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-cyan-300">
              {zona} / {luogo}
            </h2>
            {luogo === currentLocation && (
              <span className="text-yellow-300 text-sm">📍</span>
            )}
          </div>
          <button 
            onClick={() => setLuogo(null)} 
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna ai luoghi
          </button>
        </div>

        {/* Immagine e descrizione della location */}
        {locationInfo && (
          <div className="bg-gray-800/30 rounded-lg p-4 mb-4 border border-cyan-600/20">
            <img 
              src={locationInfo.image} 
              alt={luogo}
              className="w-full h-32 object-cover rounded mb-3"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <p className="text-cyan-200 text-sm italic leading-relaxed">
              {locationInfo.description}
            </p>
          </div>
        )}
        
        {/* Area chat */}
        <div className="flex-1 bg-gray-900/40 border border-cyan-600/20 rounded p-4 overflow-y-auto mb-3 custom-scrollbar">
          {chat.map((msg, idx) => (
            <div key={idx} className={`mb-2 p-2 rounded ${
              msg.type === 'system' 
                ? 'bg-blue-900/20 border-l-2 border-blue-400' 
                : 'bg-gray-800/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold text-sm ${
                  msg.type === 'system' ? 'text-blue-400' : 'text-cyan-300'
                }`}>
                  {msg.user}
                </span>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <p className={`text-sm ${
                msg.type === 'system' ? 'text-blue-200 italic' : 'text-cyan-100'
              }`}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        
        {/* Input chat */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && invia()}
            placeholder="Scrivi un'azione o dialogo..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-cyan-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={invia}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Invia
          </button>
        </div>
      </div>
    );
  }
}