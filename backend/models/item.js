
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    is_unique: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return Item;
};
