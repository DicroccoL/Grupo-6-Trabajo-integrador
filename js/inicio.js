document.addEventListener("DOMContentLoaded", () => {

    const nombreGuardado = localStorage.getItem("nombreUsuario");

    if (!nombreGuardado) {
        window.location.href = "/";
        return;
    }

    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent =
        nombreGuardado.charAt(0).toUpperCase();
        
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const btnIndumentaria = document.getElementById("btn-indumentaria");
    const btnCalzado = document.getElementById("btn-calzado");
    const contadorCarrito = document.getElementById("contador-carrito");
    const btnCarrito = document.getElementById("btn-ir-carrito");
    const contenedorProductos = document.getElementById("contenedor-productos");

    function actualizarContador() {
        const totalItems = carrito.reduce(
            (sum, item) => sum + item.cantidad,
            0
        );
        contadorCarrito.textContent = totalItems;
    }

    function agregarAlCarrito(producto) {
        const existe = carrito.find(
            item => item.id === producto.id
        );

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

        actualizarContador();
        mostrarAlertaVerde();
    }
    if (contenedorProductos) {
        contenedorProductos.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-agregar")) {
                const boton = e.target;
            
                const producto = {
                    id: parseInt(boton.getAttribute("data-id")),
                    nombre: boton.getAttribute("data-nombre"),
                    precio: parseFloat(boton.getAttribute("data-precio"))
                };
                
                agregarAlCarrito(producto);
            }
        });
    }

    if (btnIndumentaria && btnCalzado) {
        btnIndumentaria.addEventListener("click", () => {
            btnIndumentaria.classList.add("activo");
            btnCalzado.classList.remove("activo");
        });

        btnCalzado.addEventListener("click", () => {
            btnCalzado.classList.add("activo");
            btnIndumentaria.classList.remove("activo");
        });
    }

    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.location.href = "/carrito";
        });
    }

    actualizarContador();
});

function mostrarAlertaVerde() {
    const alerta = document.createElement("div");
    alerta.classList.add("alerta-carrito");
    alerta.innerHTML = `✨ Agregado Exitosamente`;
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.classList.add("mostrar");
    }, 10);

    setTimeout(() => {
        alerta.classList.remove("mostrar");
        setTimeout(() => {
            alerta.remove();
        }, 300);
    }, 2000);
}