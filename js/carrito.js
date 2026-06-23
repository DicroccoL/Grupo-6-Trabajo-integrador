document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (!nombreGuardado) {
        window.location.href = "/";
        return;
    }
    
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent = nombreGuardado.charAt(0).toUpperCase();

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedorItems = document.getElementById("contenedor-carrito-items");
    const totalEl = document.getElementById("carrito-total");
    const btnConfirmar = document.getElementById("btn-confirmar-carrito");
    const btnVolver = document.getElementById("btn-volver-catalogo");
    const formatearMoneda = (valor) => `$${valor.toLocaleString('es-AR')}`;

    function renderizarCarrito() {
        contenedorItems.innerHTML = ""; 

        if (carrito.length === 0) {
            contenedorItems.innerHTML = `
                <div class="carrito-vacios-contenedor">
                    <span class="carrito-vacio-icono">🛒</span>
                    <h3>Su carrito está completamente vacío</h3>
                    <p>Vuelva al catálogo para seleccionar sus prendas vintage.</p>
                </div>
            `;
            totalEl.textContent = "$0";
            btnConfirmar.disabled = true;
            return;
        }

        let totalGeneral = 0;

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            totalGeneral += subtotal;

            const itemRow = document.createElement("div");
            itemRow.className = "producto-card carrito-item"; 

            itemRow.innerHTML = `
                <div class="carrito-info">
                    <img src="/img/default.png" alt="${item.nombre}">
                    <div>
                        <h3>${item.nombre}</h3>
                        <p class="precio-unitario">Precio unitario: ${formatearMoneda(item.precio)}</p>
                    </div>
                </div>
                <div class="carrito-acciones">
                    <div class="carrito-controles">
                        <button class="btn-restar" data-index="${index}">-</button>
                        <span class="cantidad-numero">${item.cantidad}</span>
                        <button class="btn-sumar" data-index="${index}">+</button>
                    </div>
                    <p class="precio-subtotal">${formatearMoneda(subtotal)}</p>
                </div>
            `;
            contenedorItems.appendChild(itemRow);
        });

        totalEl.textContent = formatearMoneda(totalGeneral);
        btnConfirmar.disabled = false;
    }

    contenedorItems.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        if (index === null) return;

        const idx = parseInt(index);
        if (e.target.classList.contains("btn-sumar")) {
            carrito[idx].cantidad += 1;
        } else if (e.target.classList.contains("btn-restar")) {
            carrito[idx].cantidad -= 1;
            if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
    });

    btnVolver.addEventListener("click", () => window.location.href = "/inicio");
    btnConfirmar.addEventListener("click", () => window.location.href = "/ticket");

    renderizarCarrito();
});