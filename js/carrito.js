document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (!nombreGuardado) {
        window.location.href = "/";
        return;
    }
    // Mostrar el nombre y la inicial del usuario en la interfaz
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent = nombreGuardado.charAt(0).toUpperCase();

//declaracion de variables para manejar el carrito de compras
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedorItems = document.getElementById("contenedor-carrito-items");
    const totalEl = document.getElementById("carrito-total");
    const btnConfirmar = document.getElementById("btn-confirmar-carrito");
    const btnVolver = document.getElementById("btn-volver-catalogo");

    //funcion para declarar la moneda local ars
    const formatearMoneda = (valor) => `$${valor.toLocaleString('es-AR')}`;

    //funcion para renderizar el carrito de compras en la interfaz
    function renderizarCarrito() {
        contenedorItems.innerHTML = ""; 

    //si el carrito esta vacio muestra un mensaje de carrito vacio
        if (carrito.length === 0) {
            contenedorItems.innerHTML = `
                <div class="carrito-vacios-contenedor">
                    <span class="carrito-vacio-icono">🛒</span>
                    <h3>Su carrito está completamente vacío</h3>
                    <p>Vuelva al catálogo para seleccionar sus prendas vintage.</p>
                </div>
            `;
            //si el carrito esta vacio el total es 0 y deshabilita el boton de confirmar compra
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

//logica para manejar los botones de sumar y restar cantidad de productos en el carrito

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
//Logica para al tocar el btn volver al catalogo te mande al catalogo que es inicio.ejs 
    btnVolver.addEventListener("click", () => window.location.href = "/inicio");

    btnConfirmar.addEventListener("click", () => {
        const carritoFormateado = carrito.map(item => ({
            id: item.id,
            cantidad: item.cantidad
        }));

        const datosCompra = {
            nombre_cliente: nombreGuardado,
            carrito: carritoFormateado
        };

        btnConfirmar.disabled = true; 

//metodo fetch para enviar los datos de la compra al servidor y procesar el checkout
        fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCompra)
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.error) {
                alert("Error al procesar la compra: " + datos.error);
                btnConfirmar.disabled = false;
            } else {
                const datoTicket = {
                    nombreUsuario: nombreGuardado,
                    ticketId: datos.orderId,
                    fecha: datos.fecha || new Date().toLocaleString('es-AR'),
                    productos: carrito,
                    total: datos.total,
                    theme: localStorage.getItem('theme') || 'dark'
                };
                sessionStorage.setItem("ticketData", JSON.stringify(datoTicket));
                window.location.href = "/ticket";
            }
        })
        .catch(error => {
            console.error("Error en el checkout:", error);
            alert("Hubo un problema de conexión.");
            btnConfirmar.disabled = false;
        });
    });

    renderizarCarrito();
});