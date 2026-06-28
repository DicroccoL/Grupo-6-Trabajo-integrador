/**
 * Controlador de usuarios
 * 
 * Contiene la lógica de negocio relacionada con la gestión de usuarios administradores.
 * 
 * NOTA: En el proyecto actual, esto solo contiene el registro de administradores.
 * Este módulo debería expandirse para incluir:
 * - Listar usuarios
 * - Editar permisos
 * - Eliminar usuarios
 */

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

/**
 * Crea un nuevo administrador en la base de datos
 * 
 * POST /registro-admin
 * 
 * Recibe los datos del nuevo administrador, encripta la contraseña con bcrypt
 * y lo guarda en la base de datos.
 * 
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} req.body - Datos del nuevo usuario
 * @param {string} req.body.username - Nombre de usuario del administrador
 * @param {string} req.body.password - Contraseña sin encriptar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {JSON} { status: "success", message: "Administrador creado", id: userId }
 * @throws {Error} Si falla la creación del usuario
 */
exports.crearAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Generar un "salt" para encriptar la contraseña
    // El salt es un valor aleatorio que se usa en el algoritmo de encriptación
    const salt = await bcrypt.genSalt(10);

    // Encriptar la contraseña usando bcrypt
    // Esto es mucho más seguro que guardar contraseñas en texto plano
    const passwordCifrada = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario en la base de datos
    const nuevoAdmin = await Usuario.create({
      username,
      password: passwordCifrada
    });

    // Devolver respuesta exitosa con el ID del nuevo usuario
    res.status(201).json({
      status: "success",
      message: "Administrador creado",
      id: nuevoAdmin.id
    });
  } catch (error) {
    // Devolver error si algo falla
    res.status(500).json({ status: "error", message: error.message });
  }
};
