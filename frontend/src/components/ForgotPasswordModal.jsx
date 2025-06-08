import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import api from '../api';

const ForgotPasswordModal = ({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Inserisci un indirizzo email valido');
      return;
    }

    try {
      // Simulazione invio email
      await api.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
      setError('');
    } catch (err) {
      setError('Errore nell\'invio dell\'email. Riprova più tardi.');
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('input, button, select, textarea')) {
      return;
    }
    
    setIsDragging('forgotPassword');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('forgotPassword');
    e.preventDefault();
  };

  return (
    <div
      className="fixed w-[400px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 50,
        cursor: isDragging === 'forgotPassword' ? 'grabbing' : 'grab',
      }}
      onMouseDown={onFocus}
    >
      <div 
        className="flex justify-between items-center mb-4 p-6 pb-0 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-xl font-bold text-cyan-400">Recupero Password</h2>
        <button 
          onClick={onClose}
          className="text-cyan-400 hover:text-red-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-6 pb-6">
        {!isSubmitted ? (
          <div className="space-y-4">
            <p className="text-sm text-cyan-300">
              Inserisci il tuo indirizzo email. Ti invieremo le istruzioni per reimpostare la password.
            </p>

            <div>
              <label className="text-sm text-cyan-300 block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                <input
                  type="email"
                  className={`w-full bg-gray-800 rounded px-3 py-2 pl-10 text-cyan-100 placeholder-cyan-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    error ? 'border border-red-500' : ''
                  }`}
                  placeholder="inserisci@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Invia Email di Recupero
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-400 mb-4">
              <Mail size={48} className="mx-auto" />
            </div>
            <h3 className="text-cyan-300 font-semibold mb-2">Email Inviata!</h3>
            <p className="text-sm text-cyan-200">
              Abbiamo inviato le istruzioni per reimpostare la password all'indirizzo:
            </p>
            <p className="text-cyan-400 font-mono mt-2 mb-4">{email}</p>
            <p className="text-xs text-cyan-500">
              Controlla anche la cartella spam se non trovi l'email.
            </p>
            <button
              onClick={onClose}
              className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm underline"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;