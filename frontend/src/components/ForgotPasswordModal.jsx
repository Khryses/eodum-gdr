
import React from 'react';
import { Mail, X } from 'lucide-react';

const ForgotPasswordModal = ({
  forgotForm,
  setForgotForm,
  handleForgotPassword,
  onClose,
  onOpenLogin,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  setActiveModal,
  activeModal,
}) => {

  const handleMouseDown = (e) => {
    setActiveModal('forgot');
    setIsDragging('forgot');
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      className="fixed bg-gray-900/95 border-2 border-cyan-600/80 rounded-lg shadow-2xl backdrop-blur-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '400px',
        cursor: isDragging === 'forgot' ? 'grabbing' : 'default',
        zIndex: activeModal === 'forgot' ? 60 : 50
      }}
      onClick={() => setActiveModal('forgot')}
    >
      <div
        className="flex items-center justify-between p-4 border-b border-cyan-600/50 bg-gray-800/90 cursor-grab active:cursor-grabbing backdrop-blur-sm rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-xl font-bold text-cyan-300 tracking-wider">RECUPERO PASSWORD</h2>
        <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-cyan-400 text-sm">
          Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.
        </p>

        <div>
          <label className="block text-cyan-300 text-sm font-bold mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
            <input
              type="email"
              value={forgotForm.email}
              onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
              className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-cyan-600/50 rounded text-cyan-300 placeholder-cyan-600/70 focus:border-cyan-500 focus:outline-none"
              placeholder="inserisci@email.com"
            />
          </div>
        </div>

        <button
          onClick={handleForgotPassword}
          className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-900 font-bold rounded hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          Invia Email di Recupero
        </button>

        <div className="text-center mt-4 text-sm text-cyan-500">
          <button onClick={onOpenLogin} className="text-cyan-400 hover:text-cyan-300 underline">
            Torna al login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
