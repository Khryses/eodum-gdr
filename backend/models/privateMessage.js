
module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('PrivateMessage', {
    sender_id: DataTypes.INTEGER,
    recipient_id: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    read: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return PrivateMessage;
};
