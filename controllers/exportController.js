const Product = require('../models/Product');
const Order = require('../models/order');
const OrderItem = require('../models/OrderItem');
const AdminLoginLog = require('../models/AdminLoginLog');

// Importa funciones de Sequelize para consultas agregadas
const { fn, col } = require('sequelize');
const { Sequelize } = require('sequelize');

// Utilidad que genera archivos Excel
const { exportExcel } = require('../utils/excel');


/**
 * Exporta el TOP de productos más vendidos a Excel
 */
exports.exportProductosExcel = async (req, res) => {
  try {

    // Obtiene los productos más vendidos con cantidad e ingresos
    const productosMasVendidos = await OrderItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('cantidad')), 'totalVendido'],
        [fn('SUM', Sequelize.literal('cantidad * precio_unitario')), 'ingresoTotal']
      ],
      include: [{
        model: Product,
        attributes: ['id', 'nombre'],
        required: true
      }],
      group: ['product_id', 'Product.id'],
      order: [[fn('SUM', col('cantidad')), 'DESC']],
      limit: 10,
      subQuery: false,
      raw: false
    });

    // Formatea los datos para el Excel
    const rows = productosMasVendidos.map((item, idx) => ({
      Ranking: idx + 1,
      ProductId: item.Product.id,
      Nombre: item.Product.nombre,
      UnidadesVendidas: item.dataValues.totalVendido,
      IngresoTotal: parseFloat(item.dataValues.ingresoTotal)
    }));

    // Genera y descarga el Excel
    return exportExcel(res, rows, 'Productos', 'productos.xlsx');

  } catch (err) {
    console.error('Error exportando productos a Excel:', err);
    return res.status(500).send('Error al generar Excel');
  }
};


/**
 * Exporta las ventas más importantes a Excel
 */
exports.exportVentasExcel = async (req, res) => {
  try {

    // Obtiene las ventas con mayor total
    const ventasMasCaras = await Order.findAll({
      attributes: ['id', 'fecha', 'total'],
      order: [['total', 'DESC']],
      limit: 10,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['nombre']
        }]
      }]
    });

    // Formatea datos para Excel
    const rows = ventasMasCaras.map(v => ({
      VentaId: v.id,
      Fecha: v.fecha,
      Total: parseFloat(v.total),
      CantidadItems: v.items ? v.items.length : 0,

      // Convierte los items en texto legible dentro de una celda
      Detalles: v.items && v.items.length > 0
        ? v.items.map(i =>
            `${i.cantidad}x ${i.Product ? i.Product.nombre : 'Producto'} @$${i.precio_unitario}`
          ).join(' | ')
        : ''
    }));

    // Genera archivo Excel
    return exportExcel(res, rows, 'Ventas', 'ventas.xlsx');

  } catch (err) {
    console.error('Error exportando ventas a Excel:', err);
    return res.status(500).send('Error al generar Excel');
  }
};


/**
 * Exporta los logs de inicio de sesión de administradores
 */
exports.exportAdminLogsExcel = async (req, res) => {
  try {

    // Obtiene los últimos accesos de admin
    const adminLogs = await AdminLoginLog.findAll({
      order: [['fecha', 'DESC']],
      limit: 10
    });

    // Formatea datos para Excel
    const rows = adminLogs.map(log => ({
      Id: log.id,
      AdminId: log.adminId,
      Fecha: log.fecha,
      Accion: log.accion
    }));

    // Genera archivo Excel
    return exportExcel(res, rows, 'Logs', 'logs_admin.xlsx');

  } catch (err) {
    console.error('Error exportando logs a Excel:', err);
    return res.status(500).send('Error al generar Excel');
  }
};