import React, { useState } from 'react';
import { X } from 'lucide-react';
import { loadDocumentation } from '../data/documentation';

function DocumentationModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex
}) {
  const [section, setSection] = useState('caratteristiche');
  const docs = loadDocumentation();

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content')) return;
    setIsDragging('documentation');
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    onFocus('documentation');
    e.preventDefault();
  };

  const renderContent = () => {
    switch (section) {
      case 'caratteristiche':
        return <div className="whitespace-pre-wrap">{docs.caratteristiche}</div>;
      case 'abilita':
        return <div className="whitespace-pre-wrap">{docs.abilita}</div>;
      case 'creazione':
        return <div className="whitespace-pre-wrap">{docs.creazione}</div>;
      case 'regole':
        return <div className="whitespace-pre-wrap">{docs.regole}</div>;
      default:
        return null;
    }
  };

  const itemClasses = (key) =>
    `block w-full text-left px-2 py-1 rounded ${
      section === key ? 'text-cyan-400' : 'text-cyan-200 hover:text-cyan-100'
    }`;

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
      <div
        className="flex justify-between items-center p-6 pb-4 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-xl font-bold text-cyan-400">DOCUMENTAZIONE</h2>
        <button
          onClick={onClose}
          className="text-cyan-400 hover:text-red-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex h-[calc(100%-60px)]">
        <div className="w-48 border-r border-cyan-700 p-4 space-y-1 text-sm">
          <button onClick={() => setSection('caratteristiche')} className={itemClasses('caratteristiche')}>Caratteristiche</button>
          <button onClick={() => setSection('abilita')} className={itemClasses('abilita')}>Abilità</button>
          <button onClick={() => setSection('creazione')} className={itemClasses('creazione')}>Creazione PG</button>
          <button onClick={() => setSection('regole')} className={itemClasses('regole')}>Regole</button>
        </div>
        <div className="scrollable-content flex-1 overflow-y-auto p-6 text-cyan-200 text-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default DocumentationModal;
