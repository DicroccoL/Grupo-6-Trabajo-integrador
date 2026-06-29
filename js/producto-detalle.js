document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    
    if (!nombreGuardado) {
        window.location.href = "/";
        return;
    }

    // Mostrar nombre e inicial del usuario
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent = nombreGuardado.charAt(0).toUpperCase();

    // Actualizar contador del carrito
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contadorCarrito = document.getElementById("contador-carrito");
    
    function actualizarContador() {
        const totalArtículos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contadorCarrito.textContent = totalArtículos;
    }

    actualizarContador();

    // Botón agregar al carrito
    const btnAgregar = document.getElementById("btn-agregar-detalle");
    btnAgregar.addEventListener("click", () => {
        const producto = {
            id: parseInt(btnAgregar.getAttribute("data-id")),
            nombre: btnAgregar.getAttribute("data-nombre"),
            precio: parseFloat(btnAgregar.getAttribute("data-precio")),
            categoria: btnAgregar.getAttribute("data-categoria")
        };

        const existe = carrito.find(item => item.id === producto.id);
        
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();

        // Mostrar alerta de éxito
        alert("✨ Producto agregado exitosamente al carrito");
    });

    // Botón volver al catálogo
    document.getElementById("btn-volver-catalogo").addEventListener("click", () => {
        window.location.href = "/inicio";
    });

    // Botón ir al carrito
    document.getElementById("btn-ir-carrito").addEventListener("click", () => {
        window.location.href = "/carrito";
    });
});