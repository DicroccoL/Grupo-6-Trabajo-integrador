/**
 * - Cargar variables de entorno
 * - Inicializar Express
 * - Configurar middlewares generales (incluyendo Express Sessions)
 * - Configurar archivos estáticos
 * - Importar y registrar rutas
 * - Definir relaciones entre modelos (Sequelize)
 * - Iniciar el servidor
 */

// Cargar variables de entorno desde .env para evitar exponer información sensible
require("dotenv").config();

// IMPORTAR DEPENDENCIAS
const express = require("express");
const path = require("path");
const session = require("express-session"); //  1. IMPORTAMOS EXPRESS-SESSION

// Importar configuración de base de datos y modelos de las tablas
const sequelize = require("./config/db");
const Admin = require("./models/Admin");
const Product = require("./models/Product");
const Order = require("./models/order");
const OrderItem = require("./models/OrderItem");
const AdminLoginLog = require("./models/AdminLoginLog");

// Importar rutas modulares
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const apiRoutes = require("./routes/api");

// inicializa express
const app = express();

// Definir relaciones entre modelos (Sequelize)
// Una orden puede tener muchos detalles (items)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

// Cada detalle pertenece a una orden
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Cada detalle pertenece a un producto
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Un producto puede tener muchos detalles (venderse en múltiples órdenes)
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

// config motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MIDDLEWARES GENERALES

// 2. CONFIGURAMOS EL MIDDLEWARE DE SESIÓN (Crucial antes de procesar cualquier ruta)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,             // Evita guardar la sesión si no hubo cambios
  saveUninitialized: false,  // No guarda sesiones vacías 
  cookie: {
    secure: false,           // Usar false ya que estás en entorno local sin HTTPS
    maxAge: 1000 * 60 * 10
  }
}));

// Middleware para parsear JSON en el body de solicitudes
app.use(express.json());

// Middleware para parsear datos de formularios (form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos sin restricciones (CSS, JS, imágenes)
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));


// REGISTRAR RUTAS MODULARES

// Rutas públicas (sin autenticación)
app.use("/", publicRoutes);

// Rutas de autenticación
app.use("/", authRoutes);

// Rutas de administración (con middleware de autenticación)
app.use("/", adminRoutes);

// Rutas de ticket
app.use("/", ticketRoutes);

// Rutas de API
app.use("/api", apiRoutes);


// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Base de datos conectada");

    await sequelize.sync();
    console.log("✓ Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("✗ Error en base de datos:", err);
  }
};

startServer();