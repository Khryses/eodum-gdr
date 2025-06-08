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

  // Gestori per le funzioni admin
  const handleAdminMapEdit = () => {
    onOpenManagement?.();
  };

  const handleAdminDocEdit = () => {
    // Apri modal gestione con tab documentazione
    if (onOpenManagement) {
      onOpenManagement('documentation');
    }
  };

  const handleAdminUserManagement = () => {
    // Placeholder per gestione utenti
    alert('Gestione Utenti: Funzionalità in sviluppo\n\n- Lista utenti online\n- Sistema ban/kick\n- Modifica personaggi\n- Log attività');
  };

  const handleAdminSystemLogs = () => {
    // Placeholder per log di sistema
    alert('Log di Sistema: Funzionalità in sviluppo\n\n- Log connessioni\n- Log errori\n- Statistiche server\n- Monitoraggio prestazioni');
  };

  const handleAdminBackup = () => {
    // Placeholder per backup
    if (confirm('Vuoi creare un backup del database?')) {
      alert('Backup Database: Funzionalità in sviluppo\n\n- Backup automatico\n- Restore dati\n- Export/Import');
    }
  };

  const handleAdminAnnouncements = () => {
    // Placeholder per annunci
    const message = prompt('Inserisci un annuncio per tutti i giocatori:');
    if (message) {
      alert(`Annuncio inviato: "${message}"`);
    }
  };

  const handleAdminMaintenance = () => {
    // Placeholder per manutenzione
    if (confirm('Vuoi attivare la modalità manutenzione?')) {
      alert('Modalità Manutenzione: Funzionalità in sviluppo\n\n- Blocco accessi\n- Messaggio personalizzato\n- Riavvio server');
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
          className={`px-2 py-1 rounded text-xs transition-colors ${
            activeAdminTab === 'maps' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Mappe
        </button>
        <button
          onClick={() => setActiveAdminTab('docs')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            activeAdminTab === 'docs' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            activeAdminTab === 'users' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-700 text-red-300 hover:bg-gray-600'
          }`}
        >
          Utenti
        </button>
        <button
          onClick={() => setActiveAdminTab('system')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
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
            <button 
              onClick={handleAdminMapEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Map className="w-3 h-3" /> Modifica Mappe
            </button>
            <button 
              onClick={handleAdminMapEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> Aggiungi Zone
            </button>
            <button 
              onClick={handleAdminMapEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Edit3 className="w-3 h-3" /> Modifica Location
            </button>
            <button 
              onClick={handleAdminBackup}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Database className="w-3 h-3" /> Import/Export
            </button>
          </div>
        )}

        {activeAdminTab === 'docs' && (
          <div className="space-y-2">
            <button 
              onClick={handleAdminDocEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <FileText className="w-3 h-3" /> Modifica Regole
            </button>
            <button 
              onClick={handleAdminDocEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <BookOpen className="w-3 h-3" /> Guide Giocatori
            </button>
            <button 
              onClick={handleAdminDocEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Edit3 className="w-3 h-3" /> Caratteristiche
            </button>
            <button 
              onClick={handleAdminDocEdit}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Save className="w-3 h-3" /> Editor Documenti
            </button>
          </div>
        )}

        {activeAdminTab === 'users' && (
          <div className="space-y-2">
            <button 
              onClick={handleAdminUserManagement}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Users className="w-3 h-3" /> Lista Utenti
            </button>
            <button 
              onClick={handleAdminUserManagement}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Ban className="w-3 h-3" /> Sistema Ban
            </button>
            <button 
              onClick={handleAdminUserManagement}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <UserMinus className="w-3 h-3" /> Kick Utenti
            </button>
            <button 
              onClick={handleAdminUserManagement}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Eye className="w-3 h-3" /> Monitor Chat
            </button>
            <button 
              onClick={handleAdminUserManagement}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Edit3 className="w-3 h-3" /> Modifica PG
            </button>
          </div>
        )}

        {activeAdminTab === 'system' && (
          <div className="space-y-2">
            <button 
              onClick={handleAdminSystemLogs}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Activity className="w-3 h-3" /> Log Sistema
            </button>
            <button 
              onClick={handleAdminBackup}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Database className="w-3 h-3" /> Backup DB
            </button>
            <button 
              onClick={handleAdminAnnouncements}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> Annunci
            </button>
            <button 
              onClick={handleAdminMaintenance}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <AlertTriangle className="w-3 h-3" /> Manutenzione
            </button>
            <button 
              onClick={handleAdminSystemLogs}
              className="flex items-center gap-2 w-full text-left text-red-300 hover:text-red-200 hover:bg-red-900/30 p-1 rounded transition-colors"
            >
              <Settings className="w-3 h-3" /> Config Server
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