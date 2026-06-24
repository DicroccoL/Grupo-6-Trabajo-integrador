require("dotenv").config();
const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const multer = require("multer");
const app = express();

const sequelize = require("./config/db"); 
const Admin = require("./models/Admin");
const Product = require("./models/Product");
const Order = require("./models/order");
const OrderItem = require("./models/OrderItem");
const apiRoutes = require("./routes/api");

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

const upload = multer({ dest: path.join(__dirname, "img") });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

app.use("/api", apiRoutes); 

let adminAutenticado = false; 

function verificarAdminNativo(req, res, next) {
  if (adminAutenticado) {
    return next();
  } else {
    return res.redirect("/"); 
  }
}

app.get("/", (req, res) => res.render("index"));
app.get("/carrito", (req, res) => res.render("carrito"));
app.get("/ticket", (req, res) => res.render("ticket"));

app.post("/login-admin", async (req, res) => {
  const { usuario, contrasenia } = req.body;
  try {
    if (!usuario || !contrasenia) {
      return res.status(400).json({ success: false, message: "Campos vacíos" });
    }
    const adminLogueado = await Admin.findOne({
      where: { username: usuario, password: contrasenia }
    });
    if (adminLogueado) {
      adminAutenticado = true; 
      return res.json({ success: true, nombre: adminLogueado.username });
    } else {
      return res.status(400).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

app.get("/inicio", async (req, res) => {
  try {
    const productos = await Product.findAll({
      where: { activo: true } 
    });
    res.render("inicio", { productos: productos });
  } catch (error) {
    res.status(500).send("Error al cargar los productos");
  }
});

app.get("/admin", verificarAdminNativo, async (req, res) => {
  try {
    const productos = await Product.findAll(); 
    res.render("admin", { productos: productos });
  } catch (error) {
    res.status(500).send("Error al cargar el panel de administración");
  }
});

app.get("/admin/agregar-producto", verificarAdminNativo, (req, res) => {
  res.render("agregar_carrito");
});

app.post("/admin/agregar-producto", verificarAdminNativo, upload.single("imagen"), async (req, res) => {
  const { nombre, precio, descripcion, stock, categoria } = req.body;
  const imagenNombre = req.file ? req.file.filename : "default.png";
  try {
    await Product.create({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      stock: stock,
      imagen_url: imagenNombre,
      categoria: categoria || "General"
    });
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al guardar el producto en la base de datos");
  }
});

app.post("/admin/eliminar-producto", verificarAdminNativo, async (req, res) => {
  const { id } = req.body;
  try {
    await Product.update(
      { activo: false }, 
      { where: { id: id } }
    );
    res.redirect("/admin");
  } catch (error) {
    res.status(500).send("Error al eliminar el producto");
  }
});

app.post("/ticket/download", async (req, res) => {
  const { nombreUsuario, ticketId, fecha, productos, total, theme } = req.body;
  try {
    app.render("ticket", { nombreUsuario, ticketId, fecha, productos, total, isPdf: true, theme }, async (err, html) => {
      if (err) throw err;
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.emulateMediaType("screen");
      
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
  } catch (error) {
    res.status(500).send("Error al procesar la compra.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  sequelize.authenticate()
    .then(() => {})
    .catch(err => console.error(err));
});