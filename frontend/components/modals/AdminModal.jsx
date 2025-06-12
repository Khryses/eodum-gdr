
import React, { useRef, useEffect } from 'react';

function AdminModal({ onClose }) {
  const modalRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const modal = modalRef.current;
    const handleMouseDown = (e) => {
      offset.current = {
        x: e.clientX - modal.getBoundingClientRect().left,
        y: e.clientY - modal.getBoundingClientRect().top,
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      modal.style.left = `${e.clientX - offset.current.x}px`;
      modal.style.top = `${e.clientY - offset.current.y}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    modal.querySelector('.drag-handle').addEventListener('mousedown', handleMouseDown);
    return () => {
      modal.querySelector('.drag-handle').removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed left-1/2 top-1/2 z-50 bg-zinc-900 text-white border border-zinc-700 rounded-lg shadow-xl p-4"
      style={{
        transform: 'translate(-50%, -50%)',
        width: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <div className="drag-handle cursor-move bg-zinc-800 p-2 rounded-t-md font-semibold mb-4">
        ⚙️ Pannello di Gestione
        <button onClick={onClose} className="float-right text-red-400 hover:text-red-200">✕</button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Da qui il gestore può accedere a tutte le funzionalità amministrative del database.
        </p>

        {/* Qui andranno le sezioni reali: gestione utenti, mercato, mappe, log... */}
        <div className="bg-zinc-800 p-3 rounded border border-zinc-600">
          <p className="text-xs text-zinc-400 italic">Funzionalità in arrivo...</p>
        </div>
      </div>
    </div>
  );
}

export default AdminModal;
