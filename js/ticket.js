// Se ejecuta cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", () => {

    // Lee los datos del ticket guardados en sessionStorage (compra finalizada)
    const datoTicket = JSON.parse(sessionStorage.getItem("ticketData") || null);
    
    // Si no hay ticket o no tiene productos, vuelve al inicio
    if (!datoTicket || !datoTicket.productos || datoTicket.productos.length === 0) {
        window.location.href = "/";
        return;
    }

    // Obtiene el nombre del usuario desde el ticket
    const nombreUsuario = datoTicket.nombreUsuario || "Consumidor Final";

    // Muestra nombre y avatar en la UI
    document.getElementById("nombreUsuario").textContent = nombreUsuario;
    document.getElementById("avatarUsuario").textContent = nombreUsuario.charAt(0).toUpperCase();

    // Elementos del ticket en pantalla
    const textoCliente = document.getElementById("ticket-cliente");
    const textoFecha = document.getElementById("ticket-fecha");
    const textoId = document.getElementById("ticket-id");
    const contenedorProductos = document.getElementById("ticket-productos-list");
    const textoTotal = document.getElementById("ticket-total-monto");

    // Rellena datos básicos del ticket
    textoCliente.textContent = nombreUsuario;
    textoFecha.textContent = datoTicket.fecha || new Date().toLocaleString("es-AR");
    textoId.textContent = datoTicket.ticketId || Math.floor(100000 + Math.random() * 900000);

    // Calcula total y dibuja productos del ticket
    let totalGeneral = 0;
    contenedorProductos.innerHTML = "";

    datoTicket.productos.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

        const fila = document.createElement("div");
        fila.className = "ticket-item-row";

        fila.innerHTML = `
            <span class="tkt-prod-name">${item.cantidad}x ${item.nombre}</span>
            <span class="tkt-prod-subtotal">$${subtotal.toLocaleString("es-AR")}</span>
        `;

        contenedorProductos.appendChild(fila);
    });

    // Muestra el total final
    textoTotal.textContent = `$${(datoTicket.total || totalGeneral).toLocaleString("es-AR")}`;

    // Botón: descargar PDF del ticket
    const btnDescargarPdf = document.getElementById("btn-descargar-pdf");

    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener("click", async () => {

            btnDescargarPdf.textContent = "⌛ Generando PDF...";
            btnDescargarPdf.disabled = true;

            try {
                // Envía datos del ticket al backend para generar PDF
                const cargaUtil = { 
                    ...datoTicket, 
                    theme: localStorage.getItem('theme') || 'dark' 
                };

                const respuesta = await fetch("/ticket/download", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cargaUtil)
                });

                if (!respuesta.ok) throw new Error("Error en la descarga");

                // Recibe el PDF como archivo
                const blob = await respuesta.blob();
                const url = window.URL.createObjectURL(blob);

                // Descarga automática del archivo
                const enlace = document.createElement("a");
                enlace.href = url;
                enlace.download = `Ticket_Eco_Vintage_${datoTicket.ticketId}.pdf`;
                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();

                // Limpia carrito y ticket después de descargar
                localStorage.removeItem("carrito");
                sessionStorage.removeItem("ticketData");

            } catch (error) {
                alert("No se pudo generar el PDF, intente de nuevo.");
                console.error(error);

            } finally {
                btnDescargarPdf.textContent = "Descargar Comprobante PDF";
                btnDescargarPdf.disabled = false;
            }
        });
    }

    // Botón volver al inicio (limpia datos)
    const btnVolverInicio = document.getElementById("btn-volver-inicio");

    if (btnVolverInicio) {
        btnVolverInicio.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("carrito");
            sessionStorage.removeItem("ticketData");
            window.location.href = "/";
        });
    }
});