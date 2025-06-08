require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const presenzeRoutes = require('./routes/presenzeRoutes');
const playerRoutes = require('./routes/playerRoutes');
const systemRoutes = require('./routes/systemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mapRoutes = require('./routes/mapRoutes');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/presenze', presenzeRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maps', mapRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Server Eodum attivo su http://localhost:${PORT}`);

  try {
    await db.sequelize.sync();

    const [admin, created] = await db.User.findOrCreate({
      where: { email: 'admin@eodum.it' },
      defaults: {
        nome: 'Admin',
        cognome: 'Sistema',
        password: await bcrypt.hash('admin123', 10),
        sesso: 'Nonbinary',
        razza: 'Umano',
        caratteristiche: {},
        role: 'admin',
        is_online: true,
        current_location: 'Piazza Centrale',
      },
    });

    if (created) {
      console.log('✅ Utente admin creato');
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log('🔄 Utente admin aggiornato a ruolo admin');
    } else {
      console.log('ℹ️ Utente admin già esistente');
    }

    console.log('📊 API Admin disponibili:');
    console.log('  - GET  /api/admin/users - Gestione utenti');
    console.log('  - POST /api/admin/users/:id/kick - Kick utenti');
    console.log('  - POST /api/admin/users/:id/ban - Ban utenti');
    console.log('  - GET  /api/admin/characters - Gestione personaggi');
    console.log('  - GET  /api/admin/logs - Log di sistema');
    console.log('  - GET  /api/admin/stats - Statistiche');
    console.log('  - GET  /api/maps - Gestione mappe');
  } catch (err) {
    console.error("Errore nella creazione dell'utente admin:", err);
  }
});