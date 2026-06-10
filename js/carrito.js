document.addEventListener("DOMContentLoaded", () => {
    // 1. CONTROL DE USUARIO Y SEGURIDAD
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (!nombreGuardado) {
        window.location.href = "../index.html";
        return;
    }
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent = nombreGuardado.charAt(0).toUpperCase();

    // 2. RECUPERAR EL CARRITO ACTUAL DESDE LOCALSTORAGE
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos del DOM
    const contenedorItems = document.getElementById("contenedor-carrito-items");
    const totalEl = document.getElementById("carrito-total");
    const btnConfirmar = document.getElementById("btn-confirmar-carrito");
    const btnVolver = document.getElementById("btn-volver-catalogo");

    // 3. RENDERIZAR LA PANTALLA DEL CARRITO
    function renderizarCarrito() {
        contenedorItems.innerHTML = ""; // Limpiamos pantalla

        if (carrito.length === 0) {
            contenedorItems.innerHTML = /*html*/`
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

            itemRow.innerHTML = /*html*/`
                <div class="carrito-info">
                    <img src="${item.img}" alt="${item.nombre}">
                    <div>
                        <h3>${item.nombre}</h3>
                        <p class="precio-unitario">Precio unitario: $${item.precio.toLocaleString('es-AR')}</p>
                    </div>
                </div>

                <div class="carrito-acciones">
                    <div class="carrito-controles">
                        <button class="btn-restar">-</button>
                        <span class="cantidad-numero">${item.cantidad}</span>
                        <button class="btn-sumar">+</button>
                    </div>
                    
                    <p class="precio-subtotal">
                        $${subtotal.toLocaleString('es-AR')}
                    </p>
                </div>
            `;

            // Asignar eventos lógicos a los botones de sumar y restar cantidades
            itemRow.querySelector(".btn-restar").addEventListener("click", () => alterarCantidad(index, -1));
            itemRow.querySelector(".btn-sumar").addEventListener("click", () => alterarCantidad(index, 1));

            contenedorItems.appendChild(itemRow);
        });

        // Actualizamos el panel resumen derecho
        totalEl.textContent = `$${totalGeneral.toLocaleString('es-AR')}`;
        btnConfirmar.disabled = false;
    }

    // 4. FUNCIÓN PARA CAMBIAR CANTIDADES (+1 ó -1)
    function alterarCantidad(index, cambio) {
        carrito[index].cantidad += cambio;

        // Si la cantidad llega a 0, eliminamos el producto del carrito
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        // Sincronizamos los cambios con el LocalStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        // Volvemos a generar la pantalla actualizada
        renderizarCarrito();
    }

    // 5. NAVEGACIÓN ENTRE PÁGINAS (BOTONES OBLIGATORIOS)
    btnVolver.addEventListener("click", () => {
        window.location.href = "inicio.html";
    });

    btnConfirmar.addEventListener("click", () => {
        // Al confirmar el carrito saltamos directamente a la vista del ticket
        window.location.href = "ticket.html";
    });

    // Ejecución inicial de la pantalla
    renderizarCarrito();
});