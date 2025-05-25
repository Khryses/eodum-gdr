import React from 'react';
import { Briefcase, DollarSign, ShoppingCart, BookOpen, FileText, Settings, MessageSquare, Home, RefreshCw, User } from 'lucide-react';

export default function SidebarSinistra({ onOpenDocs, onOpenSheet }) {
  return (
    <div className="w-64 bg-gray-900/70 border-r border-cyan-600/30 p-4 text-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-3 text-cyan-300">
          <h3 className="text-xs font-bold uppercase text-white tracking-widest mb-1">Menu Giocatore</h3>
          <button className="flex items-center gap-3 w-full text-left">
            <Briefcase className="w-4 h-4" /> Mestieri
          </button>
          <button className="flex items-center gap-3 w-full text-left">
            <DollarSign className="w-4 h-4" /> Banca
          </button>
          <button className="flex items-center gap-3 w-full text-left">
            <ShoppingCart className="w-4 h-4" /> Mercato
          </button>
          <button className="flex items-center gap-3 w-full text-left">
            <BookOpen className="w-4 h-4" /> Guide
          </button>
          <button onClick={onOpenDocs} className="flex items-center gap-3 w-full text-left">
            <FileText className="w-4 h-4" /> Documenti
          </button>
          <button className="flex items-center gap-3 w-full text-left text-red-500">
            <Settings className="w-4 h-4" /> Gestione
          </button>
        </div>
      </div>
      <div className="space-y-2 pt-6">
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300">
          <MessageSquare className="w-4 h-4" /> Messaggi ON/OFF
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300">
          <Home className="w-4 h-4" /> Mappa
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300">
          <RefreshCw className="w-4 h-4 animate-spin-slow" /> Aggiorna
        </button>
      </div>
    </div>
  );
}
