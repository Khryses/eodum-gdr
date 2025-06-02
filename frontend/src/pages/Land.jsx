import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarSinistra from '../components/land/SidebarSinistra';
import ColonnaCentrale from '../components/land/ColonnaCentrale';
import EodumLandPage from '../components/land/EodumLandPage';
import DocumentationModal from '../components/DocumentationModal';
import CharacterSheetModal from '../components/land/CharacterSheetModal';
import AllPresentModal from '../components/land/AllPresentModal';
import LogoutWarningModal from '../components/land/LogoutWarningModal';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useGameNotifications } from '../components/NotificationSystem';
import { getLogoutPenaltyTime, setLogoutPenalty, formatTime } from '../utils/gameUtils';
import api from '../api';

export default function Land() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const { logoutPenalty, connectionLost, connectionRestored } = useGameNotifications();
  
  // Stati per i modali
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showAllPresent, setShowAllPresent] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  
  // Posizioni modali
  const [documentationPosition, setDocumentationPosition] = useState({ x: 150, y: 150 });
  const [sheetPosition, setSheetPosition] = useState({ x: 250, y: 200 });
  const [allPresentPosition, setAllPresentPosition] = useState({ x: 300, y: 100 });
  const [logoutWarningPosition, setLogoutWarningPosition] = useState({ x: 200, y: 150 });
  
  // Stati per il dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const zIndex = 50;

  // Controlla se c'è una penalità di logout forzato all'avvio
  useEffect(() => {
    const penaltyTime = getLogoutPenaltyTime();
    if (penaltyTime) {
      setCountdown(penaltyTime);
      setShowLogoutWarning(true);
      logoutPenalty(Math.ceil(penaltyTime / 60));
    }
  }, [logoutPenalty]);

  // Countdown timer per logout forzato
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowLogoutWarning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Logout normale (permette di riloggare subito)
  const handleNormalLogout = async () => {
    if (confirm('Sei sicuro di voler uscire dalla Land?')) {
      try {
        await api.post('/auth/logout', { type: 'normal' });
        logout();
      } catch (error) {
        console.error('Errore durante il logout:', error);
        connectionLost();
        setTimeout(() => {
          logout(); // Logout locale anche se il server non risponde
        }, 2000);
      }
    }
  };

  // Logout forzato (penalità di 3 minuti)
  const handleForceLogout = async () => {
    try {
      await api.post('/auth/logout', { type: 'forced' });
      setLogoutPenalty(3);
      logout();
    } catch (error) {
      console.error('Errore durante il logout forzato:', error);
      // Applica la penalità anche se il server non risponde
      setLogoutPenalty(3);
      logout();
    }
  };

  // Gestione chiusura finestra/tab (logout forzato)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      handleForceLogout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-gray-950 text-cyan-300 font-mono overflow-hidden relative">
      {/* Topbar */}
      <div className="h-12 bg-gray-900/90 border-b border-cyan-600/50 flex items-center justify-between px-4 backdrop-blur-sm">
        <div className="text-cyan-300 font-bold text-lg tracking-wider">
          <span className="text-blue-400">E</span>ODUM <span className="text-cyan-600 text-sm ml-2">v2.1</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-gray-800/50 border border-cyan-600/50 rounded text-sm text-cyan-400">
            Visibile
          </button>
          <button className="px-3 py-1 bg-gray-800/50 border border-blue-600/50 rounded text-sm text-blue-400">
            Bacheche ON/OFF
          </button>
          <button className="px-3 py-1 bg-gray-800/50 border border-purple-600/50 rounded text-sm text-purple-300">
            Admin
          </button>
          
          {/* X per logout forzato */}
          <button 
            onClick={handleForceLogout}
            className="w-8 h-8 bg-red-900/50 border border-red-600/50 rounded text-red-400 hover:bg-red-800/50 transition-colors flex items-center justify-center"
            title="Chiudi forzatamente (3 min di penalità)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Layout 3 colonne */}
      <div className="flex h-[calc(100%-3rem)]">
        <SidebarSinistra 
          onOpenDocs={() => setShowDocumentation(true)} 
          onOpenSheet={() => setShowSheet(true)} 
          onNormalLogout={handleNormalLogout}
        />
        <ColonnaCentrale />
        <EodumLandPage onOpenAllPresent={() => setShowAllPresent(true)} />
      </div>

      {/* Modali */}
      {showDocumentation && (
        <DocumentationModal
          onClose={() => setShowDocumentation(false)}
          position={documentationPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex}
          onFocus={() => {}}
        />
      )}
      
      {showSheet && (
        <CharacterSheetModal
          onClose={() => setShowSheet(false)}
          position={sheetPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex + 1}
          onFocus={() => {}}
        />
      )}

      {showAllPresent && (
        <AllPresentModal
          onClose={() => setShowAllPresent(false)}
          position={allPresentPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex + 2}
          onFocus={() => {}}
        />
      )}

      {showLogoutWarning && (
        <LogoutWarningModal
          onClose={() => setShowLogoutWarning(false)}
          position={logoutWarningPosition}
          countdown={countdown}
          formatTime={formatTime}
          zIndex={zIndex + 3}
        />
      )}
    </div>
  );
}