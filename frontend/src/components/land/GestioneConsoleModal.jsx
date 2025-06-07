// src/components/land/GestioneConsoleModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import GestioneMappe from './GestioneMappe';

export default function GestioneConsoleModal({
  onClose,
  position,
  isDragging,
  setIsDragging,
  dragOffset,
  setDragOffset,
  onFocus,
  zIndex
}) {
  const [activeTab, setActiveTab] = useState('mappe');

  const handleMouseDown = (e) => {
    if (e.target.closest('input, textarea, button')) return;
    setIsDragging('gestione');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus('gestione');
    e.preventDefault();
  };

  return (
    <div
      className="fixed w-[800px] h-[550px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl overflow-hidden"
      style={{
        top: position.y,
        left: position.x,
        zIndex,
        cursor: isDragging === 'gestione' ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-600/40 bg-gray-800">
        <div className="font-bold text-cyan-300">Console Gestione</div>
        <button onClick={onClose} className="text-cyan-400 hover:text-red-500">
          <X />
        </button>
      </div>
      <div className="flex h-full">
        <div className="w-1/4 border-r border-cyan-800 bg-gray-800 p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('mappe')} className={`w-full text-left ${activeTab === 'mappe' ? 'text-cyan-400 font-bold' : 'text-white'}`}>
                🗺️ Mappe
              </button>
            </li>
            <li className="text-gray-500 italic text-xs">(Altre sezioni in arrivo)</li>
          </ul>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-900">
          {activeTab === 'mappe' && <GestioneMappe />}
        </div>
      </div>
    </div>
  );
}
