/**
 * Rutas de ticket
 * 
 * Define la ruta para descargar el ticket en formato PDF:
 * - POST /ticket/download - Generar y descargar ticket en PDF
 */

const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");


router.post("/ticket/download", ticketController.descargarTicketPDF);

module.exports = router;
