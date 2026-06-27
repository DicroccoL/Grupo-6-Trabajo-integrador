//Nucleo del sistema

// Cargar variables de entorno desde el archivo .env para evitar exponer información sensible en el código fuente
require("dotenv").config();

//framework express para crear el servidor y manejar rutas
const express = require("express");

//Sirve para construir rutas. 
const path = require("path");

//para generar el ticket PDF.
//convierte una vista HTML en un PDF manteniendo el diseño.
const puppeteer = require("puppeteer");

//Multer recibe archivos enviados desde formularios.
const multer = require("multer");

//Se inicializa la aplicación Express
const app = express();

//Se importa la configuración de la base de datos y los modelos
const sequelize = require("./config/db"); 
const Admin = require("./models/Admin");
const Product = require("./models/Product");
const Order = require("./models/order");
const OrderItem = require("./models/OrderItem");

//Se importa el archivo de rutas para la API
const apiRoutes = require("./routes/api");

//una orden puede tener muchos detalles
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
//cada detalle pertenece a una orden y a un producto
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

//un producto puede venderse en muchas ordenes ,de 1 a *
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

//Cuando un usuario suba una imagen, guarda en la carpeta img
//basicamente es la configuracion de multer para guardar archivos en la carpeta img del proyecto
const upload = multer({ dest: path.join(__dirname, "img") });

//configuracion de la vista ejs 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//traduce los datos a JSON para entenderlos en el servidor
app.use(express.json());

//traduce los datos de formularios a objetos JS
app.use(express.urlencoded({ extended: true }));

//deja que el servidor sirva archivos estaticos como JS, CSS, IMG sin restricciones 
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

//cualquier ruta que empiece con /api sera manejada por el archivo de rutas api.js
app.use("/api", apiRoutes); 


// de aca hay que borrar todo hasta donde se indique
let adminAutenticado = false; 

function verificarAdminNativo(req, res, next) {
  if (adminAutenticado) {
    return next();
  } else {
    return res.redirect("/"); 
  }
}
// hasta aca 

//rutas para renderizar vistas
//basicamente cuando el usuario entra a la ruta / se le renderiza la vista indicada en cualquiera de las 3 que siguen
app.get("/", (req, res) => res.render("index"));
app.get("/carrito", (req, res) => res.render("carrito"));

//para renderizar la vista del ticket, se le pasa un objeto con la propiedad isPdf en false para indicar que no es un PDF
app.get("/ticket", (req, res) => res.render("ticket", { isPdf: false }));


//esto tambien se tiene que borrar
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
//hasta aca

//muestra la vista de inicio con todos los productos activos en la base de datos y en caso de fallar tira un error 500
app.get("/inicio", async (req, res) => {
  try {
    //busca todos los productos activos en la bd
    const productos = await Product.findAll({
      where: { activo: true } 
    });
    // renderiza el catalogo en el ejs con los productos obtenidos de la base de datos
    res.render("inicio", { productos: productos });
  } catch (error) {
    //si hay un error al cargar los productos, se envia un mensaje de error al cliente
    res.status(500).send("Error al cargar los productos");
  }
});

//esta funcion tiene que cambiar cuando se implemente la autenticacion con JWT o sesiones, por ahora es un simple booleano
app.get("/admin", verificarAdminNativo, async (req, res) => {
  try {
    const productos = await Product.findAll(); 
    
    //busca las últimas ventas en la base de datos con limite de 10(osea que de aca podemso modificar el limite visual)
    const ultimasVentas = await Order.findAll({
      limit: 10,
      order: [['fecha', 'DESC']], //ordena por fecha descente.
      include: [{ 
        model: OrderItem, 
        as: 'items',
        include: [Product]
      }]
    });
    // renderiza la vista de admin con los productos y ultimas ventas desde la bd ,por las dudas si salta un error lo atrapa y tira un error 500
    res.render("admin", { productos: productos, ventas: ultimasVentas });
  } catch (error) {
    console.error('Error en /admin:', error);
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

app.get("/admin/editar-producto/:id", verificarAdminNativo, async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).send("Producto no encontrado");
    
    res.render("agregar_carrito", { 
      producto: producto, 
      esEdicion: true 
    });
  } catch (error) {
    res.status(500).send("Error al obtener los datos del producto");
  }
});
app.post("/admin/editar-producto/:id", verificarAdminNativo, upload.single("imagen"), async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    const { nombre, precio, stock, descripcion, categoria } = req.body;
    
    const imagen_url = req.file ? req.file.filename : producto.imagen_url;

    await producto.update({
      nombre,
      precio,
      stock,
      descripcion,
      categoria,
      imagen_url
    });

    res.redirect("/admin"); 
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
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
      
      const portForPdf = process.env.PORT || 3000;
      await page.setContent(html, { waitUntil: "networkidle0", url: `http://localhost:${portForPdf}/` });
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