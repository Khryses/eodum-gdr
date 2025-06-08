const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllMaps,
  createZone,
  updateZone,
  deleteZone,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/mapController');

// Middleware per verificare che l'utente sia admin (solo per modifiche)
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso negato: solo admin possono modificare le mappe' });
  }
  next();
};

// GET pubblico per le mappe (tutti gli utenti autenticati)
router.get('/', authMiddleware, getAllMaps);

// Routes per admin (creazione, modifica, eliminazione)
router.post('/zones', authMiddleware, adminMiddleware, createZone);
router.put('/zones/:zoneName', authMiddleware, adminMiddleware, updateZone);
router.delete('/zones/:zoneName', authMiddleware, adminMiddleware, deleteZone);

router.post('/locations', authMiddleware, adminMiddleware, createLocation);
router.put('/locations', authMiddleware, adminMiddleware, updateLocation);
router.delete('/locations', authMiddleware, adminMiddleware, deleteLocation);

module.exports = router;