const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

app.get("/", (req, res) => {
    res.render("index");});

app.get("/inicio", (req, res) => {
    res.render("inicio");});

app.get("/carrito", (req, res) => {
    res.render("carrito");});

app.listen(3000, () => {
    console.log("Servidor abierto en http://localhost:3000");});