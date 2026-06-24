// middlewares/validarUsuario.js
const { body, validationResult } = require('express-validator');

const validarRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ status: "error", errores: errores.array() });
    }
    next();
  }
];

module.exports = { validarRegistro };