document.addEventListener("DOMContentLoaded", () => {
    const ticketData = JSON.parse(sessionStorage.getItem("ticketData") || null);
    
    if (!ticketData || !ticketData.productos || ticketData.productos.length === 0) {
        window.location.href = "/";
        return;
    }

    const nombreUsuario = ticketData.nombreUsuario || "Consumidor Final";
    document.getElementById("nombreUsuario").textContent = nombreUsuario;
    document.getElementById("avatarUsuario").textContent = nombreUsuario.charAt(0).toUpperCase();

    const txtCliente = document.getElementById("ticket-cliente");
    const txtFecha = document.getElementById("ticket-fecha");
    const txtId = document.getElementById("ticket-id");
    const contenedorProductos = document.getElementById("ticket-productos-list");
    const txtTotal = document.getElementById("ticket-total-monto");

    txtCliente.textContent = nombreUsuario;
    txtFecha.textContent = ticketData.fecha || new Date().toLocaleString("es-AR");
    txtId.textContent = ticketData.ticketId || Math.floor(100000 + Math.random() * 900000);

    let totalGeneral = 0;
    contenedorProductos.innerHTML = "";

    ticketData.productos.forEach(item => {
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

    txtTotal.textContent = `$${(ticketData.total || totalGeneral).toLocaleString("es-AR")}`;

    const btnDescargarPdf = document.getElementById("btn-descargar-pdf");
    if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener("click", async () => {
            btnDescargarPdf.textContent = "⌛ Generando PDF...";
            btnDescargarPdf.disabled = true;

            try {
                const payload = { ...ticketData, theme: localStorage.getItem('theme') || 'dark' };
                const response = await fetch("/ticket/download", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("Error en la descarga");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Ticket_Eco_Vintage_${ticketData.ticketId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                localStorage.removeItem("carrito");
                sessionStorage.removeItem("ticketData");
            } catch (err) {
                alert("No se pudo generar el PDF, intente de nuevo.");
                console.error(err);
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