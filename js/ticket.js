document.addEventListener("DOMContentLoaded", () => {
    const datoTicket = JSON.parse(sessionStorage.getItem("ticketData") || null);
    
    if (!datoTicket || !datoTicket.productos || datoTicket.productos.length === 0) {
        window.location.href = "/";
        return;
    }

    const nombreUsuario = datoTicket.nombreUsuario || "Consumidor Final";
    document.getElementById("nombreUsuario").textContent = nombreUsuario;
    document.getElementById("avatarUsuario").textContent = nombreUsuario.charAt(0).toUpperCase();

    const textoCliente = document.getElementById("ticket-cliente");
    const textoFecha = document.getElementById("ticket-fecha");
    const textoId = document.getElementById("ticket-id");
    const contenedorProductos = document.getElementById("ticket-productos-list");
    const textoTotal = document.getElementById("ticket-total-monto");

    textoCliente.textContent = nombreUsuario;
    textoFecha.textContent = datoTicket.fecha || new Date().toLocaleString("es-AR");
    textoId.textContent = datoTicket.ticketId || Math.floor(100000 + Math.random() * 900000);

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

    textoTotal.textContent = `$${(datoTicket.total || totalGeneral).toLocaleString("es-AR")}`;

    const btnDescargarPdf = document.getElementById("btn-descargar-pdf");
    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener("click", async () => {
            btnDescargarPdf.textContent = "⌛ Generando PDF...";
            btnDescargarPdf.disabled = true;

            try {
                const cargaUtil = { ...datoTicket, theme: localStorage.getItem('theme') || 'dark' };
                const respuesta = await fetch("/ticket/download", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cargaUtil)
                });

                if (!respuesta.ok) throw new Error("Error en la descarga");

                const blob = await respuesta.blob();
                const url = window.URL.createObjectURL(blob);
                const enlace = document.createElement("a");
                enlace.href = url;
                enlace.download = `Ticket_Eco_Vintage_${datoTicket.ticketId}.pdf`;
                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();

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