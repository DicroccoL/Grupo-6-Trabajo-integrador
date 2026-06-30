const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const exportController = require("../controllers/exportController");
const authController = require("../controllers/authController");
const upload = require("../middleware/upload"); // Asegúrate de que la ruta a multer sea correcta

// 1. IMPORTACIÓN SEGURA: Extraemos la función estandarizada usando llaves
const { requireSession } = require("../middleware/auth");

// RUTA PRINCIPAL DEL DASHBOARD
router.get("/admin", requireSession, adminController.mostrarPanelAdmin);

// RUTA PARA VER REPORTES
router.get("/admin/reportes", requireSession, adminController.mostrarReportes);

// RUTAS DE EXPORTACIÓN A EXCEL (Protegidas)
router.get('/admin/export/ventas', requireSession, exportController.exportVentasExcel);
router.get('/admin/export/productos', requireSession, exportController.exportProductosExcel);
router.get('/admin/export/logs', requireSession, exportController.exportAdminLogsExcel);


// --- CONTROL DE PRODUCTOS (PROTEGIDOS CON REQUERIMIENTO DE SESIÓN) ---

// Muestra el formulario para agregar un producto nuevo.
router.get(
  "/admin/agregar-producto",
  requireSession,
  adminController.mostrarFormularioAgregarProducto
);

router.post("/admin/crear-admin", requireSession, authController.registerAdmin);
router.post("/api/register-admin", authController.registerAdmin);

// Guarda un producto nuevo y recibe una imagen con multer
router.post(
  "/admin/agregar-producto",
  requireSession,
  upload.single("imagen"),
  adminController.agregarProducto
);

// Muestra el formulario para editar un producto. El :id indica qué producto se quiere modificar.
router.get(
  "/admin/editar-producto/:id",
  requireSession,
  adminController.mostrarFormularioEditarProducto
);

/**
 * Guarda los cambios realizados a un producto.
 * Si se sube una nueva imagen, también la actualiza.
 */
router.post(
  "/admin/editar-producto/:id",
  requireSession,
  upload.single("imagen"),
  adminController.editarProducto
);

/**
 * Elimina un producto de forma lógica.
 * No se borra de la base de datos, solo se marca como inactivo.
 */
router.post(
  "/admin/eliminar-producto",
  requireSession,
  adminController.eliminarProducto
);

module.exports = router;