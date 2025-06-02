module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cognome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sesso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    razza: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caratteristiche: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    }
  });
};