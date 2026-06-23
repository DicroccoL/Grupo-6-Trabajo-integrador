require("dotenv").config();
const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const app = express();

const pool = require("./config/db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

app.get("/", (req, res) => res.render("index"));[cite: 2]

app.get("/inicio", async (req, res) => {
    const [productos] = await pool.query("SELECT * FROM products");[cite: 2]
    res.render("inicio", { productos: productos });[cite: 2]
});

app.get("/carrito", (req, res) => res.render("carrito"));[cite: 2]
app.get("/ticket", (req, res) => res.render("ticket"));[cite: 2]
app.get("/admin", (req, res) => res.render("admin"));[cite: 2]

app.get("/descargar-comprobante", async (req, res) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${process.env.PORT || 3000}/ticket`, { waitUntil: "networkidle0" });

    await page.evaluate(() => {
        const panel = document.querySelector(".ticket-actions-panel");
        if (panel) panel.style.display = "none";
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });
    await browser.close();
    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket_eco_vintage.pdf");
    res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3000;[cite: 2]
app.listen(PORT, () => console.log(`Servidor abierto en http://localhost:${PORT}`));[cite: 2]