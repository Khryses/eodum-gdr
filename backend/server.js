require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const presenzeRoutes = require('./routes/presenzeRoutes');
const playerRoutes = require('./routes/playerRoutes');
const systemRoutes = require('./routes/systemRoutes'); // Aggiungi questa linea
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/presenze', presenzeRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/system', systemRoutes); // Aggiungi questa linea

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
    } else {
      console.log('ℹ️ Utente admin già esistente');
    }
  } catch (err) {
    console.error("Errore nella creazione dell'utente admin:", err);
  }
});