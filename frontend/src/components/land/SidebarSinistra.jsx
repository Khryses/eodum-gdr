
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function SidebarSinistra({ openAdminPanel }) {
  const { user } = useContext(UserContext);

  return (
    <div className="sidebar-sinistra bg-black text-white p-4 w-64 h-full fixed left-0 top-0 overflow-y-auto">
      <div className="text-lg font-bold mb-4">EODUM</div>
      <ul className="space-y-2">
        <li>Bacheche</li>
        <li>ON/OFF</li>
        {/* Solo per il gestore */}
        {user?.email === 'admin@eodum.it' && (
          <li>
            <button
              onClick={openAdminPanel}
              className="px-3 py-1 bg-red-900/50 border border-red-600/50 rounded text-sm text-red-300 hover:bg-red-800/50 transition-colors"
            >
              🛠 Console Gestore
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default SidebarSinistra;
