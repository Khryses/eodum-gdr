
const express = require('express');
const router = express.Router();
const { Map } = require('../models');

router.get('/', async (req, res) => {
  try {
    const maps = await Map.findAll();
    res.json(maps);
  } catch (err) {
    res.status(500).json({ message: 'Errore caricamento mappe' });
  }
});

module.exports = router;
