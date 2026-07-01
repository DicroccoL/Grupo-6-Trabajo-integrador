const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// RUTA PARA REGISTRAR UN NUEVO ADMINISTRADOR
router.post('/registro-admin', usuarioController.crearAdmin);

module.exports = router;