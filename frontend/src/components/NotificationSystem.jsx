import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve essere usato dentro NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove dopo la durata specificata
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Shorthand methods
  const success = useCallback((message, options = {}) => {
    return addNotification({ type: 'success', message, ...options });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({ type: 'error', message, duration: 7000, ...options });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({ type: 'warning', message, duration: 6000, ...options });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({ type: 'info', message, ...options });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationToast = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4 bg-gray-800/95 backdrop-blur-sm";
    switch (notification.type) {
      case 'success':
        return `${baseStyles} border-green-400 shadow-green-400/20`;
      case 'error':
        return `${baseStyles} border-red-400 shadow-red-400/20`;
      case 'warning':
        return `${baseStyles} border-yellow-400 shadow-yellow-400/20`;
      case 'info':
      default:
        return `${baseStyles} border-cyan-400 shadow-cyan-400/20`;
    }
  };

  return (
    <div 
      className={`${getStyles()} rounded-r-lg shadow-lg p-4 max-w-sm transition-all duration-300 animate-in slide-in-from-right`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="text-sm font-semibold text-white mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-sm text-gray-300 leading-relaxed">
            {notification.message}
          </p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Hook per azioni di gioco specifiche
export const useGameNotifications = () => {
  const { success, error, warning, info } = useNotifications();

  const playerJoined = useCallback((playerName) => {
    success(`${playerName} è entrato nella Land`, {
      title: 'Nuovo Giocatore',
      duration: 4000
    });
  }, [success]);

  const playerLeft = useCallback((playerName) => {
    info(`${playerName} ha lasciato la Land`, {
      title: 'Giocatore Uscito',
      duration: 4000
    });
  }, [info]);

  const locationChanged = useCallback((locationName) => {
    info(`Ti sei spostato in: ${locationName}`, {
      title: 'Posizione Aggiornata',
      duration: 3000
    });
  }, [info]);

  const weatherUpdate = useCallback((condition, temperature) => {
    info(`Meteo aggiornato: ${condition}, ${temperature}°C`, {
      title: 'Aggiornamento Meteo',
      duration: 4000
    });
  }, [info]);

  const logoutPenalty = useCallback((minutes) => {
    error(`Accesso limitato per ${minutes} minuti a causa di logout forzato`, {
      title: 'Penalità Logout',
      duration: 8000
    });
  }, [error]);

  const connectionLost = useCallback(() => {
    warning('Connessione persa. Tentativo di riconnessione...', {
      title: 'Connessione Instabile',
      duration: 0 // Non auto-rimuovere
    });
  }, [warning]);

  const connectionRestored = useCallback(() => {
    success('Connessione ripristinata!', {
      title: 'Riconnesso',
      duration: 3000
    });
  }, [success]);

  const newMessage = useCallback((senderName, preview) => {
    info(`${senderName}: ${preview.substring(0, 50)}${preview.length > 50 ? '...' : ''}`, {
      title: 'Nuovo Messaggio',
      duration: 4000,
      action: {
        label: 'Visualizza Chat',
        onClick: () => {
          // Scroll alla chat o focus
          const chatElement = document.querySelector('#chatMessages');
          if (chatElement) {
            chatElement.scrollTop = chatElement.scrollHeight;
          }
        }
      }
    });
  }, [info]);

  return {
    playerJoined,
    playerLeft,
    locationChanged,
    weatherUpdate,
    logoutPenalty,
    connectionLost,
    connectionRestored,
    newMessage
  };
};

export default NotificationProvider;