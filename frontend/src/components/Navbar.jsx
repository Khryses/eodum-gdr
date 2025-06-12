import React from 'react';
import { FileText } from 'lucide-react';

const Navbar = ({ onOpenDocumenti }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-cyan-600/30 flex items-center justify-between px-6 z-40">
      <div className="text-cyan-400 text-2xl font-bold tracking-wider">EODUM</div>
      <button
        onClick={onOpenDocumenti}
        className="flex items-center gap-2 text-cyan-300 hover:text-cyan-100 text-sm border border-cyan-600 rounded px-3 py-1 transition-colors"
      >
        <FileText size={16} />
        <span>Documentazione</span>
      </button>
    </nav>
  );
};

export default Navbar;