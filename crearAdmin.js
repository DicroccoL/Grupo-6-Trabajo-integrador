// crearAdmin.js
require("dotenv").config(); 
const sequelize = require("./config/db"); // Tu archivo de conexión a la base de datos
const Admin = require("./models/Admin"); // Tu modelo de Sequelize para la tabla Admin
const bcrypt = require("bcrypt"); // Importación directa e independiente

async function forzarRegistro() {
  try {
    // 1. Inicializar la conexión con la base de datos
    await sequelize.authenticate();
    console.log("✓ Conectado a la base de datos de forma exitosa.");

    // ========================================================
    // CONFIGURA AQUÍ EL USUARIO Y LA CONTRASEÑA QUE DESEAS:
    const usuarioNuevo = "tiago";
    const contraseniaPlana = "12345";
    // ========================================================

    // 2. Validar si el usuario ya existe para evitar duplicados molestos
    const existe = await Admin.findOne({ where: { username: usuarioNuevo } });
    if (existe) {
      console.log(`\n✗ El usuario '${usuarioNuevo}' ya existe en la base de datos.`);
      process.exit(0);
    }

    // 3. Hashear la contraseña usando la misma configuración de tu authController (10 salt rounds)
    const hashContraseña = await bcrypt.hash(contraseniaPlana, 10);

    // 4. Insertar el registro directamente en la base de datos
    await Admin.create({
      username: usuarioNuevo,
      password: hashContraseña
    });

    console.log("\n---------------------------------------------------------");
    console.log("¡ADMINISTRADOR CREADO CON ÉXITO EN LA BASE DE DATOS!");
    console.log(`Usuario:    ${usuarioNuevo}`);
    console.log(`Contraseña: ${contraseniaPlana}`);
    console.log("---------------------------------------------------------");

  } catch (error) {
    console.error("\n✗ Error al forzar la creación del administrador:", error);
  } finally {
    // 5. Cerrar la conexión limpia con Sequelize y finalizar el proceso de Node
    await sequelize.close();
    process.exit(0);
  }
}

// Ejecutar la función principal
forzarRegistro();