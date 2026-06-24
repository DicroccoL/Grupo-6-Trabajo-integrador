const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  imagen_url: { type: DataTypes.STRING, allowNull: true },
  categoria: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'products', 
  timestamps: false     
});

module.exports = Product;