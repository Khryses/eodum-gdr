
module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define('Market', {
    item_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    listed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return Market;
};
