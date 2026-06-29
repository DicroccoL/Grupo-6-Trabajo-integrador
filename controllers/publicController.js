/**
 * Controlador de rutas públicas
 * 
 * Contiene la lógica de negocio para las rutas accesibles por cualquier usuario:
 * - Página de inicio (/inicio) - Catálogo de productos
 * - Página de índice (/)
 * - Página de carrito (/carrito)
 * - Página de ticket (/ticket)
 */

const Product = require("../models/Product");

// RENDERIZA EL INDEX

exports.mostrarIndice = (req, res) => {
  res.render("index");
};

// RENDERIZA EL CATALOGO CON PRODUCTOS TRUE
exports.mostrarInicio = async (req, res) => {
  try {
    // Obtener únicamente los productos activos de la base de datos
    const productos = await Product.findAll({
      where: { activo: true }
    });

    // Renderizar la vista de inicio con los productos obtenidos
    res.render("inicio", { productos: productos });
  } catch (error) {
    // Si hay error al cargar los productos, enviar error 500
    res.status(500).send("Error al cargar los productos");
  }
};


//RENDERIZA CARRITO
exports.mostrarCarrito = (req, res) => {
  res.render("carrito");
};

//Renderiza la página de ticket
exports.mostrarTicket = (req, res) => {
  res.render("ticket", { isPdf: false });
};

//Renderiza la página de detalle de un producto específico
exports.mostrarDetalleProducto = async (req, res) => {
  try {
    // Obtener el ID del producto desde los parámetros de la URL
    const idProducto = req.params.id;

    // Buscar el producto en la base de datos por su ID
    const producto = await Product.findByPk(idProducto);

    // Si no existe el producto, devolver error 404
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    // Renderizar la vista de detalle con los datos del producto
    res.render("producto-detalle", { producto: producto });
  } catch (error) {
    console.error("Error al obtener el detalle del producto:", error);
    res.status(500).send("Error al cargar los detalles del producto");
  }
};
