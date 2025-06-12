
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isGestore = require('../middleware/gestoreMiddleware');
const { ChatLog, PrivateMessage, NoticeBoardLog, PurchaseLog, StaffLog } = require('../models');

const logsMap = {
  chat: ChatLog,
  mp: PrivateMessage,
  bacheca: NoticeBoardLog,
  acquisti: PurchaseLog,
  staff: StaffLog
};

router.get('/export/:type', auth, isGestore, async (req, res) => {
  const type = req.params.type;
  const model = logsMap[type];
  if (!model) return res.status(400).json({ message: 'Tipo di log non valido' });

  try {
    const logs = await model.findAll();
    const filePath = path.join(__dirname, `../../tmp/${type}-log.json`);
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
    res.download(filePath, `${type}-log.json`);
  } catch (err) {
    res.status(500).json({ message: 'Errore esportazione log' });
  }
});

router.delete('/clear/:type', auth, isGestore, async (req, res) => {
  const type = req.params.type;
  const model = logsMap[type];
  if (!model) return res.status(400).json({ message: 'Tipo di log non valido' });

  try {
    await model.destroy({ where: {} });
    res.json({ message: 'Log svuotato' });
  } catch (err) {
    res.status(500).json({ message: 'Errore svuotamento log' });
  }
});

module.exports = router;
