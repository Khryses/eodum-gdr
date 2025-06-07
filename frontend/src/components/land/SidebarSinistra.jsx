import React, { useState } from 'react';
import { 
  Briefcase, DollarSign, ShoppingCart, BookOpen, FileText, Settings, 
  MessageSquare, Home, RefreshCw, User, LogOut, Shield, Map, 
  Users, Ban, Database, Eye, AlertTriangle, Plus, Trash2, Edit3,
  Save, UserMinus, MessageCircle, Activity
} from 'lucide-react';

export default function SidebarSinistra({
  onOpenDocs,
  onOpenSheet,
  onOpenManagement,
  onRefresh,
  onNormalLogout,
  isAdmin
}) {
  const admin = typeof isAdmin === 'boolean' ? isAdmin : localStorage.getItem('role') === 'admin';
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('maps');

  const handleRefreshClick = () => {
    const button = document.getElementById('refresh-button');
    if (button) {
      button.classList.add('animate-spin');
      setTimeout(() => {
        button.classList.remove('animate-spin');
      }, 1000);
    }
    
    if (onRefresh) {
      onRefresh();
    }
  };

  const AdminPanel = () => (
    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-red-400" />
        <h4 className="text-red-400 font-bold text-sm">PANNELLO ADMIN</h4>
      </div>
      
      {/* Menu tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => setActiveAdminTab('maps')}
          className={`px-2 py-1 rounded text-xs ${
            activeAdminTab === 'maps' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Mappe
        </button>
        <button
          onClick={() => setActiveAdminTab('docs')}
          className={`px-2 py-1 rounded text-xs ${
            activeAdminTab === 'docs' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-2 py-1 rounded text-xs ${
            activeAdminTab === 'users' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Utenti
        </button>
        <button
          onClick={() => setActiveAdminTab('system')}
          className={`px-2 py-1 rounded text-xs ${
            activeAdminTab === 'system' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Sistema
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 text-xs">
        {activeAdminTab === 'maps' && (
          <div className="space-y-2">
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Map className="w-3 h-3" /> Modifica Mappe
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Plus className="w-3 h-3" /> Aggiungi Zone
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Edit3 className="w-3 h-3" /> Modifica Location
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Database className="w-3 h-3" /> Import/Export
            </button>
          </div>
        )}

        {activeAdminTab === 'docs' && (
          <div className="space-y-2">
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <FileText className="w-3 h-3" /> Modifica Regole
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <BookOpen className="w-3 h-3" /> Guide Giocatori
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Edit3 className="w-3 h-3" /> Caratteristiche
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Save className="w-3 h-3" /> Salva Modifiche
            </button>
          </div>
        )}

        {activeAdminTab === 'users' && (
          <div className="space-y-2">
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Users className="w-3 h-3" /> Lista Utenti
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Ban className="w-3 h-3" /> Sistema Ban
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <UserMinus className="w-3 h-3" /> Kick Utenti
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Eye className="w-3 h-3" /> Osserva Chat
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Edit3 className="w-3 h-3" /> Modifica PG
            </button>
          </div>
        )}

        {activeAdminTab === 'system' && (
          <div className="space-y-2">
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Activity className="w-3 h-3" /> Log Sistema
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Database className="w-3 h-3" /> Backup DB
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <MessageCircle className="w-3 h-3" /> Annunci
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <AlertTriangle className="w-3 h-3" /> Manutenzione
            </button>
            <button className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 transition-colors">
              <Settings className="w-3 h-3" /> Configurazioni
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-gray-900/70 border-r border-cyan-600/30 p-4 text-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
        </div>

        {/* Pannello Admin - solo se admin */}
        {admin && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="w-full flex items-center justify-between gap-2 p-2 bg-red-900/40 border border-red-600/50 rounded text-sm text-red-400 hover:bg-red-800/40 hover:border-red-500 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </div>
                <span className={`transform transition-transform ${showAdminPanel ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
            </div>

            {showAdminPanel && <AdminPanel />}
          </>
        )}

        {/* Menu Giocatore normale */}
        <div className="space-y-3 text-cyan-300">
          <h3 className="text-xs font-bold uppercase text-white tracking-widest mb-1">Menu Giocatore</h3>
          <button className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <Briefcase className="w-4 h-4" /> Mestieri
          </button>
          <button className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <DollarSign className="w-4 h-4" /> Banca
          </button>
          <button className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <ShoppingCart className="w-4 h-4" /> Mercato
          </button>
          <button className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <BookOpen className="w-4 h-4" /> Guide
          </button>
          <button onClick={onOpenDocs} className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <FileText className="w-4 h-4" /> Documenti
          </button>
          <button onClick={onOpenSheet} className="flex items-center gap-3 w-full text-left hover:text-cyan-100 transition-colors">
            <User className="w-4 h-4" /> Scheda Personaggio
          </button>
        </div>
      </div>
      
      <div className="space-y-2 pt-6">
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300 hover:bg-gray-700 hover:border-cyan-500/50 transition-all">
          <MessageSquare className="w-4 h-4" /> Messaggi ON/OFF
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300 hover:bg-gray-700 hover:border-cyan-500/50 transition-all">
          <Home className="w-4 h-4" /> Mappa
        </button>
        <button 
          id="refresh-button"
          onClick={handleRefreshClick}
          className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 border border-cyan-600/30 rounded text-sm text-cyan-300 hover:bg-gray-700 hover:border-cyan-500/50 transition-all"
          title="Aggiorna la Land (Auto-refresh ogni minuto)"
        >
          <RefreshCw className="w-4 h-4" /> Aggiorna
        </button>
        
        {/* Logout Button */}
        <button 
          onClick={onNormalLogout}
          className="w-full flex items-center justify-center gap-2 p-2 bg-red-900/50 border border-red-600/50 rounded text-sm text-red-400 hover:bg-red-800/50 hover:border-red-500 transition-all mt-4"
          title="Logout sicuro (nessuna penalità)"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
        
        {/* Indicatore auto-refresh */}
        <div className="text-xs text-cyan-600 text-center mt-2 opacity-60">
          🔄 Auto-refresh: 60s
        </div>
      </div>
    </div>
  );
}
