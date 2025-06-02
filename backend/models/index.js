const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false // Opzionale: disabilita i log SQL
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./user')(sequelize, DataTypes);

module.exports = db;

// Seeder automatico per utente admin
const bcrypt = require('bcrypt');
(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    
    const existing = await db.User.findOne({ where: { email: 'admin@eodum.it' } });
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await db.User.create({
        nome: 'Admin',
        cognome: 'Sistema',
        email: 'admin@eodum.it',
        password: hashed,
        sesso: 'altro',
        razza: 'admin',
        role: 'admin'
      });
      console.log('✅ Utente admin creato: admin@eodum.it / admin123');
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'utente admin:', error);
  }
})();