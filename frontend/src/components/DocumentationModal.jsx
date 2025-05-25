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
    // Prevent dragging when clicking on scrollable content
    if (e.target.closest('.scrollable-content')) {
      return;
    }
    
    setIsDragging('documentation');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('documentation');
    e.preventDefault();
  };

  return (
    <div
      className="fixed w-[600px] h-[400px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 40,
        cursor: isDragging === 'documentation' ? 'grabbing' : 'grab',
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

      <div className="scrollable-content px-6 pb-6 h-[calc(100%-60px)] overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {/* Sezione 1: Caratteristiche Base */}
          <div className="border-b border-cyan-600/20 pb-6">
            <h2 className="text-lg font-bold text-cyan-300 mb-4">Caratteristiche Base</h2>
            <div className="space-y-4 text-cyan-200 text-sm">
              <div id="forza">
                <h3 className="text-cyan-400 font-semibold mb-2">Forza</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Sotto la media</li>
                  <li>2 - Media</li>
                  <li>3 - Forte</li>
                  <li>4 - Molto forte</li>
                  <li>5 - Eccezionale</li>
                </ul>
              </div>
              
              <div id="destrezza">
                <h3 className="text-cyan-400 font-semibold mb-2">Destrezza</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Goffo</li>
                  <li>2 - Normale</li>
                  <li>3 - Agile</li>
                  <li>4 - Molto agile</li>
                  <li>5 - Acrobata</li>
                </ul>
              </div>
              
              <div id="costituzione">
                <h3 className="text-cyan-400 font-semibold mb-2">Costituzione</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Fragile</li>
                  <li>2 - Normale</li>
                  <li>3 - Resistente</li>
                  <li>4 - Molto resistente</li>
                  <li>5 - Indistruttibile</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sezione 2: Caratteristiche Mentali */}
          <div className="border-b border-cyan-600/20 pb-6">
            <h2 className="text-lg font-bold text-cyan-300 mb-4">Caratteristiche Mentali</h2>
            <div className="space-y-4 text-cyan-200 text-sm">
              <div id="intelligenza">
                <h3 className="text-cyan-400 font-semibold mb-2">Intelligenza</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Limitato</li>
                  <li>2 - Normale</li>
                  <li>3 - Brillante</li>
                  <li>4 - Geniale</li>
                  <li>5 - Genio assoluto</li>
                </ul>
              </div>
              
              <div id="prontezza">
                <h3 className="text-cyan-400 font-semibold mb-2">Prontezza</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Lento</li>
                  <li>2 - Normale</li>
                  <li>3 - Veloce</li>
                  <li>4 - Fulmineo</li>
                  <li>5 - Istantaneo</li>
                </ul>
              </div>
              
              <div id="intuito">
                <h3 className="text-cyan-400 font-semibold mb-2">Intuito</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Distratto</li>
                  <li>2 - Attento</li>
                  <li>3 - Ricettivo</li>
                  <li>4 - Intuitivo</li>
                  <li>5 - Chiaroveggente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sezione 3: Caratteristiche Sociali */}
          <div className="border-b border-cyan-600/20 pb-6">
            <h2 className="text-lg font-bold text-cyan-300 mb-4">Caratteristiche Sociali</h2>
            <div className="space-y-4 text-cyan-200 text-sm">
              <div id="carisma">
                <h3 className="text-cyan-400 font-semibold mb-2">Carisma</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Antipatico</li>
                  <li>2 - Normale</li>
                  <li>3 - Affascinante</li>
                  <li>4 - Magnetico</li>
                  <li>5 - Irresistibile</li>
                </ul>
              </div>
              
              <div id="autocontrollo">
                <h3 className="text-cyan-400 font-semibold mb-2">Autocontrollo</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Impulsivo</li>
                  <li>2 - Normale</li>
                  <li>3 - Disciplinato</li>
                  <li>4 - Imperturbabile</li>
                  <li>5 - Zen totale</li>
                </ul>
              </div>
              
              <div id="sanguefreddo">
                <h3 className="text-cyan-400 font-semibold mb-2">Sangue Freddo</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>1 - Codardo</li>
                  <li>2 - Normale</li>
                  <li>3 - Coraggioso</li>
                  <li>4 - Impavido</li>
                  <li>5 - Temerario</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sezione 4: Regole Generali */}
          <div className="pb-6">
            <h2 className="text-lg font-bold text-cyan-300 mb-4">Regole Generali</h2>
            <div className="space-y-3 text-cyan-200 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-600/20">
                <h3 className="text-cyan-400 font-semibold mb-2">Sistema di Punti</h3>
                <p>Ogni personaggio inizia con 1 punto in ogni caratteristica. Hai 9 punti aggiuntivi da distribuire, con un massimo di 3 punti per caratteristica.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-600/20">
                <h3 className="text-cyan-400 font-semibold mb-2">Tiri di Dado</h3>
                <p>Il sistema utilizza un dado a 10 facce (d10). Il valore della caratteristica determina il numero di dadi da lanciare nelle prove.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-600/20">
                <h3 className="text-cyan-400 font-semibold mb-2">Successi e Fallimenti</h3>
                <p>Ogni risultato di 7 o superiore conta come un successo. Il numero di successi determina il grado di riuscita dell'azione.</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-600/20">
                <h3 className="text-cyan-400 font-semibold mb-2">Combattimento</h3>
                <p>Le azioni di combattimento utilizzano combinazioni di caratteristiche. Ad esempio, un attacco fisico potrebbe richiedere Forza + Destrezza.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentationModal;