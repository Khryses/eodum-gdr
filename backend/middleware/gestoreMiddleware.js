
const { User } = require('../models');

async function isGestore(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (user && user.role === 'gestore') {
      next();
    } else {
      res.status(403).json({ message: 'Accesso riservato al gestore' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore autorizzazione gestore' });
  }
}

module.exports = isGestore;
