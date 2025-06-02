import { useEffect, useState } from 'react';
import api from '../api';

export default function usePresenze() {
  const [presenze, setPresenze] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Dati di fallback per demo
  const fallbackData = [
    { name: 'Aeliana Tempesta', status: 'active', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Kael Ombraferro', status: 'active', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Lyra Lunascura', status: 'active', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Darius Ventonero', status: 'entering', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Mira Nebbiargento', status: 'leaving', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Theron Roccianera', status: 'leaving', location: 'Piazza Centrale', lastSeen: new Date() },
    { name: 'Marcus Ferroscuro', status: 'active', location: 'Taverna del Corvo Nero', lastSeen: new Date() },
    { name: 'Elena Ventogelido', status: 'active', location: 'Taverna del Corvo Nero', lastSeen: new Date() },
    { name: 'Sage Pergamena', status: 'active', location: 'Biblioteca Antica', lastSeen: new Date() },
    { name: 'Gareth Laminera', status: 'active', location: 'Arena dei Sussurri', lastSeen: new Date() },
    { name: 'Vera Ombralama', status: 'leaving', location: 'Arena dei Sussurri', lastSeen: new Date() },
    { name: 'Zara Temprapura', status: 'active', location: 'Arena dei Sussurri', lastSeen: new Date() }
  ];

  const fetchPresenze = async () => {
    try {
      const response = await api.get('/system/presenze');
      setPresenze(response.data.players || response.data || []);
      setIsConnected(true);
    } catch (error) {
      console.error('Errore nel recupero delle presenze:', error);
      setIsConnected(false);
      
      // Simula cambiamenti negli stati per demo
      setPresenze(prevPresenze => {
        if (prevPresenze.length === 0) {
          return fallbackData;
        }
        
        // Simula occasionali cambi di stato
        return prevPresenze.map(player => {
          const random = Math.random();
          
          // 5% di probabilità di cambiare stato
          if (random < 0.05) {
            if (player.status === 'entering') {
              return { ...player, status: 'active' };
            } else if (player.status === 'leaving') {
              // Rimuovi giocatori che stanno uscendo dopo un po'
              return null;
            } else if (random < 0.02) {
              // Occasionalmente qualcuno inizia a uscire
              return { ...player, status: 'leaving' };
            }
          }
          
          return player;
        }).filter(Boolean);
      });
    }
  };

  // WebSocket per aggiornamenti in tempo reale
  useEffect(() => {
    let ws = null;
    let reconnectInterval = null;

    const connectWebSocket = () => {
      try {
        // Prova a connettersi al WebSocket
        ws = new WebSocket('ws://localhost:4000/ws/presenze');
        
        ws.onopen = () => {
          console.log('WebSocket connesso per presenze');
          setIsConnected(true);
          if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'presenze_update') {
              setPresenze(data.players || []);
            } else if (data.type === 'player_enter') {
              setPresenze(prev => {
                const existing = prev.find(p => p.name === data.player.name);
                if (existing) {
                  return prev.map(p => 
                    p.name === data.player.name 
                      ? { ...p, status: 'entering', location: data.player.location }
                      : p
                  );
                } else {
                  return [...prev, { ...data.player, status: 'entering' }];
                }
              });
            } else if (data.type === 'player_leave') {
              setPresenze(prev => 
                prev.map(p => 
                  p.name === data.player.name 
                    ? { ...p, status: 'leaving' }
                    : p
                )
              );
            } else if (data.type === 'player_move') {
              setPresenze(prev => 
                prev.map(p => 
                  p.name === data.player.name 
                    ? { ...p, location: data.player.location }
                    : p
                )
              );
            }
          } catch (error) {
            console.error('Errore parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnesso, tentativo di riconnessione...');
          setIsConnected(false);
          
          if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
              connectWebSocket();
            }, 5000);
          }
        };

        ws.onerror = (error) => {
          console.error('Errore WebSocket:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Errore connessione WebSocket:', error);
        setIsConnected(false);
      }
    };

    // Fetch iniziale
    fetchPresenze();
    
    // Prova connessione WebSocket
    connectWebSocket();
    
    // Fallback con polling se WebSocket non funziona
    const pollInterval = setInterval(() => {
      if (!isConnected) {
        fetchPresenze();
      }
    }, 10000); // Polling ogni 10 secondi se WebSocket non connesso

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
      clearInterval(pollInterval);
    };
  }, []);

  return presenze;
}