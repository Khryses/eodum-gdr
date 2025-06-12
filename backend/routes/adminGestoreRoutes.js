
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isGestore = require('../middleware/gestoreMiddleware');
const adminCtrl = require('../controllers/adminGestoreController');

router.post('/change-role', auth, isGestore, adminCtrl.changeUserRole);
// TODO: aggiungere: ban, esporta log, svuota log, gestione oggetti

module.exports = router;
