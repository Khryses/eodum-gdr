import React, { useState } from 'react';
import { X } from 'lucide-react';

function RegisterModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex,
  onOpenDocumentation
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [race, setRace] = useState('');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [attributes, setAttributes] = useState({
    forza: 1,
    destrezza: 1,
    costituzione: 1,
    carisma: 1,
    intelligenza: 1,
    prontezza: 1,
    autocontrollo: 1,
    sanguefreddo: 1,
    intuito: 1,
  });

  const maxPoints = 9;

  const totalAssigned = Object.values(attributes).reduce((sum, v) => sum + (v - 1), 0);

  const updateAttribute = (key, delta) => {
    const current = attributes[key];
    const newValue = current + delta;
    if (newValue < 1 || newValue > 3) return;
    const potentialTotal = totalAssigned + delta;
    if (potentialTotal > maxPoints) return;
    setAttributes({ ...attributes, [key]: newValue });
  };

  const handleMouseDown = (e) => {
    setIsDragging('register');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('register');
  };

  const validatePage2 = () => {
    const newErrors = {};
    if (!name || name.match(/harry potter|aragorn|frodo|skywalker/i)) newErrors.name = true;
    if (!surname || surname.match(/stark|potter|kenobi|skywalker/i)) newErrors.surname = true;
    if (!email.includes('@')) newErrors.email = true;
    if (!gender) newErrors.gender = true;
    if (!race) newErrors.race = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && termsAccepted) setStep(2);
    else if (step === 2 && validatePage2()) setStep(3);
    else if (step === 3 && totalAssigned === maxPoints) setStep(4);
  };

  const renderPage = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-cyan-400 mb-2">Termini e Condizioni</h2>
            <div className="text-sm text-cyan-200 max-h-60 overflow-y-auto border p-2 rounded mb-2">
              <p>Benvenuto in EODUM. Questo GDR è fittizio, ogni riferimento a fatti o persone è puramente casuale. L'ambientazione è cyberpunk e i temi trattati includono tecnologia, distopia e società fittizie. Nessun contenuto violento o illegale è permesso. Accettando questi termini, confermi di avere almeno 16 anni e di rispettare il regolamento interno della community.</p>
            </div>
            <label className="flex gap-2 text-cyan-300 text-sm">
              <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
              Accetto i termini
            </label>
          </>
        );
      case 2:
        return (
          <div className="space-y-2">
            <p className="text-xs text-cyan-400 italic">⚠️ È vietato usare nomi coperti da copyright (es. Harry Potter, Luke Skywalker...)</p>
            <input className={`w-full bg-gray-800 rounded px-3 py-2 ${errors.name ? 'border border-red-500' : ''}`} placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <input className={`w-full bg-gray-800 rounded px-3 py-2 ${errors.surname ? 'border border-red-500' : ''}`} placeholder="Cognome" value={surname} onChange={(e) => setSurname(e.target.value)} />
            <input className={`w-full bg-gray-800 rounded px-3 py-2 ${errors.email ? 'border border-red-500' : ''}`} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className={`w-full bg-gray-800 rounded px-3 py-2 ${errors.gender ? 'border border-red-500' : ''}`} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Sesso</option>
              <option value="Maschio">Maschio</option>
              <option value="Femmina">Femmina</option>
              <option value="Nonbinary">Nonbinary</option>
            </select>
            <select className={`w-full bg-gray-800 rounded px-3 py-2 ${errors.race ? 'border border-red-500' : ''}`} value={race} onChange={(e) => setRace(e.target.value)}>
              <option value="">Razza</option>
              <option value="Umano">Umano</option>
              <option value="Varghul">Varghul</option>
            </select>
          </div>
        );
      case 3:
        return (
          <>
            <p className="text-sm text-cyan-300 mb-2">Distribuisci 9 punti tra le caratteristiche (max 3 per ciascuna):</p>
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between mb-1">
                <button onClick={() => onOpenDocumentation(key)} className="text-cyan-400 hover:underline text-left w-1/3">{key.charAt(0).toUpperCase() + key.slice(1)}</button>
                <div className="flex gap-2 items-center">
                  <button onClick={() => updateAttribute(key, -1)} className="px-2 bg-cyan-700 rounded">−</button>
                  <span>{value}</span>
                  <button onClick={() => updateAttribute(key, 1)} className="px-2 bg-cyan-700 rounded">+</button>
                </div>
              </div>
            ))}
            <p className={`text-xs mt-2 ${totalAssigned < maxPoints ? 'text-red-500' : 'text-green-400'}`}>
              Punti assegnati: {totalAssigned} / {maxPoints}
            </p>
          </>
        );
      case 4:
        return <p className="text-cyan-300">Registrazione completata! Puoi chiudere questa finestra.</p>;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed w-[520px] bg-gray-900 border border-cyan-700 rounded-xl p-6 shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 50,
        cursor: isDragging === 'register' ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Registrazione</h2>
        <button onClick={onClose}>
          <X className="text-cyan-400 hover:text-red-400" size={18} />
        </button>
      </div>

      {renderPage()}

      <div className="mt-4 flex justify-end gap-2">
        {step > 1 && step < 4 && (
          <button className="text-cyan-400 hover:text-cyan-200 text-sm" onClick={() => setStep(step - 1)}>Indietro</button>
        )}
        {step < 4 && (
          <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-semibold px-4 py-2 rounded" onClick={handleNext}>Avanti</button>
        )}
      </div>
    </div>
  );
}

export default RegisterModal;