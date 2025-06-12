
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Importazione modelli con sequelize + DataTypes
const User = require('./user')(sequelize, DataTypes);
const Role = require('./role')(sequelize, DataTypes);
const ChatLog = require('./chatLog')(sequelize, DataTypes);
const PrivateMessage = require('./privateMessage')(sequelize, DataTypes);
const NoticeBoardLog = require('./noticeBoardLog')(sequelize, DataTypes);
const PurchaseLog = require('./purchaseLog')(sequelize, DataTypes);
const StaffLog = require('./staffLog')(sequelize, DataTypes);
const Item = require('./item')(sequelize, DataTypes);
const Market = require('./market')(sequelize, DataTypes);
const Map = require('./map')(sequelize, DataTypes);

// Associazioni
User.hasMany(ChatLog, { foreignKey: 'user_id' });
ChatLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PrivateMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(PrivateMessage, { foreignKey: 'recipient_id', as: 'receivedMessages' });

User.hasMany(NoticeBoardLog, { foreignKey: 'user_id' });
User.hasMany(PurchaseLog, { foreignKey: 'user_id' });

Item.hasMany(Market, { foreignKey: 'item_id' });
User.hasMany(Market, { foreignKey: 'owner_id' });

User.hasMany(StaffLog, { foreignKey: 'staff_id' });
User.hasMany(StaffLog, { foreignKey: 'target_id', as: 'targetedActions' });

Map.hasMany(ChatLog, { foreignKey: 'location' });

// Export
module.exports = {
  sequelize,
  Sequelize,
  User,
  Role,
  ChatLog,
  PrivateMessage,
  NoticeBoardLog,
  PurchaseLog,
  StaffLog,
  Item,
  Market,
  Map
};
