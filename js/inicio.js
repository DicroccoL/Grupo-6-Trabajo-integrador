document.addEventListener("DOMContentLoaded", () => {

    // Obtiene el nombre del usuario guardado en localStorage
    const nombreGuardado = localStorage.getItem("nombreUsuario");

    // Si no hay usuario, lo redirige al login
    if (!nombreGuardado) {
        window.location.href = "/";
        return;
    }

    // Muestra nombre e inicial del usuario en pantalla
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent =
        nombreGuardado.charAt(0).toUpperCase();

    // Recupera el carrito desde localStorage (o lo crea vacío)
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Botones de filtros y navegación
    const btnTodos = document.getElementById("btn-todos");
    const btnIndumentaria = document.getElementById("btn-indumentaria");
    const btnCalzado = document.getElementById("btn-calzado");
    const contadorCarrito = document.getElementById("contador-carrito");
    const btnCarrito = document.getElementById("btn-ir-carrito");

    // Contenedores de productos y paginación
    const contenedorProductos = document.getElementById("contenedor-productos");
    const datosProductos = document.getElementById("productos-datos");
    const controlesPaginacion = document.getElementById("controles-paginacion");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const infoPagina = document.getElementById("info-pagina");

    // Configuración de paginación
    const productosPorPagina = 10;
    let paginaActual = 1;
    let categoriaFiltro = "Todos";
    let productosVisibles = [];

    // Actualiza el contador del carrito
    function actualizarContador() {
        const totalArtículos = carrito.reduce(
            (sum, item) => sum + item.cantidad,
            0
        );
        contadorCarrito.textContent = totalArtículos;
    }

    // Agrega un producto al carrito
    function agregarAlCarrito(producto) {
        const existe = carrito.find(item => item.id === producto.id);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        mostrarAlertaVerde();
    }

    // Filtra productos según categoría
    function obtenerProductosFiltrados() {
        const todasLasTarjetas =
            Array.from(datosProductos.querySelectorAll(".producto-card"));

        if (categoriaFiltro === "Todos") {
            return todasLasTarjetas;
        }

        return todasLasTarjetas.filter(tarjeta => {
            const categoria = tarjeta.dataset.categoria || "General";
            return categoria === categoriaFiltro;
        });
    }

    // Renderiza productos según la página actual
    function renderizarPagina() {
        productosVisibles = obtenerProductosFiltrados();

        const totalPaginas =
            Math.ceil(productosVisibles.length / productosPorPagina);

        if (paginaActual > totalPaginas) paginaActual = totalPaginas;
        if (paginaActual < 1) paginaActual = 1;

        const inicio = (paginaActual - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;

        const productosPagina = productosVisibles.slice(inicio, fin);

        contenedorProductos.innerHTML = "";

        if (productosPagina.length === 0) {
            contenedorProductos.innerHTML =
                '<p class="no-productos">No hay productos disponibles.</p>';
            controlesPaginacion.style.display = "none";
        } else {
            productosPagina.forEach(tarjeta => {
                contenedorProductos.appendChild(tarjeta.cloneNode(true));
            });

            infoPagina.textContent =
                `Página ${paginaActual} de ${totalPaginas}`;

            btnAnterior.disabled = paginaActual === 1;
            btnSiguiente.disabled = paginaActual === totalPaginas;

            controlesPaginacion.style.display =
                totalPaginas > 1 ? "block" : "none";
        }

        agregarListenersProductos();
    }

    // Agrega eventos a los botones "Agregar al carrito"
    function agregarListenersProductos() {
        const botones = contenedorProductos.querySelectorAll(".btn-agregar");

        botones.forEach(boton => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();

                if (boton.disabled) {
                    alert("Producto agotado");
                    return;
                }

                const producto = {
                    id: parseInt(boton.dataset.id),
                    nombre: boton.dataset.nombre,
                    precio: parseFloat(boton.dataset.precio),
                    categoria: boton.dataset.categoria || "General"
                };

                agregarAlCarrito(producto);
            });
        });
    }

    // Botón anterior
    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarPagina();
            window.scrollTo(0, 0);
        }
    });

    // Botón siguiente
    btnSiguiente.addEventListener("click", () => {
        const totalPaginas =
            Math.ceil(productosVisibles.length / productosPorPagina);

        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarPagina();
            window.scrollTo(0, 0);
        }
    });

    // Filtros de categoría
    function actualizarFiltro(activo) {
        [btnTodos, btnIndumentaria, btnCalzado].forEach(btn => {
            if (!btn) return;
            btn.classList.toggle("activo", btn === activo);
        });
    }

    if (btnTodos && btnIndumentaria && btnCalzado) {

        btnTodos.addEventListener("click", () => {
            categoriaFiltro = "Todos";
            paginaActual = 1;
            actualizarFiltro(btnTodos);
            renderizarPagina();
        });

        btnIndumentaria.addEventListener("click", () => {
            categoriaFiltro = "Indumentaria";
            paginaActual = 1;
            actualizarFiltro(btnIndumentaria);
            renderizarPagina();
        });

        btnCalzado.addEventListener("click", () => {
            categoriaFiltro = "Calzado";
            paginaActual = 1;
            actualizarFiltro(btnCalzado);
            renderizarPagina();
        });
    }

    // Ir al carrito
    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.location.href = "/carrito";
        });
    }

    // Inicializa contador y renderizado
    actualizarContador();
    renderizarPagina();
});

/**
 * Muestra alerta visual cuando se agrega un producto
 */
function mostrarAlertaVerde() {
    const alerta = document.createElement("div");
    alerta.classList.add("alerta-carrito");
    alerta.innerHTML = "✨ Agregado Exitosamente";

    document.body.appendChild(alerta);

    setTimeout(() => alerta.classList.add("mostrar"), 10);

    setTimeout(() => {
        alerta.classList.remove("mostrar");
        setTimeout(() => alerta.remove(), 300);
    }, 2000);
}