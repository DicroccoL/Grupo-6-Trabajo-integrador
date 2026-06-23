require("dotenv").config();
const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const multer = require("multer");
const app = express();
const pool = require("./config/db");
const upload = multer({ dest: path.join(__dirname, "img") });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));
app.get("/", (req, res) => res.render("index"));
app.get("/carrito", (req, res) => res.render("carrito"));
app.get("/ticket", (req, res) => res.render("ticket"));

app.get("/inicio", async (req, res) => {
  const [productos] = await pool.query("SELECT * FROM products");
  res.render("inicio", { productos: productos });
});

app.get("/admin", async (req, res) => {
  const [productos] = await pool.query("SELECT * FROM products");
  res.render("admin", { productos: productos });
});

app.get("/admin/agregar-producto", (req, res) => {
  res.render("agregar_carrito");
});

app.post("/admin/agregar-producto", upload.single("imagen"), async (req, res) => {
  const { nombre, precio, descripcion, stock } = req.body;
  const imagenNombre = req.file ? req.file.filename : "default.png";

  await pool.query(
    "INSERT INTO products (nombre, precio, descripcion, stock, imagen) VALUES (?, ?, ?, ?, ?)",
    [nombre, precio, descripcion, stock, imagenNombre]
  );
  res.redirect("/admin");
});

app.post("/admin/eliminar-producto", async (req, res) => {
  const { id } = req.body;
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
  res.redirect("/admin");
});
app.post("/ticket/download", async (req, res) => {
  const { nombreUsuario, ticketId, fecha, productos, total } = req.body;
  app.render("ticket", { nombreUsuario, ticketId, fecha, productos, total, isPdf: true }, async (err, html) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });
    await browser.close();
    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ticket_eco_vintage_${ticketId}.pdf`);
    res.send(pdfBuffer);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor abierto en http://localhost:${PORT}`));