module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    nome: DataTypes.STRING,
    cognome: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    sesso: DataTypes.STRING,
    razza: DataTypes.STRING,
    caratteristiche: DataTypes.JSONB
  });
};
