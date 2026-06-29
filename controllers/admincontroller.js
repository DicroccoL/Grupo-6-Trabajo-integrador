/**
 * Controlador de administración
 * 
 * Contiene la lógica de negocio para el panel de administración:
 * - Mostrar panel de admin
 * - Agregar nuevos productos
 * - Editar productos existentes
 * - Eliminar productos (baja lógica)
 * - Mostrar formulario de agregar/editar productos
 */

const Product = require('../models/Product');
const Order = require('../models/order');
const OrderItem = require('../models/OrderItem');
const { Op, fn, col, sequelize } = require('sequelize');
const { Sequelize } = require("sequelize");
// 
exports.mostrarPanelAdmin = async (req, res) => {
  try {
    // Obtener todos los productos de la base de datos
    const productos = await Product.findAll();

    // Obtener las últimas 10 ventas ordenadas por fecha descendente
    // Se incluyen los detalles (items) y la información del producto de cada item
    const ultimasVentas = await Order.findAll({
      limit: 10,
      order: [['fecha', 'DESC']],
      include: [{
        model: OrderItem,
        as: 'items',
        include: [Product]
      }]
    });

    const mensajeExito = req.query.success ? decodeURIComponent(req.query.success) : null;
    const mensajeError = req.query.error ? decodeURIComponent(req.query.error) : null;

    // Renderizar la vista de admin con los datos obtenidos
    res.render("admin", { productos: productos, ventas: ultimasVentas, mensajeExito, mensajeError });
  } catch (error) {
    console.error('Error en mostrarPanelAdmin:', error);
    res.status(500).send("Error al cargar el panel de administración");
  }
};

//muestra agregar carrito ejs 
exports.mostrarFormularioAgregarProducto = (req, res) => {
  res.render("agregar_carrito");
};

//Logica cuando un administrador envia el formulario para agregar un producto
exports.agregarProducto = async (req, res) => {
  // Extraer los datos del formulario
  const { nombre, precio, descripcion, stock, categoria } = req.body;

  // Si se subió una imagen, usar ese nombre; si no, usar una por defecto
  const nombreImagen = req.file ? req.file.filename : "default.png";

  try {
    // Crear el nuevo producto en la base de datos
    await Product.create({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      stock: stock,
      imagen_url: nombreImagen,
      categoria: categoria || "General"
    });

    // Redirigir al panel de admin para ver el nuevo producto
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al guardar el producto en la base de datos");
  }
};


exports.mostrarFormularioEditarProducto = async (req, res) => {
  try {
    // Buscar el producto por su ID (Primary Key)
    const producto = await Product.findByPk(req.params.id);

    // Si no existe el producto, devolver error 404
    if (!producto) return res.status(404).send("Producto no encontrado");

    // Renderizar la vista de formulario con modo edición activado
    res.render("agregar_carrito", {
      producto: producto,
      esEdicion: true
    });
  } catch (error) {
    res.status(500).send("Error al obtener los datos del producto");
  }
};

exports.editarProducto = async (req, res) => {
  try {
    // Buscar el producto por su ID
    const producto = await Product.findByPk(req.params.id);

    // Si no existe, devolver error 404
    if (!producto) return res.status(404).send("Producto no encontrado");

    // Obtener los datos del formulario
    const { nombre, precio, stock, descripcion, categoria } = req.body;

    // Si se subió una nueva imagen, usarla; si no, mantener la anterior
    const urlImagen = req.file ? req.file.filename : producto.imagen_url;

    // Actualizar el producto con los nuevos datos
    await producto.update({
      nombre,
      precio,
      stock,
      descripcion,
      categoria,
      imagen_url: urlImagen
    });

    // Redirigir al panel de admin para ver los cambios
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
  }
};


exports.eliminarProducto = async (req, res) => {
  const { id } = req.body;

  try {
    // Marcar el producto como inactivo (baja lógica)
    // Esto evita que aparezca en el catálogo pero mantiene el historial de ventas
    await Product.update(
      { activo: false },
      { where: { id: id } }
    );

    // Redirigir al panel de admin
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al eliminar el producto");
  }
};
exports.mostrarReportes = async (req, res) => {
  try {
    const productosMasVendidos = await OrderItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('cantidad')), 'totalVendido'],
        [fn('SUM', Sequelize.literal('cantidad * precio_unitario')), 'ingresoTotal']
      ],
      include: [{
        model: Product,
        attributes: ['id', 'nombre', 'precio', 'imagen_url'],
        required: true
      }],
      group: ['product_id', 'Product.id'],
      order: [[fn('SUM', col('cantidad')), 'DESC']],
      limit: 10,
      subQuery: false,
      raw: false
    });

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
    return res.render("admin-reportes", { 
      productosMasVendidos: productosMasVendidos,
      ventasMasCaras: ventasMasCaras
    });

  } catch (error) {
    console.error('Error en mostrarReportes:', error);
    return res.status(500).send("Error al cargar los reportes");
  }
};