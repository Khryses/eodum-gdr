const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllMaps, createZone, updateZone, deleteZone, createLocation, updateLocation, deleteLocation } = require('../controllers/mapController');

// Middleware per verificare che l'utente sia admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso negato: solo admin' });
  }
  next();
};

// GET /api/maps - Recupera tutte le mappe (accessibile a tutti gli utenti autenticati)
router.get('/', authMiddleware, getAllMaps);

// POST /api/maps/zones - Crea una nuova zona (solo admin)
router.post('/zones', authMiddleware, adminMiddleware, createZone);

// PUT /api/maps/zones/:zoneName - Aggiorna una zona (solo admin)
router.put('/zones/:zoneName', authMiddleware, adminMiddleware, updateZone);

// DELETE /api/maps/zones/:zoneName - Elimina una zona (solo admin)
router.delete('/zones/:zoneName', authMiddleware, adminMiddleware, deleteZone);

// POST /api/maps/locations - Crea una nuova location (solo admin)
router.post('/locations', authMiddleware, adminMiddleware, createLocation);

// PUT /api/maps/locations - Aggiorna una location (solo admin)
router.put('/locations', authMiddleware, adminMiddleware, updateLocation);

// DELETE /api/maps/locations - Elimina una location (solo admin)
router.delete('/locations', authMiddleware, adminMiddleware, deleteLocation);

module.exports = router;