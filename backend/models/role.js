
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Più alto è il numero, maggiore è il privilegio (Gestore=5, Admin=4...)"
    }
  });

  return Role;
};
