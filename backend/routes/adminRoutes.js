const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  kickUser,
  banUser,
  getBannedUsers,
  removeBan,
  getAllCharacters,
  updateCharacter,
  getSystemLogs,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getSystemStats
} = require('../controllers/adminController');

// Middleware per verificare che l'utente sia admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso negato: solo admin' });
  }
  next();
};

// Applica middleware di autenticazione e admin a tutte le route
router.use(authMiddleware);
router.use(adminMiddleware);

// === GESTIONE UTENTI ===
router.get('/users', getAllUsers);
router.post('/users/:id/kick', kickUser);
router.post('/users/:id/ban', banUser);
router.get('/banned', getBannedUsers);
router.delete('/banned/:userId', removeBan);

// === GESTIONE PERSONAGGI ===
router.get('/characters', getAllCharacters);
router.put('/characters/:id', updateCharacter);

// === SISTEMA DI LOG ===
router.get('/logs', getSystemLogs);

// === GESTIONE ANNUNCI ===
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// === STATISTICHE DI SISTEMA ===
router.get('/stats', getSystemStats);

module.exports = router;