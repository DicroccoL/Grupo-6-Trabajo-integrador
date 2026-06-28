const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    if (!usuario || !contrasenia) {
      return res
        .status(400)
        .json({ success: false, message: "Los campos no pueden estar vacíos." });
    }

    // Validación contra la base de datos utilizando el modelo Admin
    const account = await Admin.findOne({
      where: { username: usuario, password: contrasenia }
    });

    if (account) {
      // 1. ESTABLECER SESIÓN SEGURA 
      req.session.user = {
        id: account.id,
        username: account.username,
        role: "admin"
      };

      // 2. GENERAR JSON WEB TOKEN (Para consumo seguro de la API)
      const token = jwt.sign(
        { id: account.id, username: account.username, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Respuesta estandarizada para el cliente
      return res.json({ 
        success: true, 
        message: "Autenticación exitosa.",
        username: account.username,
        token: token 
      });

    } else {
      return res
        .status(401) // 401 es el código HTTP correcto para No Autorizado
        .json({ success: false, message: "Usuario o contraseña incorrectos." });
    }
  } catch (error) {
    console.error("Error en proceso de login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor al procesar la solicitud." });
  }
};

/**
 * Cierre de sesión y destrucción de cookies en el servidor
 */
exports.logoutAdmin = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "No se pudo destruir la sesión activa." });
    }
    res.clearCookie('connect.sid'); // Limpia la cookie por defecto de express-session
    return res.redirect("/");
  });
}