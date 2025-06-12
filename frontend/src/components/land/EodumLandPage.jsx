import React, { useState, useEffect } from 'react';
import { Map, Users, Cloud, Sun, CloudRain, Snowflake, Moon, CloudSnow } from 'lucide-react';
import useWeather from '../../hooks/useWeather';
import api from '../../api';

const EodumLandPage = ({ onOpenAllPresent, location }) => {
  const weather = useWeather();
  const [currentPresent, setCurrentPresent] = useState([]);
  const [entering, setEntering] = useState([]);
  const [leaving, setLeaving] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresenze = async () => {
      try {
        setLoading(true);
        
        // Prima prova l'endpoint specifico per location
        let response;
        try {
          response = await api.get(`/presenze/presenti/${encodeURIComponent(location)}`);
          console.log('📍 Presenti per location recuperati:', response.data);
        } catch (locationError) {
          // Se fallisce, prova l'endpoint generale
          console.log('⚠️ Endpoint location fallito, provo endpoint generale');
          response = await api.get('/presenze/presenti');
          console.log('📍 Presenti generali recuperati:', response.data);
        }

        const presenti = response.data || [];

        // Processa i dati in base alla struttura ricevuta
        let processedData = [];
        
        if (Array.isArray(presenti)) {
          // Se è un array semplice, filtra per location se necessario
          processedData = presenti.filter(p => !p.location || p.location === location);
        } else if (presenti.players) {
          // Se ha la struttura con players
          processedData = presenti.players.filter(p => !p.location || p.location === location);
        } else {
          console.warn('Struttura dati presenze non riconosciuta:', presenti);
          processedData = [];
        }

        // Separa per status
        setCurrentPresent(processedData.filter(p => p.status === 'active' || !p.status));
        setEntering(processedData.filter(p => p.status === 'entering'));
        setLeaving(processedData.filter(p => p.status === 'leaving'));
        
        console.log('📊 Presenze processate:', {
          active: processedData.filter(p => p.status === 'active' || !p.status).length,
          entering: processedData.filter(p => p.status === 'entering').length,
          leaving: processedData.filter(p => p.status === 'leaving').length,
          total: processedData.length
        });
        
      } catch (err) {
        console.error("❌ Errore nel recuperare le presenze:", err);
        
        // Dati di fallback per demo
        const fallbackData = [
          { name: 'Aeliana Tempesta', status: 'active', location: location },
          { name: 'Kael Ombraferro', status: 'active', location: location },
          { name: 'Darius Ventonero', status: 'entering', location: location },
          { name: 'Mira Nebbiargento', status: 'leaving', location: location }
        ];
        
        setCurrentPresent(fallbackData.filter(p => p.status === 'active'));
        setEntering(fallbackData.filter(p => p.status === 'entering'));
        setLeaving(fallbackData.filter(p => p.status === 'leaving'));
        
        console.log('📋 Usando dati di fallback per:', location);
      } finally {
        setLoading(false);
      }
    };

    fetchPresenze();
    
    // Polling ogni 5 secondi per aggiornamenti
    const interval = setInterval(fetchPresenze, 5000);
    
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-5 h-5 text-gray-400" />;
    const isNight = weather.isNight;
    switch(weather.condition) {
      case 'sunny': return isNight ? <Moon className="w-5 h-5 text-yellow-200" /> : <Sun className="w-5 h-5 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'foggy': return <Cloud className="w-5 h-5 text-gray-300" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'snowy': return <CloudSnow className="w-5 h-5 text-blue-200" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getWeatherConditionText = () => {
    if (!weather) return 'Caricamento...';
    const conditions = {
      'sunny': weather.isNight ? 'Sereno' : 'Soleggiato',
      'cloudy': 'Nuvoloso',
      'foggy': 'Nebbioso',
      'rainy': 'Piovoso',
      'snowy': 'Nevoso'
    };
    return conditions[weather.condition] || 'Variabile';
  };

  const getMoonIcon = () => {
    if (!weather || !weather.moonPhase) return <Moon className="w-4 h-4 text-gray-400" />;
    const moonIcons = {
      'new': '🌑',
      'waxing_crescent': '🌒',
      'first_quarter': '🌓',
      'waxing_gibbous': '🌔',
      'full': '🌕',
      'waning_gibbous': '🌖',
      'last_quarter': '🌗',
      'waning_crescent': '🌘'
    };
    return <span className="text-lg">{moonIcons[weather.moonPhase] || '🌙'}</span>;
  };

  const getMoonPhaseText = () => {
    if (!weather || !weather.moonPhase) return 'Luna';
    const phaseNames = {
      'new': 'Luna Nuova',
      'waxing_crescent': 'Falce Crescente',
      'first_quarter': 'Primo Quarto',
      'waxing_gibbous': 'Gibbosa Crescente',
      'full': 'Luna Piena',
      'waning_gibbous': 'Gibbosa Calante',
      'last_quarter': 'Ultimo Quarto',
      'waning_crescent': 'Falce Calante'
    };
    return phaseNames[weather.moonPhase] || 'Luna';
  };

  const totalPresent = currentPresent.length + entering.length + leaving.length;

  return (
    <div className="w-64 bg-gray-900/70 border-l border-cyan-600/30 p-4 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-cyan-300 font-bold mb-2 tracking-wider">LUOGO ATTUALE</h3>
        <p className="text-cyan-400">{location}</p>
        <p className="text-cyan-500 text-xs mt-1">Mappa di Eodum</p>
      </div>

      <div className="mb-4">
        <div className="w-full h-32 bg-gray-800/50 border border-cyan-600/50 rounded flex items-center justify-center backdrop-blur-sm">
          <Map className="w-8 h-8 text-cyan-500" />
        </div>
        <p className="text-cyan-400/60 text-xs mt-2 text-center italic">
          Una vasta piazza lastricata circondata da edifici antichi. La nebbia danza tra i lampioni.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-cyan-300 font-bold mb-2 text-sm tracking-wider">🌤️ METEO</h4>
        {weather ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-cyan-400">{weather.temperature}°C</span>
              <span className="text-cyan-400/70 text-xs">({getWeatherConditionText()})</span>
            </div>
            <div className="flex items-center gap-2">
              {getMoonIcon()}
              <span className="text-cyan-400 text-sm">{getMoonPhaseText()}</span>
            </div>
            <div className="text-xs text-cyan-500">
              <div>Stagione: {weather.season || 'Inverno'}</div>
              <div>Ultimo aggiorn.: {weather.lastUpdate || 'Oggi 06:00'}</div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cyan-500">Caricamento meteo...</p>
        )}
      </div>

      <div className="mb-4">
        <div className="bg-gray-800/50 border border-cyan-600/50 rounded p-2 h-6 overflow-hidden backdrop-blur-sm">
          <div className="text-yellow-400 text-xs animate-pulse">
            🔔 Manutenzione server prevista alle 02:00
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-cyan-300 font-bold mb-2 text-sm tracking-wider">👥 GIOCATORI PRESENTI</h4>

        {loading ? (
          <div className="text-center text-cyan-500 text-xs py-4">
            Caricamento presenze...
          </div>
        ) : (
          <>
            <div className="mb-3">
              <div className="text-xs text-cyan-400 mb-1 font-semibold">
                Presenti Attuali ({currentPresent.length})
              </div>
              <div className="space-y-1">
                {currentPresent.slice(0, 3).map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400">{user.name}</span>
                  </div>
                ))}
                {currentPresent.length > 3 && (
                  <div className="text-xs text-cyan-500 ml-4">
                    +{currentPresent.length - 3} altri...
                  </div>
                )}
                {currentPresent.length === 0 && (
                  <div className="text-xs text-cyan-600 italic">
                    Nessuno presente
                  </div>
                )}
              </div>
            </div>

            {entering.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-blue-400 mb-1 font-semibold">
                  In Ingresso ({entering.length})
                </div>
                <div className="space-y-1">
                  {entering.map((user, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <span className="text-blue-400">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leaving.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-red-400 mb-1 font-semibold">
                  In Uscita ({leaving.length})
                </div>
                <div className="space-y-1">
                  {leaving.map((user, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <button 
          onClick={onOpenAllPresent}
          className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-cyan-600/30 hover:border-cyan-500/50 rounded text-sm text-cyan-300 transition-all"
        >
          <Users className="w-4 h-4" />
          Tutti i Presenti ({totalPresent})
        </button>
      </div>
    </div>
  );
};

export default EodumLandPage;
