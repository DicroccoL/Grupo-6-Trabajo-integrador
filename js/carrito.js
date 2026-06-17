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
            itemRow.querySelector(".btn-restar").addEventListener("click", () => alterarCantidad(index, -1));
            itemRow.querySelector(".btn-sumar").addEventListener("click", () => alterarCantidad(index, 1));

            contenedorItems.appendChild(itemRow);
        });

        totalEl.textContent = `$${totalGeneral.toLocaleString('es-AR')}`;
        btnConfirmar.disabled = false;
    }


    function alterarCantidad(index, cambio) {
        carrito[index].cantidad += cambio;

    
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        renderizarCarrito();
    }
    btnVolver.addEventListener("click", () => {
        window.location.href = "/inicio";
    });

    btnConfirmar.addEventListener("click", () => {
        window.location.href = "/ticket";
    });

    renderizarCarrito();
});