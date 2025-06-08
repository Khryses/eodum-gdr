const { User } = require('../models');
const fs = require('fs').promises;
const path = require('path');

// File per log e configurazioni
const LOGS_FILE = path.join(__dirname, '../data/system-logs.json');
const ANNOUNCEMENTS_FILE = path.join(__dirname, '../data/announcements.json');
const BAN_FILE = path.join(__dirname, '../data/banned-users.json');

// Utility per assicurare che le directory esistano
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(LOGS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// === GESTIONE UTENTI ===

// GET /api/admin/users - Lista tutti gli utenti
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'cognome', 'email', 'role', 'is_online', 'current_location', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      users: users.map(user => ({
        id: user.id,
        name: `${user.nome} ${user.cognome}`,
        email: user.email,
        role: user.role,
        isOnline: user.is_online,
        currentLocation: user.current_location,
        createdAt: user.created_at,
        lastSeen: user.updated_at
      })),
      total: users.length
    });
  } catch (error) {
    console.error('Errore nel recupero utenti:', error);
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
};

// POST /api/admin/users/:id/kick - Kick utente
const kickUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Imposta offline
    user.is_online = false;
    await user.save();

    // Log dell'azione
    await logSystemAction('user_kick', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      targetUserId: user.id,
      targetUserName: `${user.nome} ${user.cognome}`,
      reason: reason || 'Nessun motivo specificato'
    });

    console.log(`Admin ${req.user.nome} ha kickato ${user.nome} ${user.cognome}${reason ? ` - Motivo: ${reason}` : ''}`);

    res.json({ message: `Utente ${user.nome} ${user.cognome} kickato con successo` });
  } catch (error) {
    console.error('Errore nel kick utente:', error);
    res.status(500).json({ message: 'Errore nel kick dell\'utente' });
  }
};

// POST /api/admin/users/:id/ban - Ban utente
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, duration } = req.body; // duration in ore

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Non puoi bannare un altro admin' });
    }

    // Carica lista ban
    let bannedUsers = [];
    try {
      await ensureDataDirectory();
      const data = await fs.readFile(BAN_FILE, 'utf8');
      bannedUsers = JSON.parse(data);
    } catch {
      bannedUsers = [];
    }

    // Calcola scadenza ban
    const banUntil = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;

    // Aggiungi/aggiorna ban
    const banIndex = bannedUsers.findIndex(ban => ban.userId === user.id);
    const banData = {
      userId: user.id,
      userEmail: user.email,
      userName: `${user.nome} ${user.cognome}`,
      bannedBy: req.user.id,
      bannedByName: `${req.user.nome} ${req.user.cognome}`,
      reason: reason || 'Nessun motivo specificato',
      bannedAt: new Date().toISOString(),
      banUntil: banUntil ? banUntil.toISOString() : null,
      permanent: !duration
    };

    if (banIndex >= 0) {
      bannedUsers[banIndex] = banData;
    } else {
      bannedUsers.push(banData);
    }

    await fs.writeFile(BAN_FILE, JSON.stringify(bannedUsers, null, 2));

    // Imposta offline
    user.is_online = false;
    await user.save();

    // Log dell'azione
    await logSystemAction('user_ban', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      targetUserId: user.id,
      targetUserName: `${user.nome} ${user.cognome}`,
      reason,
      duration: duration || 'permanente',
      banUntil: banUntil ? banUntil.toISOString() : null
    });

    console.log(`Admin ${req.user.nome} ha bannato ${user.nome} ${user.cognome}${duration ? ` per ${duration} ore` : ' permanentemente'}`);

    res.json({ 
      message: `Utente ${user.nome} ${user.cognome} bannato ${duration ? `per ${duration} ore` : 'permanentemente'}`,
      banUntil 
    });
  } catch (error) {
    console.error('Errore nel ban utente:', error);
    res.status(500).json({ message: 'Errore nel ban dell\'utente' });
  }
};

// GET /api/admin/banned - Lista utenti bannati
const getBannedUsers = async (req, res) => {
  try {
    await ensureDataDirectory();
    let bannedUsers = [];
    
    try {
      const data = await fs.readFile(BAN_FILE, 'utf8');
      bannedUsers = JSON.parse(data);
    } catch {
      bannedUsers = [];
    }

    // Filtra ban scaduti
    const now = new Date();
    const activeBans = bannedUsers.filter(ban => {
      if (ban.permanent) return true;
      return ban.banUntil && new Date(ban.banUntil) > now;
    });

    // Salva lista aggiornata se ci sono stati cambiamenti
    if (activeBans.length !== bannedUsers.length) {
      await fs.writeFile(BAN_FILE, JSON.stringify(activeBans, null, 2));
    }

    res.json({ bannedUsers: activeBans });
  } catch (error) {
    console.error('Errore nel recupero ban:', error);
    res.status(500).json({ message: 'Errore nel recupero della lista ban' });
  }
};

// DELETE /api/admin/banned/:userId - Rimuovi ban
const removeBan = async (req, res) => {
  try {
    const { userId } = req.params;

    await ensureDataDirectory();
    let bannedUsers = [];
    
    try {
      const data = await fs.readFile(BAN_FILE, 'utf8');
      bannedUsers = JSON.parse(data);
    } catch {
      return res.status(404).json({ message: 'Utente non trovato nella lista ban' });
    }

    const banIndex = bannedUsers.findIndex(ban => ban.userId == userId);
    if (banIndex === -1) {
      return res.status(404).json({ message: 'Utente non trovato nella lista ban' });
    }

    const unbannedUser = bannedUsers[banIndex];
    bannedUsers.splice(banIndex, 1);

    await fs.writeFile(BAN_FILE, JSON.stringify(bannedUsers, null, 2));

    // Log dell'azione
    await logSystemAction('user_unban', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      targetUserId: unbannedUser.userId,
      targetUserName: unbannedUser.userName
    });

    console.log(`Admin ${req.user.nome} ha rimosso il ban di ${unbannedUser.userName}`);

    res.json({ message: `Ban rimosso per ${unbannedUser.userName}` });
  } catch (error) {
    console.error('Errore nella rimozione ban:', error);
    res.status(500).json({ message: 'Errore nella rimozione del ban' });
  }
};

// === GESTIONE PERSONAGGI ===

// GET /api/admin/characters - Lista tutti i personaggi
const getAllCharacters = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'cognome', 'email', 'sesso', 'razza', 'caratteristiche', 'is_online', 'current_location'],
      order: [['nome', 'ASC']]
    });

    res.json({
      characters: users.map(user => ({
        id: user.id,
        name: `${user.nome} ${user.cognome}`,
        email: user.email,
        gender: user.sesso,
        race: user.razza,
        attributes: user.caratteristiche || {},
        isOnline: user.is_online,
        currentLocation: user.current_location
      }))
    });
  } catch (error) {
    console.error('Errore nel recupero personaggi:', error);
    res.status(500).json({ message: 'Errore nel recupero dei personaggi' });
  }
};

// PUT /api/admin/characters/:id - Modifica personaggio
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cognome, sesso, razza, caratteristiche } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Personaggio non trovato' });
    }

    const oldData = {
      nome: user.nome,
      cognome: user.cognome,
      sesso: user.sesso,
      razza: user.razza,
      caratteristiche: user.caratteristiche
    };

    // Aggiorna dati
    if (nome) user.nome = nome;
    if (cognome) user.cognome = cognome;
    if (sesso) user.sesso = sesso;
    if (razza) user.razza = razza;
    if (caratteristiche) user.caratteristiche = caratteristiche;

    await user.save();

    // Log dell'azione
    await logSystemAction('character_edit', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      targetUserId: user.id,
      targetUserName: `${user.nome} ${user.cognome}`,
      oldData,
      newData: {
        nome: user.nome,
        cognome: user.cognome,
        sesso: user.sesso,
        razza: user.razza,
        caratteristiche: user.caratteristiche
      }
    });

    console.log(`Admin ${req.user.nome} ha modificato il personaggio di ${user.nome} ${user.cognome}`);

    res.json({ message: 'Personaggio aggiornato con successo', character: user });
  } catch (error) {
    console.error('Errore nella modifica personaggio:', error);
    res.status(500).json({ message: 'Errore nella modifica del personaggio' });
  }
};

// === SISTEMA DI LOG ===

// Funzione per loggare azioni di sistema
const logSystemAction = async (action, data) => {
  try {
    await ensureDataDirectory();
    
    let logs = [];
    try {
      const logData = await fs.readFile(LOGS_FILE, 'utf8');
      logs = JSON.parse(logData);
    } catch {
      logs = [];
    }

    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      data,
      ip: data.ip || 'unknown'
    };

    logs.unshift(logEntry); // Aggiungi all'inizio

    // Mantieni solo gli ultimi 1000 log
    if (logs.length > 1000) {
      logs = logs.slice(0, 1000);
    }

    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Errore nel logging:', error);
  }
};

// GET /api/admin/logs - Recupera log di sistema
const getSystemLogs = async (req, res) => {
  try {
    const { limit = 50, action } = req.query;

    await ensureDataDirectory();
    let logs = [];
    
    try {
      const logData = await fs.readFile(LOGS_FILE, 'utf8');
      logs = JSON.parse(logData);
    } catch {
      logs = [];
    }

    // Filtra per azione se specificata
    if (action) {
      logs = logs.filter(log => log.action === action);
    }

    // Limita risultati
    logs = logs.slice(0, parseInt(limit));

    res.json({ logs, total: logs.length });
  } catch (error) {
    console.error('Errore nel recupero log:', error);
    res.status(500).json({ message: 'Errore nel recupero dei log' });
  }
};

// === GESTIONE ANNUNCI ===

// GET /api/admin/announcements - Recupera annunci
const getAnnouncements = async (req, res) => {
  try {
    await ensureDataDirectory();
    let announcements = [];
    
    try {
      const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8');
      announcements = JSON.parse(data);
    } catch {
      announcements = [];
    }

    // Filtra annunci scaduti
    const now = new Date();
    const activeAnnouncements = announcements.filter(ann => {
      return !ann.expiresAt || new Date(ann.expiresAt) > now;
    });

    res.json({ announcements: activeAnnouncements });
  } catch (error) {
    console.error('Errore nel recupero annunci:', error);
    res.status(500).json({ message: 'Errore nel recupero degli annunci' });
  }
};

// POST /api/admin/announcements - Crea annuncio
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type = 'info', expiresIn } = req.body; // expiresIn in ore

    if (!title || !message) {
      return res.status(400).json({ message: 'Titolo e messaggio richiesti' });
    }

    await ensureDataDirectory();
    let announcements = [];
    
    try {
      const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8');
      announcements = JSON.parse(data);
    } catch {
      announcements = [];
    }

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 60 * 60 * 1000) : null;

    const announcement = {
      id: Date.now(),
      title,
      message,
      type, // info, warning, maintenance, emergency
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      createdBy: `${req.user.nome} ${req.user.cognome}`,
      active: true
    };

    announcements.unshift(announcement);
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2));

    // Log dell'azione
    await logSystemAction('announcement_create', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      announcementId: announcement.id,
      title,
      type
    });

    console.log(`Admin ${req.user.nome} ha creato un annuncio: ${title}`);

    res.status(201).json({ message: 'Annuncio creato con successo', announcement });
  } catch (error) {
    console.error('Errore nella creazione annuncio:', error);
    res.status(500).json({ message: 'Errore nella creazione dell\'annuncio' });
  }
};

// DELETE /api/admin/announcements/:id - Elimina annuncio
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await ensureDataDirectory();
    let announcements = [];
    
    try {
      const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8');
      announcements = JSON.parse(data);
    } catch {
      return res.status(404).json({ message: 'Annuncio non trovato' });
    }

    const annIndex = announcements.findIndex(ann => ann.id == id);
    if (annIndex === -1) {
      return res.status(404).json({ message: 'Annuncio non trovato' });
    }

    const deletedAnnouncement = announcements[annIndex];
    announcements.splice(annIndex, 1);

    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(announcements, null, 2));

    // Log dell'azione
    await logSystemAction('announcement_delete', {
      adminId: req.user.id,
      adminName: `${req.user.nome} ${req.user.cognome}`,
      announcementId: deletedAnnouncement.id,
      title: deletedAnnouncement.title
    });

    console.log(`Admin ${req.user.nome} ha eliminato l'annuncio: ${deletedAnnouncement.title}`);

    res.json({ message: 'Annuncio eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione annuncio:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'annuncio' });
  }
};

// === STATISTICHE DI SISTEMA ===

// GET /api/admin/stats - Statistiche generali
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const onlineUsers = await User.count({ where: { is_online: true } });
    const adminUsers = await User.count({ where: { role: 'admin' } });
    
    // Statistiche ban
    let bannedCount = 0;
    try {
      await ensureDataDirectory();
      const banData = await fs.readFile(BAN_FILE, 'utf8');
      const bannedUsers = JSON.parse(banData);
      const now = new Date();
      bannedCount = bannedUsers.filter(ban => {
        if (ban.permanent) return true;
        return ban.banUntil && new Date(ban.banUntil) > now;
      }).length;
    } catch {
      bannedCount = 0;
    }

    // Statistiche annunci
    let activeAnnouncements = 0;
    try {
      const annData = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8');
      const announcements = JSON.parse(annData);
      const now = new Date();
      activeAnnouncements = announcements.filter(ann => {
        return !ann.expiresAt || new Date(ann.expiresAt) > now;
      }).length;
    } catch {
      activeAnnouncements = 0;
    }

    res.json({
      users: {
        total: totalUsers,
        online: onlineUsers,
        admins: adminUsers,
        banned: bannedCount
      },
      system: {
        uptime: process.uptime(),
        announcements: activeAnnouncements,
        version: '2.1.0'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore nel recupero statistiche:', error);
    res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
  }
};

module.exports = {
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
  getSystemStats,
  logSystemAction
};