const { Sequelize, DataTypes } = require('sequelize');

// Collegamento ibrido
let sequelize;

if (process.env.DATABASE_URL) {
  // Render
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Locale
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importa modelli
db.User = require('./user')(sequelize, DataTypes);
// db.Presenza = require('./presenza')(sequelize, DataTypes); // aggiungi se esiste
// db.Mappa = require('./mappa')(sequelize, DataTypes);       // aggiungi se esiste

module.exports = db;
