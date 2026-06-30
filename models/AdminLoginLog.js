const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdminLoginLog = sequelize.define('AdminLoginLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  adminId: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  accion: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'admin_login_logs',
  timestamps: false
});

module.exports = AdminLoginLog;
