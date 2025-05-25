import React from 'react';
import { Map, Users, Cloud, Sun, CloudRain, Snowflake, Moon } from 'lucide-react';
import useWeather from '../../hooks/useWeather';
import usePresenze from '../../hooks/usePresenze';

const EodumLandPage = () => {
  const weather = useWeather();
  const presentUsers = usePresenze();
  const utenti = Array.isArray(presentUsers) ? presentUsers : [];

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-5 h-5 text-gray-400" />;
    switch(weather.condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'snowy': return <Snowflake className="w-5 h-5 text-blue-200" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="w-64 bg-gray-900/70 border-l border-cyan-600/30 p-4 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-cyan-300 font-bold mb-2 tracking-wider">LUOGO ATTUALE</h3>
        <p className="text-cyan-400">Mappa di Eodum</p>
      </div>

      <div className="mb-4">
        <div className="w-full h-32 bg-gray-800/50 border border-cyan-600/50 rounded flex items-center justify-center backdrop-blur-sm">
          <Map className="w-8 h-8 text-cyan-500" />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-cyan-300 font-bold mb-2 text-sm tracking-wider">METEO</h4>
        {weather ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-cyan-400">{weather.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-gray-400" />
              <span className="text-cyan-400 text-sm">Luna {weather.moon}</span>
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
        <h4 className="text-cyan-300 font-bold mb-2 text-sm tracking-wider">PRESENTI ({utenti.length})</h4>
        <div className="space-y-1 mb-3">
          {utenti.slice(0, 3).map((user, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400">{user.name}</span>
              {user.status === 'entering' && <span className="text-blue-400 text-xs">(entrando)</span>}
              {user.status === 'leaving' && <span className="text-red-400 text-xs">(uscendo)</span>}
            </div>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-cyan-600/30 hover:border-cyan-500/50 rounded text-sm text-cyan-300 transition-all">
          <Users className="w-4 h-4" />
          Tutti i presenti
        </button>
      </div>
    </div>
  );
};

export default EodumLandPage;
