// routes/api.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. Importamos el middleware de seguridad
const { requireJWT } = require('../middleware/auth');

// PROCESA LA COMPRA DEL CARRITO (Ahora protegido con JWT)
// El flujo se detendrá aquí si el cliente no envía un token válido en los headers
router.post('/checkout', requireJWT, orderController.createOrder);

module.exports = router;