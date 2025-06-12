
module.exports = (sequelize, DataTypes) => {
  const NoticeBoardLog = sequelize.define('NoticeBoardLog', {
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return NoticeBoardLog;
};
