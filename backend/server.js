require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const systemRoutes = require('./routes/system');
const db = require('./models');

// 🔧 La sincronizzazione del database è gestita in models/index.js

app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);

// Route di test
app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto nel server Eodum!' });
});

// Gestione errori 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trovata' });
});

// Gestione errori generali
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Eodum attivo su http://localhost:${PORT}`);
});
