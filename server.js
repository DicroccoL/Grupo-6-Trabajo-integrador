require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const pool = require("./config/db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

app.get("/", (req, res) => {
    res.render("index");});

app.get("/inicio", async (req, res) => {
    try {
        const [productos] = await pool.query("SELECT * FROM products");
        res.render("inicio", { productos: productos });
    } catch (error) {
        console.error("Error al traer los productos:", error.message);
        res.status(500).send("Error del servidor");
    }
});

app.get("/carrito", (req, res) => {
    res.render("carrito");});

app.get("/ticket", (req, res) => {
    res.render("ticket");
});
app.get("/admin", (req, res) => {
    res.render("admin");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor abierto en http://localhost:${PORT}`);
});