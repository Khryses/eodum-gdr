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

    // Trasforma la struttura dati per il frontend
    const presentiFormatted = utenti.map(user => ({
      name: `${user.nome} ${user.cognome}`,
      status: 'active',
      location: user.current_location
    }));

    res.status(200).json(presentiFormatted);
  } catch (error) {
    console.error('Errore in getPresenti:', error);
    res.status(500).json({ message: 'Errore nel recupero dei presenti' });
  }
};

// Recupera gli utenti presenti in una location specifica
const getPresentiByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const decodedLocation = decodeURIComponent(location);
    
    const utenti = await User.findAll({
      where: {
        is_online: true,
        current_location: decodedLocation
      },
      attributes: ['id', 'nome', 'cognome', 'current_location', 'updated_at']
    });

    // Determina lo status basato su quando è stato aggiornato l'ultimo accesso
    const now = new Date();
    const presentiFormatted = utenti.map(user => {
      const lastUpdate = new Date(user.updated_at);
      const diffMinutes = (now - lastUpdate) / (1000 * 60);
      
      let status = 'active';
      if (diffMinutes <= 1) {
        // Se aggiornato negli ultimi 1 minuto, potrebbe essere "entering"
        status = 'entering';
      }
      
      return {
        name: `${user.nome} ${user.cognome}`,
        status: status,
        location: user.current_location
      };
    });

    res.status(200).json(presentiFormatted);
  } catch (error) {
    console.error('Errore in getPresentiByLocation:', error);
    res.status(500).json({ message: 'Errore nel recupero dei presenti per location' });
  }
};

// Imposta l'utente come online all'accesso e lo posiziona nella "Città di Eodum"
const setOnline = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    req.user.is_online = true;
    req.user.current_location = 'Piazza Centrale';
    req.user.updated_at = new Date(); // Aggiorna timestamp
    await req.user.save();

    console.log(`${req.user.nome} ${req.user.cognome} è entrato in ${req.user.current_location}`);

    res.status(200).json({ 
      message: 'Utente online e posizionato nella Piazza Centrale',
      location: req.user.current_location
    });
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

    console.log(`${req.user.nome} ${req.user.cognome} è uscito dalla land`);

    res.status(200).json({ message: 'Utente impostato come offline' });
  } catch (error) {
    console.error('Errore in setOffline:', error);
    res.status(500).json({ message: 'Errore durante la disconnessione dell\'utente' });
  }
};

module.exports = {
  getPresenti,
  getPresentiByLocation,
  setOnline,
  setOffline
};