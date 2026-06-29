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

    const btnTodos = document.getElementById("btn-todos");
    const btnIndumentaria = document.getElementById("btn-indumentaria");
    const btnCalzado = document.getElementById("btn-calzado");
    const contadorCarrito = document.getElementById("contador-carrito");
    const btnCarrito = document.getElementById("btn-ir-carrito");
    const contenedorProductos = document.getElementById("contenedor-productos");
    const datosProductos = document.getElementById("productos-datos");
    const controlesPaginacion = document.getElementById("controles-paginacion");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const infoPagina = document.getElementById("info-pagina");

    const productosPorPagina = 10;
    let paginaActual = 1;
    let categoriaFiltro = "Todos";
    let productosVisibles = [];

    function actualizarContador() {
        const totalArtículos = carrito.reduce(
            (sum, item) => sum + item.cantidad,
            0
        );
        contadorCarrito.textContent = totalArtículos;
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

    function obtenerProductosFiltrados() {
        const todasLasTarjetas = Array.from(datosProductos.querySelectorAll(".producto-card"));
        
        if (categoriaFiltro === "Todos") {
            return todasLasTarjetas;
        }
        
        return todasLasTarjetas.filter(tarjeta => {
            const categoriaProducto = tarjeta.dataset.categoria || "General";
            return categoriaProducto === categoriaFiltro;
        });
    }

    function renderizarPagina() {
        productosVisibles = obtenerProductosFiltrados();
        const totalPaginas = Math.ceil(productosVisibles.length / productosPorPagina);
        

        if (paginaActual > totalPaginas && totalPaginas > 0) {
            paginaActual = totalPaginas;
        }
        if (paginaActual < 1) {
            paginaActual = 1;
        }

        // Calcular índices
        const inicio = (paginaActual - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productosVisibles.slice(inicio, fin);

  
        contenedorProductos.innerHTML = "";
        
        if (productosPagina.length === 0) {
            contenedorProductos.innerHTML = '<p class="no-productos">No hay productos disponibles en este momento.</p>';
            controlesPaginacion.style.display = "none";
        } else {
            productosPagina.forEach(tarjeta => {
                contenedorProductos.appendChild(tarjeta.cloneNode(true));
            });

      
            infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
            btnAnterior.disabled = paginaActual === 1;
            btnSiguiente.disabled = paginaActual === totalPaginas;
            controlesPaginacion.style.display = totalPaginas > 1 ? "block" : "none";
        }

        agregarListenersProductos();
    }

    function agregarListenersProductos() {
        const botonesAgregar = contenedorProductos.querySelectorAll(".btn-agregar");
        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                
                if (boton.disabled) {
                    alert("Este producto está agotado y no se puede agregar al carrito.");
                    return;
                }

                const producto = {
                    id: parseInt(boton.getAttribute("data-id")),
                    nombre: boton.getAttribute("data-nombre"),
                    precio: parseFloat(boton.getAttribute("data-precio")),
                    categoria: boton.getAttribute("data-categoria") || "General"
                };
                
                agregarAlCarrito(producto);
            });
        });
    }

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarPagina();
            window.scrollTo(0, 0);
        }
    });

    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(productosVisibles.length / productosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarPagina();
            window.scrollTo(0, 0);
        }
    });

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

    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.location.href = "/carrito";
        });
    }

    actualizarContador();
    renderizarPagina(); 
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