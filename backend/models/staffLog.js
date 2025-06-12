
module.exports = (sequelize, DataTypes) => {
  const StaffLog = sequelize.define('StaffLog', {
    staff_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    target_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return StaffLog;
};
