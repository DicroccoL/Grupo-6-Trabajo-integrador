const Product = require('../models/Product');
const Order = require('../models/order');
const OrderItem = require('../models/OrderItem'); 
const sequelize = require('../config/db');

// Crea una orden de compra (checkout del carrito)
exports.createOrder = async (req, res) => {

  // Inicia una transacción (todo o nada en la base de datos)
  const t = await sequelize.transaction(); 

  try {
    const { carrito } = req.body;

    // Valida que el carrito tenga productos
    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: 'Datos de la orden incompletos.' });
    }

    let total = 0;
    const itemsParaGuardar = [];

    // Recorre cada producto del carrito
    for (const artículo of carrito) {

      // Busca el producto en la base de datos
      const producto = await Product.findByPk(artículo.id, { transaction: t });
      
      // Valida existencia y estado activo
      if (!producto || !producto.activo) {
        throw new Error(`El producto con ID ${artículo.id} no existe o no está activo.`);
      }

      // Valida stock disponible
      if (producto.stock < artículo.cantidad) {
        throw new Error(`Stock insuficiente para: ${producto.nombre}. Disponible: ${producto.stock}`);
      }

      // Descuenta stock
      producto.stock -= artículo.cantidad;
      await producto.save({ transaction: t });

      // Acumula total de la compra
      total += producto.precio * artículo.cantidad;

      // Guarda datos para crear los items de la orden
      itemsParaGuardar.push({
        producto,
        cantidad: artículo.cantidad
      });
    }

    // Crea la orden principal
    const nuevaOrden = await Order.create({
      user_id: null, 
      total
    }, { transaction: t });

    // Crea los items de la orden (detalle de compra)
    for (const artículo of itemsParaGuardar) {
      await OrderItem.create({
        order_id: nuevaOrden.id,
        product_id: artículo.producto.id,
        cantidad: artículo.cantidad,
        precio_unitario: artículo.producto.precio
      }, { transaction: t });
    }

    // Confirma todo si salió bien
    await t.commit(); 

    res.status(201).json({ 
      mensaje: 'Compra realizada con éxito', 
      orderId: nuevaOrden.id, 
      total, 
      fecha: nuevaOrden.fecha 
    });

  } catch (error) {

    // Si algo falla, deshace todos los cambios
    await t.rollback(); 

    res.status(400).json({ error: error.message });
  }
};