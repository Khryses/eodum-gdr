const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');

const bannedNamesPath = path.join(__dirname, '../data/nomi-vietati.json');
let bannedNames = [];

try {
  const data = fs.readFileSync(bannedNamesPath, 'utf8');
  bannedNames = JSON.parse(data).map(n => n.toLowerCase());
} catch (err) {
  console.error('Errore nel caricamento dei nomi vietati:', err.message);
}

router.post('/register', async (req, res) => {
  const { nome, cognome, sesso, razza, email } = req.body;
  const nomeCompleto = `${nome} ${cognome}`.toLowerCase();
  if (bannedNames.includes(nomeCompleto)) {
    return res.status(400).json({ error: 'Il nome scelto è riservato o protetto da copyright.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    const passwordGenerata = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(passwordGenerata, 10);

    const nuovoUtente = await User.create({
      nome,
      cognome,
      sesso,
      razza,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Utente registrato con successo. Controlla la tua email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella registrazione' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const utente = await User.findOne({ where: { email } });
    if (!utente) return res.status(401).json({ error: 'Email non trovata' });

    const match = await bcrypt.compare(password, utente.password);
    if (!match) return res.status(401).json({ error: 'Password errata' });

    const token = jwt.sign({ id: utente.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel login' });
  }
});

// Nuova route protetta /me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'nome', 'cognome', 'email', 'razza', 'sesso', 'caratteristiche']
    });
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

module.exports = router;
