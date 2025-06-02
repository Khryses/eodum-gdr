const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../utils/jwtUtils');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email o password non validi' });
    }

    user.is_online = true;
    user.current_location = "Piazza Centrale";
    user.updated_at = new Date(); // Aggiorna timestamp per il tracking delle presenze
    await user.save();

    console.log(`${user.nome} ${user.cognome} è entrato nella Piazza Centrale`);

    const token = generateToken(user.id);
    res.json({ 
      token,
      user: {
        nome: user.nome,
        cognome: user.cognome,
        location: user.current_location
      }
    });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore durante il login" });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const { userId, type } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.is_online = false;
      await user.save();
      
      if (type === 'forced') {
        console.log(`${user.nome} ${user.cognome} è stato disconnesso forzatamente`);
      } else {
        console.log(`${user.nome} ${user.cognome} è uscito dalla land correttamente`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Errore durante il logout:", error);
    res.status(500).json({ message: "Errore durante il logout" });
  }
});

module.exports = router;