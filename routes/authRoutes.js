

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * Ruta para procesar el login del administrador
 * 
*/

router.post("/login-admin", authController.loginAdmin);

module.exports = router;
