//importamos jwt
const jwt = require("jsonwebtoken");

//Verifica si el usuario tiene sesión activa
function requireSession(req, res, next) {
  if (req.session && req.session.user) {
    // Si la sesion existe y contiene un usuario, permite el acceso
    return next();
  }
  
  // Si no esta autenticado, redirige a la pagina de login principal
  return res.redirect("/");
}


/**
 * Middleware para proteger rutas de la API REST
 * Valida de forma asincrona la autenticidad del token Bearer JWT enviado en las cabeceras.
 */
function requireJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. Credenciales de seguridad no proporcionadas.' 
    });
  }

  try {
    // Verifica el token utilizando la firma secreta de las variables de entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Inyectamos los datos decodificados en el objeto 'req' para que los controladores los usen
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token de acceso inválido o expirado.' 
    });
  }
}

module.exports = {
  requireSession,
  requireJWT
};