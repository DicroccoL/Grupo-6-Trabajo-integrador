const Product = require('../models/Product');
const Order = require('../models/order');
const OrderItem = require('../models/OrderItem'); 
const sequelize = require('../config/db');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const { carrito } = req.body;

    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: 'Datos de la orden incompletos.' });
    }

    let total = 0;
    const itemsParaGuardar = [];

    for (const artículo of carrito) {
      const producto = await Product.findByPk(artículo.id, { transaction: t });
      
      if (!producto || !producto.activo) {
        throw new Error(`El producto con ID ${artículo.id} no existe o no está activo.`);
      }
      if (producto.stock < artículo.cantidad) {
        throw new Error(`Stock insuficiente para: ${producto.nombre}. Disponible: ${producto.stock}`);
      }

      producto.stock -= artículo.cantidad;
      await producto.save({ transaction: t });

      total += producto.precio * artículo.cantidad;
      itemsParaGuardar.push({
        producto,
        cantidad: artículo.cantidad
      });
    }

    const nuevaOrden = await Order.create({
      user_id: null, 
      total
    }, { transaction: t });

    for (const artículo of itemsParaGuardar) {
      await OrderItem.create({
        order_id: nuevaOrden.id,
        product_id: artículo.producto.id,
        cantidad: artículo.cantidad,
        precio_unitario: artículo.producto.precio
      }, { transaction: t });
    }

    await t.commit(); 
    res.status(201).json({ mensaje: 'Compra realizada con éxito', orderId: nuevaOrden.id, total, fecha: nuevaOrden.fecha });

  } catch (error) {
    await t.rollback(); 
    res.status(400).json({ error: error.message });
  }
};