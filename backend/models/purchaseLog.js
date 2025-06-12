
module.exports = (sequelize, DataTypes) => {
  const PurchaseLog = sequelize.define('PurchaseLog', {
    user_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    purchased_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return PurchaseLog;
};
