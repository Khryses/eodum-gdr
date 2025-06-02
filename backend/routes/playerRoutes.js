const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Gestisce il movimento del giocatore
router.post('/move', authMiddleware, async (req, res) => {
  try {
    const { location, timestamp } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    // Aggiorna la location del giocatore
    req.user.current_location = location;
    req.user.updated_at = new Date(timestamp || Date.now());
    await req.user.save();

    console.log(`${req.user.nome} ${req.user.cognome} si è spostato in: ${location}`);

    res.status(200).json({ 
      message: `Movimento registrato: ${location}`,
      location: location,
      timestamp: req.user.updated_at
    });
  } catch (error) {
    console.error('Errore in player/move:', error);
    res.status(500).json({ message: 'Errore durante il movimento del giocatore' });
  }
});

module.exports = router;