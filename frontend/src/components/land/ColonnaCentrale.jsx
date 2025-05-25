import React, { useState } from 'react';

const mappa = {
  "Centro": ["Fortezza", "Banca", "Statua"],
  "Periferia": ["Rovine", "Ponte", "Area verde"],
  "Mercato": ["Bazar", "Taverna", "Magazzino"],
  "Quartiere": ["Casette", "Parcheggio", "Campo"]
};

export default function ColonnaCentrale() {
  const [zona, setZona] = useState(null);
  const [luogo, setLuogo] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const invia = () => {
    if (input.trim()) {
      setChat(prev => [...prev, { user: "Tu", text: input.trim() }]);
      setInput("");
    }
  };

  return (
    <div className="flex-1 bg-gray-950/60 p-6 flex flex-col">
      {!zona && !luogo && (
        <>
          <h2 className="text-xl font-bold text-cyan-300 mb-4">Mappa di Eodum</h2>
          <div className="bg-gray-800/40 border border-cyan-600/20 rounded p-6 flex items-center justify-center relative h-[450px]">
            {Object.keys(mappa).map((nome, index) => (
              <button
                key={index}
                onClick={() => setZona(nome)}
                className="absolute bg-cyan-700 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-all"
                style={{
                  top: [40, 190, 190, 330][index],
                  left: [200, 150, 350, 100][index],
                  position: 'absolute',
                  transform: 'translate(-50%, 0)'
                }}
              >
                {nome}
              </button>
            ))}
          </div>
        </>
      )}

      {zona && !luogo && (
        <div>
          <h2 className="text-lg font-semibold text-cyan-300 mb-3">{zona}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {mappa[zona].map((place, i) => (
              <button
                key={i}
                onClick={() => setLuogo(place)}
                className="bg-gray-800/50 border border-cyan-600/30 hover:border-cyan-400 text-cyan-200 p-3 rounded"
              >
                {place}
              </button>
            ))}
          </div>
          <button onClick={() => setZona(null)} className="text-sm text-cyan-400 hover:underline">
            ← Torna alla mappa
          </button>
        </div>
      )}

      {luogo && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-300">
              {zona} / {luogo}
            </h2>
            <button onClick={() => setLuogo(null)} className="text-sm text-cyan-400 hover:underline">
              ← Torna ai luoghi
            </button>
          </div>
          <div className="flex-1 bg-gray-900/40 border border-cyan-600/20 rounded p-4 overflow-y-auto mb-3">
            {chat.map((msg, idx) => (
              <p key={idx} className="text-cyan-100"><strong>{msg.user}:</strong> {msg.text}</p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && invia()}
              placeholder="Scrivi qualcosa..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-cyan-700 text-white rounded"
            />
            <button
              onClick={invia}
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
            >
              Invia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
