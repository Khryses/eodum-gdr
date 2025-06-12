
const express = require('express');
const router = express.Router();
const { Item } = require('../models');
const auth = require('../middleware/authMiddleware');
const isGestore = require('../middleware/gestoreMiddleware');

router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Errore caricamento oggetti' });
  }
});

router.post('/', auth, isGestore, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newItem = await Item.create({ name, description, price });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Errore creazione oggetto' });
  }
});

module.exports = router;
