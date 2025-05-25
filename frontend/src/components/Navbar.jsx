import React from 'react';

const Navbar = ({ onOpenDocumenti }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-cyan-600/30 flex items-center justify-between px-6 z-40">
      <div className="text-cyan-400 text-xl font-bold tracking-wide">EODUM</div>
      <button
        onClick={onOpenDocumenti}
        className="text-cyan-300 hover:text-cyan-100 text-sm border border-cyan-600 rounded px-3 py-1 transition"
      >
        Documentazione
      </button>
    </nav>
  );
};

export default Navbar;