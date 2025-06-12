const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Errore nel middleware di autenticazione:', error);
    return res.status(401).json({ message: 'Token non valido' });
  }
};

module.exports = authMiddleware;
