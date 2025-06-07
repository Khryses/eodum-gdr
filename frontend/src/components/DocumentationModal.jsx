import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDocumentation } from '../context/DocumentationContext';

export default function DocumentationModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex
}) {
  const { docs } = useDocumentation();
  const sections = [
    { key: 'caratteristiche', label: 'Caratteristiche' },
    { key: 'abilita', label: 'Abilit\u00e0' },
    { key: 'creazione', label: 'Creazione Personaggio' }
  ];
  const [active, setActive] = useState('caratteristiche');

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content')) return;
    setIsDragging('documentation');
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    onFocus('documentation');
    e.preventDefault();
  };

  return (
    <div
      className="fixed w-[600px] h-[400px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 40,
        cursor: isDragging === 'documentation' ? 'grabbing' : 'grab'
      }}
      onMouseDown={onFocus}
    >
      <div className="flex justify-between items-center p-4 cursor-grab" onMouseDown={handleMouseDown}>
        <h2 className="text-xl font-bold text-cyan-400">DOCUMENTAZIONE</h2>
        <button onClick={onClose} className="text-cyan-400 hover:text-red-400 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="flex h-[calc(100%-48px)]">
        <div className="w-48 border-r border-cyan-700 p-4 space-y-2">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`block w-full text-left text-sm ${active === s.key ? 'text-cyan-400' : 'text-cyan-200 hover:text-cyan-300'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 p-4 overflow-y-auto scrollable-content">
          <p className="text-cyan-200 whitespace-pre-wrap text-sm">{docs[active]}</p>
        </div>
      </div>
    </div>
  );
}
