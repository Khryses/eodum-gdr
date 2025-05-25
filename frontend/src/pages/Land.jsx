import React, { useState } from 'react';
import SidebarSinistra from '../components/land/SidebarSinistra';
import ColonnaCentrale from '../components/land/ColonnaCentrale';
import EodumLandPage from '../components/land/EodumLandPage';
import DocumentationModal from '../components/DocumentationModal';
import CharacterSheetModal from '../components/land/CharacterSheetModal';

export default function Land() {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [documentationPosition, setDocumentationPosition] = useState({ x: 150, y: 150 });
  const [sheetPosition, setSheetPosition] = useState({ x: 250, y: 200 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const zIndex = 50;

  return (
    <div className="h-screen bg-gray-950 text-cyan-300 font-mono overflow-hidden relative">
      {/* Topbar */}
      <div className="h-12 bg-gray-900/90 border-b border-cyan-600/50 flex items-center justify-between px-4 backdrop-blur-sm">
        <div className="text-cyan-300 font-bold text-lg tracking-wider">
          <span className="text-blue-400">E</span>ODUM <span className="text-cyan-600 text-sm ml-2">v2.1</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-gray-800/50 border border-cyan-600/50 rounded text-sm text-cyan-400">
            Visibile
          </button>
          <button className="px-3 py-1 bg-gray-800/50 border border-blue-600/50 rounded text-sm text-blue-400">
            Bacheche ON/OFF
          </button>
          <button className="px-3 py-1 bg-gray-800/50 border border-purple-600/50 rounded text-sm text-purple-300">
            Admin
          </button>
          <button className="px-3 py-1 bg-red-900/50 border border-red-600/50 rounded text-sm text-red-400">
            Logout
          </button>
        </div>
      </div>

      {/* Layout 3 colonne */}
      <div className="flex h-[calc(100%-3rem)]">
        <SidebarSinistra onOpenDocs={() => setShowDocumentation(true)} onOpenSheet={() => setShowSheet(true)} />
        <ColonnaCentrale />
        <EodumLandPage />
      </div>

      {/* Modali */}
      {showDocumentation && (
        <DocumentationModal
          onClose={() => setShowDocumentation(false)}
          position={documentationPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex}
        />
      )}
      {showSheet && (
        <CharacterSheetModal
          onClose={() => setShowSheet(false)}
          position={sheetPosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          setIsDragging={setIsDragging}
          zIndex={zIndex + 1}
        />
      )}
    </div>
  );
}
