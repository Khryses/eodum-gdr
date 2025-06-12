
const { User, Role, Item, Market, Map, ChatLog, PrivateMessage, NoticeBoardLog, PurchaseLog, StaffLog } = require('../models');

// Esempio: cambia ruolo utente
exports.changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    user.role = newRole;
    await user.save();
    res.json({ message: 'Ruolo aggiornato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore aggiornamento ruolo' });
  }
};
