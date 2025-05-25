
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const db = require('./models');

db.sequelize.sync().then(() => {
  console.log('Database sincronizzato con successo.');
}).catch((err) => {
  console.error('Errore nella sincronizzazione del database:', err);
});
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
