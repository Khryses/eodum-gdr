import React, { useState } from 'react';
import { Eye, EyeOff, X, Mail, Lock } from 'lucide-react';
import axios from 'axios';

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
  const [openInPopup, setOpenInPopup] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);

      if (openInPopup) {
        window.open('/land', '_blank', 'width=1000,height=800');
      } else {
        alert('Login effettuato. Resta sulla homepage.');
      }

      onClose();
    } catch (err) {
      setErrors({ email: true, password: true });
    }
  };

  const handleMouseDown = (e) => {
    // Prevent dragging when clicking on form elements
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">Email non valida</p>
          )}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">Password non corretta</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-cyan-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="rounded"
            />
            Ricordami
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={openInPopup}
              onChange={() => setOpenInPopup(!openInPopup)}
              className="rounded"
            />
            Apri in popup
          </label>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 rounded transition-colors"
        >
          Accedi
        </button>

        <div className="text-center mt-3">
          <button
            onClick={onOpenForgotPassword}
            className="text-cyan-400 hover:text-cyan-300 text-sm underline transition-colors"
          >
            Password dimenticata?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;