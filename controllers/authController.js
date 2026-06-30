// controllers/authController.js

const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Importación obligatoria para encriptar y comparar

const redirectToAdmin = (res, mensaje, type = "success") => {
  const params = new URLSearchParams({ [type]: mensaje });
  return res.redirect(`/admin?${params.toString()}`);
};

/**
 * 1. REGISTRO: Endpoint de la API para crear un nuevo usuario administrador (Con hash de Bcrypt)
 * Ruta sugerida: POST /api/register-admin
 */
exports.registerAdmin = async (req, res) => {
  const { usuario, contrasenia, fromAdminPanel } = req.body;
  const isAdminPanelRequest = fromAdminPanel === "true" || req.headers.accept?.includes("text/html");

  try {
    // Validar que los campos no estén vacíos
    if (!usuario || !contrasenia) {
      const mensaje = "El usuario y la contraseña son obligatorios.";
      if (isAdminPanelRequest) {
        return redirectToAdmin(res, mensaje, "error");
      }

      return res.status(400).json({ 
        success: false, 
        message: mensaje
      });
    }

    // Verificar si el nombre de usuario ya existe en la base de datos
    const usuarioExistente = await Admin.findOne({ where: { username: usuario } });
    if (usuarioExistente) {
      const mensaje = "El nombre de usuario ya está en uso.";
      if (isAdminPanelRequest) {
        return redirectToAdmin(res, mensaje, "error");
      }

      return res.status(400).json({ 
        success: false, 
        message: mensaje
      });
    }

    // ENCRIPTAR LA CONTRASEÑA CON BCRYPT (10 salt rounds)
    const contraseniaHasheada = await bcrypt.hash(contrasenia, 10);

    // Crear el nuevo administrador en la base de datos guardando el hash
    const nuevoAdmin = await Admin.create({
      username: usuario,
      password: contraseniaHasheada // Guardamos el hash
    });

    if (isAdminPanelRequest) {
      return redirectToAdmin(res, "Usuario administrador creado exitosamente.", "success");
    }

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: "Usuario administrador creado exitosamente de forma segura.",
      data: {
        id: nuevoAdmin.id,
        username: nuevoAdmin.username
      }
    });

  } catch (error) {
    console.error("Error en proceso de registro:", error);
    const mensaje = "Error interno del servidor al registrar el administrador.";
    if (isAdminPanelRequest) {
      return redirectToAdmin(res, mensaje, "error");
    }

    return res.status(500).json({ 
      success: false, 
      message: mensaje
    });
  }
};

/**
 * 2. LOGIN: Autentica al administrador verificando el hash, inicia sesión web y genera el JWT
 * Ruta sugerida: POST /login-admin
 */
exports.loginAdmin = async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    if (!usuario || !contrasenia) {
      return res
        .status(400)
        .json({ success: false, message: "Los campos no pueden estar vacíos." });
    }

    // Buscamos al administrador únicamente por su nombre de usuario
    const cuenta = await Admin.findOne({
      where: { username: usuario }
    });

    if (cuenta) {
      // COMPARAMOS LA CONTRASEÑA EN TEXTO PLANO CON EL HASH ENCRIPTADO DE LA BD
      const contraseniaCorrecta = await bcrypt.compare(contrasenia, cuenta.password);

      if (contraseniaCorrecta) {
        // A) ESTABLECER SESIÓN SEGURA (Para proteger la navegación tradicional /admin)
        req.session.user = {
          id: cuenta.id,
          username: cuenta.username,
          role: "admin"
        };

        // B) GENERAR JSON WEB TOKEN (Para consumo seguro y autenticado de la API REST)
        const token = jwt.sign(
          { id: cuenta.id, username: cuenta.username, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: '8h' }
        );

        // Respuesta estandarizada para el cliente con el token incluido
        return res.json({ 
          success: true, 
          message: "Autenticación exitosa.",
          username: cuenta.username,
          token: token 
        });
      }
    }

    // Si el usuario no existe o la comparación de bcrypt dio false, enviamos un error 401 unificado
    return res
      .status(401) 
      .json({ success: false, message: "Usuario o contraseña incorrectos." });

  } catch (error) {
    console.error("Error en proceso de login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor al procesar la solicitud." });
  }
};

/**
 * 3. LOGOUT: Cierre de sesión y destrucción de cookies en el servidor
*/
exports.logoutAdmin = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "No se pudo destruir la sesión activa." });
    }
    res.clearCookie('connect.sid'); // Limpia la cookie por defecto de express-session
    return res.redirect("/");
  });
};