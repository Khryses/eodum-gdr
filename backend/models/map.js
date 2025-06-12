
module.exports = (sequelize, DataTypes) => {
  const Map = sequelize.define('Map', {
    name: DataTypes.STRING,
    district: DataTypes.STRING,
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  return Map;
};
