const { User } = require('../models');

// Recupera tutti gli utenti attualmente online
const getPresenti = async (req, res) => {
  try {
    const utenti = await User.findAll({
      where: {
        is_online: true
      },
      attributes: ['id', 'nome', 'cognome', 'current_location']
    });

    res.status(200).json(utenti);
  } catch (error) {
    console.error('Errore in getPresenti:', error);
    res.status(500).json({ message: 'Errore nel recupero dei presenti' });
  }
};

// Imposta l'utente come online all'accesso e lo posiziona nella "Città di Eodum"
const setOnline = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    req.user.is_online = true;
    req.user.current_location = 'Città di Eodum';
    await req.user.save();

    res.status(200).json({ message: 'Utente online e posizionato nella Città di Eodum' });
  } catch (error) {
    console.error('Errore in setOnline:', error);
    res.status(500).json({ message: 'Errore durante l\'accesso dell\'utente' });
  }
};

// Imposta l'utente come offline in caso di logout
const setOffline = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    req.user.is_online = false;
    await req.user.save();

    res.status(200).json({ message: 'Utente impostato come offline' });
  } catch (error) {
    console.error('Errore in setOffline:', error);
    res.status(500).json({ message: 'Errore durante la disconnessione dell\'utente' });
  }
};

module.exports = {
  getPresenti,
  setOnline,
  setOffline
};
