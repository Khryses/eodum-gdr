import React, { useState, useEffect } from 'react';
import { X, User, Zap, Heart, Brain, Sword, Shield, Star, Edit3, Save } from 'lucide-react';
import api from '../../api';

function CharacterSheetModal({
  onClose,
  position,
  isDragging,
  dragOffset,
  setDragOffset,
  setIsDragging,
  onFocus,
  zIndex
}) {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchCharacterData();
  }, []);

  const fetchCharacterData = async () => {
    try {
      const response = await api.get('/character/sheet');
      setCharacterData(response.data);
      setEditData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel recupero della scheda:', error);
      // Dati di fallback per demo
      const fallbackData = {
        name: "Aeliana",
        surname: "Tempesta", 
        gender: "Femmina",
        race: "Umano",
        level: 1,
        experience: 0,
        experienceToNext: 100,
        health: { current: 100, max: 100 },
        mana: { current: 50, max: 50 },
        attributes: {
          forza: 2,
          destrezza: 3,
          costituzione: 2,
          intelligenza: 3,
          prontezza: 2,
          intuito: 2,
          carisma: 2,
          autocontrollo: 2,
          sanguefreddo: 1
        },
        skills: {
          combattimento: 15,
          furtivita: 20,
          diplomazia: 10,
          investigazione: 25,
          tecnologia: 30
        },
        background: "Un'ex investigatrice privata che ha scoperto i segreti nascosti di Eodum. Ora vive nell'ombra, cercando la verità dietro le nebbie che avvolgono la città.",
        notes: "Ha una particolare avversione per la tecnologia troppo avanzata."
      };
      setCharacterData(fallbackData);
      setEditData(fallbackData);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/character/sheet', editData);
      setCharacterData(editData);
      setEditing(false);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      // Per demo, salva comunque localmente
      setCharacterData(editData);
      setEditing(false);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.scrollable-content, input, textarea, button')) {
      return;
    }
    
    setIsDragging('characterSheet');
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onFocus('characterSheet');
    e.preventDefault();
  };

  const getAttributeColor = (value) => {
    if (value >= 3) return 'text-green-400';
    if (value >= 2) return 'text-yellow-400'; 
    return 'text-red-400';
  };

  const getSkillColor = (value) => {
    if (value >= 25) return 'text-green-400';
    if (value >= 15) return 'text-yellow-400';
    return 'text-cyan-400';
  };

  if (loading) {
    return (
      <div
        className="fixed w-[800px] h-[600px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl flex items-center justify-center"
        style={{
          top: position.y,
          left: position.x,
          zIndex: zIndex || 40,
        }}
      >
        <div className="text-cyan-400">Caricamento scheda personaggio...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed w-[800px] h-[600px] bg-gray-900 border border-cyan-700 rounded-xl shadow-2xl"
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex || 40,
        cursor: isDragging === 'characterSheet' ? 'grabbing' : 'grab',
      }}
      onMouseDown={onFocus}
    >
      <div 
        className="flex justify-between items-center p-6 pb-4 cursor-grab border-b border-cyan-600/20"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">Scheda Personaggio</h2>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <button 
              onClick={handleSave}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
              title="Salva modifiche"
            >
              <Save size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
              title="Modifica scheda"
            >
              <Edit3 size={18} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-cyan-400 hover:text-red-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="scrollable-content px-6 pb-6 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-3 gap-6">
          {/* Colonna 1: Info Base */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informazioni Base
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cyan-400">Nome:</span>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="ml-2 bg-gray-700 text-cyan-100 px-2 py-1 rounded text-xs w-20"
                    />
                  ) : (
                    <span className="text-cyan-100 ml-2">{characterData.name}</span>
                  )}
                </div>
                
                <div>
                  <span className="text-cyan-400">Cognome:</span>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.surname}
                      onChange={(e) => setEditData({...editData, surname: e.target.value})}
                      className="ml-2 bg-gray-700 text-cyan-100 px-2 py-1 rounded text-xs w-24"
                    />
                  ) : (
                    <span className="text-cyan-100 ml-2">{characterData.surname}</span>
                  )}
                </div>
                
                <div>
                  <span className="text-cyan-400">Sesso:</span>
                  <span className="text-cyan-100 ml-2">{characterData.gender}</span>
                </div>
                
                <div>
                  <span className="text-cyan-400">Razza:</span>
                  <span className="text-cyan-100 ml-2">{characterData.race}</span>
                </div>
              </div>
            </div>

            {/* Esperienza e Livello */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Progressione
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-cyan-400">Livello:</span>
                  <span className="text-yellow-400 ml-2 font-bold">{characterData.level}</span>
                </div>
                
                <div>
                  <span className="text-cyan-400">Esperienza:</span>
                  <span className="text-cyan-100 ml-2">{characterData.experience}</span>
                </div>
                
                <div className="mt-2">
                  <div className="text-xs text-cyan-500 mb-1">
                    {characterData.experience}/{characterData.experienceToNext} al prossimo livello
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(characterData.experience / characterData.experienceToNext) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salute e Mana */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Risorse
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-400">Salute</span>
                    <span className="text-red-200">
                      {characterData.health.current}/{characterData.health.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(characterData.health.current / characterData.health.max) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-400">Mana</span>
                    <span className="text-blue-200">
                      {characterData.mana.current}/{characterData.mana.max}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(characterData.mana.current / characterData.mana.max) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonna 2: Attributi */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Attributi
              </h3>
              
              <div className="space-y-2">
                {Object.entries(characterData.attributes).map(([attr, value]) => (
                  <div key={attr} className="flex justify-between items-center">
                    <span className="text-cyan-400 capitalize text-sm">{attr}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getAttributeColor(value)}`}>{value}</span>
                      <div className="flex gap-1">
                        {[1,2,3].map(dot => (
                          <div 
                            key={dot}
                            className={`w-2 h-2 rounded-full ${
                              value >= dot ? 'bg-cyan-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilità */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Abilità
              </h3>
              
              <div className="space-y-2">
                {Object.entries(characterData.skills).map(([skill, value]) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="text-cyan-400 capitalize text-sm">{skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${getSkillColor(value)}`}>{value}%</span>
                      <div className="w-16 bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            value >= 25 ? 'bg-green-400' :
                            value >= 15 ? 'bg-yellow-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonna 3: Background e Note */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Sword className="w-4 h-4" />
                Background
              </h3>
              
              {editing ? (
                <textarea
                  value={editData.background}
                  onChange={(e) => setEditData({...editData, background: e.target.value})}
                  className="w-full h-32 bg-gray-700 text-cyan-100 p-2 rounded text-xs resize-none"
                  placeholder="Descrivi il background del personaggio..."
                />
              ) : (
                <p className="text-cyan-200 text-xs leading-relaxed">
                  {characterData.background}
                </p>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Note del Giocatore
              </h3>
              
              {editing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  className="w-full h-24 bg-gray-700 text-cyan-100 p-2 rounded text-xs resize-none"
                  placeholder="Note personali..."
                />
              ) : (
                <p className="text-cyan-200 text-xs leading-relaxed">
                  {characterData.notes}
                </p>
              )}
            </div>

            {/* Statistiche Aggiuntive */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-cyan-600/20">
              <h3 className="text-cyan-300 font-semibold mb-3">Statistiche</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-cyan-400">Sessioni giocate:</span>
                  <span className="text-cyan-100">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Tempo di gioco:</span>
                  <span className="text-cyan-100">24h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Ultimo accesso:</span>
                  <span className="text-cyan-100">Oggi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterSheetModal;