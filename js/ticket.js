document.addEventListener("DOMContentLoaded", () => {
    const nombreUsuario = localStorage.getItem("nombreUsuario") || "Consumidor Final";
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        window.location.href = "/inicio";
        return;
    }

    document.getElementById("nombreUsuario").textContent = nombreUsuario;
    document.getElementById("avatarUsuario").textContent = nombreUsuario.charAt(0).toUpperCase();

    const txtCliente = document.getElementById("ticket-cliente");
    const txtFecha = document.getElementById("ticket-fecha");
    const txtId = document.getElementById("ticket-id");
    const contenedorProductos = document.getElementById("ticket-productos-list");
    const txtTotal = document.getElementById("ticket-total-monto");

    txtCliente.textContent = nombreUsuario;
    
    const ahora = new Date();
    txtFecha.textContent = ahora.toLocaleString("es-AR");

    if (!sessionStorage.getItem("ticketId")) {
        sessionStorage.setItem("ticketId", Math.floor(100000 + Math.random() * 900000));
    }
    txtId.textContent = sessionStorage.getItem("ticketId");

    let totalGeneral = 0;
    contenedorProductos.innerHTML = ""; 

    carrito.forEach(item => {
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

    txtTotal.textContent = `$${totalGeneral.toLocaleString("es-AR")}`;

    const btnVolverInicio = document.getElementById("btn-volver-inicio");
    btnVolverInicio.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        sessionStorage.removeItem("ticketId");
    });
});