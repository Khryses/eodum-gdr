
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
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
  const existing = await db.User.findOne({ where: { email: 'admin@eodum.it' } });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await db.User.create({
      name: 'Admin',
      email: 'admin@eodum.it',
      password: hashed,
      role: 'admin'
    });
    console.log('✅ Utente admin creato: admin@eodum.it / admin123');
  }
})();
