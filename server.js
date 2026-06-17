const express = require("express");
const path = require("path");
console.log("Archivo ejecutado");
console.log("SERVER EJECUTADO - PRUEBA 123");
const app = express();

app.use(express.static(__dirname));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});