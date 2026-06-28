/**
 * Controlador de tickets
 * 
 * Contiene la lógica para generar y descargar tickets en formato PDF.
 */

const puppeteer = require("puppeteer");
const { renderFile } = require("ejs");
const path = require("path");


exports.descargarTicketPDF = async (req, res) => {
  const { nombreUsuario, ticketId, fecha, productos, total, theme } = req.body;

  try {
    // Renderizar la vista EJS a HTML con los datos del ticket
    // isPdf: true indica a la vista que se está generando un PDF
    // theme: el tema visual (light o dark)
    const html = await renderFile(
      path.join(__dirname, "../views/ticket.ejs"),
      {
        nombreUsuario,
        ticketId,
        fecha,
        productos,
        total,
        isPdf: true,
        theme
      }
    );

    // Lanzar Puppeteer (navegador sin interfaz gráfica)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Emular tipo de media "screen" para que el PDF se vea como en pantalla
    // (en lugar de como un documento para imprimir)
    await page.emulateMediaType("screen");

    // Obtener el puerto del servidor desde variables de entorno o usar 3000 como default
    const portForPdf = process.env.PORT || 3000;

    // Cargar el HTML en la página de Puppeteer
    // waitUntil: "networkidle0" espera a que todas las solicitudes de red finalicen
    await page.setContent(html, {
      waitUntil: "networkidle0",
      url: `http://localhost:${portForPdf}/`
    });

    // Generar el PDF con configuración específica
    // format: "A4" - Tamaño de papel A4
    // printBackground: true - Incluir colores de fondo
    // margin: Márgenes en pixels
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });

    // Cerrar el navegador para liberar recursos
    await browser.close();

    // Configurar headers para la descarga del PDF
    res.contentType("application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket_eco_vintage_${ticketId}.pdf`
    );

    // Enviar el buffer del PDF al cliente
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).send("Error al procesar la compra.");
  }
};
