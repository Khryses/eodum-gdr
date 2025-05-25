import React from 'react';

function HomePage({ onOpenRegister, onOpenLogin, bringModalsBehind }) {
  return (
    <div
      className="min-h-screen bg-gray-950 text-white px-6 pt-20 flex flex-col items-center"
      onClick={bringModalsBehind}
    >
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4">EODUM</h1>
        <p className="text-cyan-300 mb-8">
          Un gioco di ruolo online ambientato in una metropoli cyberpunk dove tecnologia, potere e mistero si intrecciano. 
          Unisciti alla community e scopri il tuo destino tra le ombre.
        </p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenRegister();
            }}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded shadow"
          >
            Registrati
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLogin();
            }}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-cyan-600 rounded"
          >
            Login
          </button>
        </div>
        <div className="mt-10 text-xs text-cyan-500">
          <p>PEGI 16 - Contenuti adatti a un pubblico maturo</p>
          <p className="mt-1">© 2500 EODUM Corporation. Tutti i diritti riservati.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;