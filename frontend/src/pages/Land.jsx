import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarSinistra from '../components/land/SidebarSinistra';
import ColonnaCentrale from '../components/land/ColonnaCentrale';
import EodumLandPage from '../components/land/EodumLandPage';
import DocumentationModal from '../components/DocumentationModal';
import CharacterSheetModal from '../components/land/CharacterSheetModal';
import AllPresentModal from '../components/land/AllPresentModal';
import LogoutWarningModal from '../components/land/LogoutWarningModal';
import ManagementModal from '../components/land/ManagementModal';
import { useUser } from '../context/UserContext';
import { useGameNotifications } from '../components/NotificationSystem';
import { getLogoutPenaltyTime, setLogoutPenalty, formatTime } from '../utils/gameUtils';
import api from '../api';
import useUserData from '../hooks/useUserData';

export default function Land() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const { logoutPenalty, connectionLost, connectionRestored } = useGameNotifications();

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');

  // Recupera dati utente se mancano in localStorage
  useUserData((role) => setIsAdmin(role === 'admin'));

  useEffect(() => {
    const checkRole = () => setIsAdmin(localStorage.getItem('role') === 'admin');
    window.addEventListener('storage', checkRole);
    checkRole();
    return () => window.removeEventListener('storage', checkRole);
  }, []);
  
  // Stati per i modali
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showAllPresent, setShowAllPresent] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [managementTab, setManagementTab] = useState('map'); // Per specificare quale tab aprire
  
  // Stato per il refresh
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Posizioni modali
  const [documentationPosition, setDocumentationPosition] = useState({ x: 150, y: 150 });
  const [sheetPosition, setSheetPosition] = useState({ x: 250, y: 200 });
  const [allPresentPosition, setAllPresentPosition] = useState({ x: 300, y: 100 });
  const [logoutWarningPosition, setLogoutWarningPosition] = useState({ x: 200, y: 150 });
  const [managementPosition, setManagementPosition] = useState({ x: 100, y: 50 });
  
  // Stati per il dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const zIndex = 50;

  // Imposta l'utente come online quando entra nella Land
  useEffect(() => {
    const setUserOnlineInLand = async () => {
      try {
        await api.post('/presenze/online');
        console.log('✅ Utente impostato come online nella Land');
      } catch (error) {
        console.error('❌ Errore nell\'impostare l\'utente online:', error);
      }
    };

    setUserOnlineInLand();
  }, []);

  // Auto-refresh ogni minuto
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      handleRefresh();
    }, 60000); // 60 secondi

    return () => clearInterval(autoRefresh);
  }, []);

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

  // Funzione di refresh manuale
  const handleRefresh = async () => {
    try {
      // Aggiorna lo stato online
      await api.post('/presenze/online');
      setLastRefresh(Date.now());
      console.log('🔄 Land aggiornata:', new Date().toLocaleTimeString());
      
      // Notifica all'utente
      connectionRestored();
    } catch (error) {
      console.error('❌ Errore durante il refresh:', error);
      connectionLost();
    }
  };

  // Logout normale (permette di riloggare subito)
  const handleNormalLogout = async () => {
    if (confirm('Sei sicuro di voler uscire dalla Land?')) {
      try {
        // Imposta come offline
        await api.post('/presenze/offline');
        // Effettua logout
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
      await api.post('/presenze/offline');
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

  // Handler per aprire il management modal con tab specifici
  const handleOpenManagement = (tab = 'map') => {
    setManagementTab(tab);
    setShowManagement(true);
  };

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
          {isAdmin && (
            <button
              onClick={() => handleOpenManagement('map')}
              className="px-3 py-1 bg-red-900/50 border border-red-600/50 rounded text-sm text-red-300 hover:bg-red-800/50 transition-colors"
            >
              🔧 Console Admin
            </button>
          )}
          
          {/* Indicatore ultimo refresh */}
          <div className="text-xs text-cyan-500">
            Ultimo aggiornamento: {new Date(lastRefresh).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Layout 3 colonne */}
      <div className="flex h-[calc(100%-3rem)]">
        <SidebarSinistra
          onOpenDocs={() => setShowDocumentation(true)}
          onOpenSheet={() => setShowSheet(true)}
          onOpenManagement={handleOpenManagement}
          onRefresh={handleRefresh}
          onNormalLogout={handleNormalLogout}
          isAdmin={isAdmin}
        />
        <ColonnaCentrale key={lastRefresh} />
        <EodumLandPage 
          onOpenAllPresent={() => setShowAllPresent(true)} 
          refreshTrigger={lastRefresh}
        />
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

      {showManagement && (
        <ManagementModal
          onClose={() => setShowManagement(false)}
          position={managementPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex + 3}
          onFocus={() => {}}
          onMapUpdate={handleRefresh}
          initialTab={managementTab}
        />
      )}

      {showLogoutWarning && (
        <LogoutWarningModal
          onClose={() => setShowLogoutWarning(false)}
          position={logoutWarningPosition}
          countdown={countdown}
          formatTime={formatTime}
          zIndex={zIndex + 4}
        />
      )}
    </div>
  );
}