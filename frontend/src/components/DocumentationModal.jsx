import React from 'react';
import { X } from 'lucide-react';

function DocumentationModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex,
  scrollToSection
}) {
  const handleMouseDown = (e) => {
    setIsDragging('documentation');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('documentation');
  };

  return (
    <div
      className="fixed w-[600px] h-[400px] bg-gray-900 border border-cyan-700 rounded-xl p-6 shadow-2xl overflow-y-auto"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 40,
        cursor: isDragging === 'documentation' ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">DOCUMENTAZIONE</h2>
        <button onClick={onClose}>
          <X className="text-cyan-400 hover:text-red-400" size={18} />
        </button>
      </div>

      <div className="space-y-4 text-cyan-200 text-sm">
        <div id="forza">
          <h3 className="text-cyan-400 font-semibold">Forza</h3>
          <ul>
            <li>1 - Sotto la media</li>
            <li>2 - Media</li>
            <li>3 - Forte</li>
            <li>4 - Molto forte</li>
            <li>5 - Eccezionale</li>
          </ul>
        </div>
        <div id="destrezza">
          <h3 className="text-cyan-400 font-semibold">Destrezza</h3>
          <ul>
            <li>1 - Goffo</li>
            <li>2 - Normale</li>
            <li>3 - Agile</li>
            <li>4 - Molto agile</li>
            <li>5 - Acrobat</li>
          </ul>
        </div>
        {/* Altre caratteristiche seguono con id corrispondenti */}
        <div id="intuito">
          <h3 className="text-cyan-400 font-semibold">Intuito</h3>
          <ul>
            <li>1 - Distratto</li>
            <li>2 - Attento</li>
            <li>3 - Ricettivo</li>
            <li>4 - Intuitivo</li>
            <li>5 - Chiaroveggente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DocumentationModal;