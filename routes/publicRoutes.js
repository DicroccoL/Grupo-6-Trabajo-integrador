//rutas publicas

const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

/**
 * Ruta para mostrar la página principal (índice)
 * 
 * GET /
 * 
 * Renderiza la vista de índice sin parámetros.
 */
router.get("/", publicController.mostrarIndice);

/**
 * Ruta para mostrar el catálogo de inicio
 * 
 * GET /inicio
 * 
 * Obtiene todos los productos activos de la base de datos y los muestra
 * en la vista de catálogo.
 */
router.get("/inicio", publicController.mostrarInicio);

/**
 * Ruta para mostrar el carrito de compras
 * 
 * GET /carrito
 * 
 * Renderiza la vista vacía del carrito. El contenido se llena con JavaScript
 * del lado del cliente (/js/carrito.js).
 */
router.get("/carrito", publicController.mostrarCarrito);

/**
 * Ruta para mostrar la página de ticket
 * 
 * GET /ticket
 * 
 * Renderiza la vista del ticket con isPdf: false para mostrar una versión
 * en HTML (no en PDF). Esta vista se usa después de realizar una compra.
 */
router.get("/ticket", publicController.mostrarTicket);

module.exports = router;
