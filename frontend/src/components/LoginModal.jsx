import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';

const LoginModal = ({
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openInPopup, setOpenInPopup] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
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
    setIsDragging('login');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('login');
  };

  return (
    <div
      className="fixed w-[400px] bg-gray-900 border border-cyan-700 rounded-xl p-6 shadow-2xl z-50"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 50,
        cursor: isDragging === 'login' ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Login</h2>
        <button onClick={onClose}>
          <X className="text-cyan-400 hover:text-red-400" size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-cyan-300">Email</label>
          <input
            type="email"
            className={`w-full bg-gray-800 rounded px-3 py-2 mt-1 ${
              errors.email ? 'border border-red-500' : ''
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">Email non valida</p>
          )}
        </div>

        <div>
          <label className="text-sm text-cyan-300">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full bg-gray-800 rounded px-3 py-2 mt-1 pr-10 ${
                errors.password ? 'border border-red-500' : ''
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-[37px] text-cyan-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">Password non corretta</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-cyan-300">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Ricordami
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={openInPopup}
              onChange={() => setOpenInPopup(!openInPopup)}
            />
            Apri in popup
          </label>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold py-2 rounded"
        >
          Accedi
        </button>
      </div>
    </div>
  );
};

export default LoginModal;