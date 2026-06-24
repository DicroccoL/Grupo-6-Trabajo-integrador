const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//PROCESA LA COMPRA DEL CARRITO
router.post('/checkout', orderController.createOrder);

module.exports = router;