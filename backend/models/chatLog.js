
module.exports = (sequelize, DataTypes) => {
  const ChatLog = sequelize.define('ChatLog', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Maps',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return ChatLog;
};
