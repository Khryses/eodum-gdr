import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Mail, Lock, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginModal = ({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex,
  onOpenForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openInPopup, setOpenInPopup] = useState(true);
  const [errors, setErrors] = useState({});
  const [forceLogoutPenalty, setForceLogoutPenalty] = useState(null);

  // Carica email salvata se presente
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      const savedPassword = localStorage.getItem('rememberedPassword');
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();

  // Controlla penalità logout forzato
  useEffect(() => {
    const forceLogoutTime = localStorage.getItem('forceLogoutTime');
    if (forceLogoutTime && Date.now() < parseInt(forceLogoutTime)) {
      const remainingTime = parseInt(forceLogoutTime) - Date.now();
      setForceLogoutPenalty(true);
      setCountdown(Math.ceil(remainingTime / 1000));
    } else {
      localStorage.removeItem('forceLogoutTime');
      setForceLogoutPenalty(false);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            localStorage.removeItem('forceLogoutTime');
            setForceLogoutPenalty(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async () => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    // Verifica se c'è ancora una penalità attiva
    if (forceLogoutPenalty && countdown > 0) {
      setErrors({ 
        general: `Devi attendere ancora ${formatTime(countdown)} prima di poter accedere.` 
      });
      return;
    }

    if (!email || !password) {
      setErrors({ general: 'Inserisci email e password' });
      return;
    }

    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        rememberMe 
      });
      
      // Salva il token e il ruolo
      localStorage.setItem('token', response.data.token);
      if (response.data.user?.role) {
        localStorage.setItem('role', response.data.user.role);
      }
      
      // Se c'era una penalità, rimuovila dopo login successo
      localStorage.removeItem('forceLogoutTime');
      
      if (openInPopup) {
        // Apri in popup
        const popup = window.open('/#/land', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        if (popup) {
          popup.focus();
          onClose();
        } else {
          setErrors({ general: 'Impossibile aprire popup. Riprova o disabilita il blocco popup.' });
        }
      } else {
        // Naviga normalmente
        navigate('/land');
        onClose();
      }
    } catch (err) {
      console.error('Errore login:', err);
      if (err.response?.status === 401) {
        setErrors({ general: 'Email o password non corretti' });
      } else if (err.response?.status === 429) {
        setErrors({ general: 'Troppi tentativi di login. Riprova più tardi.' });
      } else {
        setErrors({ general: 'Errore di connessione. Riprova più tardi.' });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('input, button, select, textarea')) {
      return;
    }
    
    setIsDragging('login');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('login');
    e.preventDefault();
  };

  return (
    <div
      className="fixed w-[400px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 50,
        cursor: isDragging === 'login' ? 'grabbing' : 'grab',
      }}
      onMouseDown={onFocus}
    >
      <div 
        className="flex justify-between items-center mb-4 p-6 pb-0 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-xl font-bold text-cyan-400">Login</h2>
        <button 
          onClick={onClose}
          className="text-cyan-400 hover:text-red-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-6 pb-6 space-y-4">
        {/* Avviso penalità logout forzato */}
        {forceLogoutPenalty && countdown > 0 && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Accesso Temporaneamente Limitato</span>
            </div>
            <p className="text-red-300 text-xs mb-2">
              Hai chiuso la sessione precedente in modo non corretto.
            </p>
            <div className="flex items-center gap-2 bg-gray-800/50 rounded px-2 py-1">
              <Clock className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-sm font-mono">
                Tempo rimanente: {formatTime(countdown)}
              </span>
            </div>
          </div>
        )}

        {/* Errore generale */}
        {errors.general && (
          <div className="bg-red-900/20 border border-red-600/50 rounded p-2">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div>
          <label className="text-sm text-cyan-300 block mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
            <input
              type="email"
              className={`w-full bg-gray-800 rounded px-3 py-2 pl-10 text-cyan-100 placeholder-cyan-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                errors.email ? 'border border-red-500' : ''
              }`}
              placeholder="inserisci@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: false, general: null }));
              }}
              disabled={forceLogoutPenalty && countdown > 0}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-cyan-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full bg-gray-800 rounded px-3 py-2 pl-10 pr-10 text-cyan-100 placeholder-cyan-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                errors.password ? 'border border-red-500' : ''
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: false, general: null }));
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={forceLogoutPenalty && countdown > 0}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={forceLogoutPenalty && countdown > 0}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-cyan-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="rounded"
              disabled={forceLogoutPenalty && countdown > 0}
            />
            Ricordami
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={openInPopup}
              onChange={() => setOpenInPopup(!openInPopup)}
              className="rounded"
              disabled={forceLogoutPenalty && countdown > 0}
            />
            Apri in popup
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={forceLogoutPenalty && countdown > 0}
          className={`w-full mt-4 font-semibold py-2 rounded transition-colors ${
            forceLogoutPenalty && countdown > 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-500 text-black'
          }`}
        >
          {forceLogoutPenalty && countdown > 0 ? 'Accesso Bloccato' : 'Accedi'}
        </button>

        {(!forceLogoutPenalty || countdown <= 0) && (
          <div className="text-center mt-3">
            <button
              onClick={onOpenForgotPassword}
              className="text-cyan-400 hover:text-cyan-300 text-sm underline transition-colors"
            >
              Password dimenticata?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;