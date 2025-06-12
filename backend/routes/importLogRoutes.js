
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const isGestore = require('../middleware/gestoreMiddleware');

const {
  ChatLog,
  PrivateMessage,
  NoticeBoardLog,
  PurchaseLog,
  StaffLog
} = require('../models');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'tmp/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

const modelMap = {
  chat: ChatLog,
  mp: PrivateMessage,
  bacheca: NoticeBoardLog,
  acquisti: PurchaseLog,
  staff: StaffLog
};

router.post('/import-log', auth, isGestore, upload.single('file'), async (req, res) => {
  const { type } = req.body;
  const model = modelMap[type];

  if (!model || !req.file || !req.file.originalname.endsWith('.json')) {
    return res.status(400).json({ message: 'Tipo log non valido o file mancante/non JSON' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(req.file.path));
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Formato JSON non valido (atteso array)' });
    }

    await model.bulkCreate(data);
    fs.unlinkSync(req.file.path);
    res.json({ message: 'Log ripristinato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il ripristino log' });
  }
});

module.exports = router;
