const express = require('express');
const router = express.Router();
const { getPresenti, setOnline, setOffline } = require('../controllers/presenzeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/presenti', authMiddleware, getPresenti);
router.post('/online', authMiddleware, setOnline);
router.post('/offline', authMiddleware, setOffline);

module.exports = router;
