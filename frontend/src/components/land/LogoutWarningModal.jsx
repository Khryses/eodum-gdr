import React from 'react';
import { X, AlertTriangle, Clock } from 'lucide-react';

function LogoutWarningModal({
  onClose,
  position,
  countdown,
  formatTime,
  zIndex
}) {
  return (
    <div
      className="fixed w-[450px] bg-gray-900 border border-red-600 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 60,
      }}
    >
      <div className="flex justify-between items-center p-6 pb-4 border-b border-red-600/20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-bold text-red-400">Logout Forzato</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-red-300 font-semibold">Accesso Temporaneamente Limitato</p>
              <p className="text-red-400/80 text-sm">Hai chiuso la sessione in modo non corretto</p>
            </div>
          </div>
          
          <p className="text-red-200 text-sm mb-4">
            Per mantenere l'integrità del gioco, dovrai attendere prima di poter rientrare nella Land.
          </p>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-red-600/20">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-lg font-mono text-red-300">
                Tempo rimanente: <span className="font-bold text-red-400">{formatTime(countdown)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-3 border border-cyan-600/20 mb-4">
          <p className="text-cyan-300 text-sm font-semibold mb-1">💡 Per evitare questa penalità in futuro:</p>
          <p className="text-cyan-400/80 text-xs">
            Usa sempre il tasto "Logout" in basso a destra nella sidebar per uscire correttamente dalla Land.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
          >
            Ho capito
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutWarningModal;