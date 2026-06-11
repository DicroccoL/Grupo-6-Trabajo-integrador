document.addEventListener("DOMContentLoaded", () => {

    const nombreGuardado = localStorage.getItem("nombreUsuario");

    if (!nombreGuardado) {
        window.location.href = "../index.html";
        return;
    }

    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent =
        nombreGuardado.charAt(0).toUpperCase();

    const productos = [
        {
            id: 1,
            nombre: "Campera de Cuero Vintage",
            precio: 25000,
            categoria: "indumentaria",
            img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
        },
        {
            id: 2,
            nombre: "Remera Oversize Rock 90s",
            precio: 8500,
            categoria: "indumentaria",
            img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400"
        },
        {
            id: 3,
            nombre: "Jeans Baggy Retro Levis",
            precio: 18000,
            categoria: "indumentaria",
            img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
        },
        {
            id: 4,
            nombre: "Borcegos de Cuero Negro",
            precio: 35000,
            categoria: "calzado",
            img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400"
        },
        {
            id: 5,
            nombre: "Zapatillas Retro Skate",
            precio: 22000,
            categoria: "calzado",
            img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
        }
    ];

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedorProductos = document.getElementById("contenedor-productos");
    const btnIndumentaria = document.getElementById("btn-indumentaria");
    const btnCalzado = document.getElementById("btn-calzado");
    const contadorCarrito = document.getElementById("contador-carrito");
    const btnCarrito = document.getElementById("btn-ir-carrito");

    function actualizarContador() {

        const totalItems = carrito.reduce(
            (sum, item) => sum + item.cantidad,
            0
        );

        contadorCarrito.textContent = totalItems;
    }

    function mostrarProductos(categoria) {

        contenedorProductos.innerHTML = "";

        const productosFiltrados = productos.filter(
            producto => producto.categoria === categoria
        );

        productosFiltrados.forEach(producto => {

            const card = document.createElement("div");

            card.className = "producto-card";

            card.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">

                <div class="producto-info">

                    <h3>${producto.nombre}</h3>

                    <p>$${producto.precio.toLocaleString("es-AR")}</p>

                    <button class="btn-agregar">
                        Agregar al carrito
                    </button>

                </div>
            `;

            card.querySelector(".btn-agregar")
                .addEventListener("click", () => {
                    agregarAlCarrito(producto);
                });

            contenedorProductos.appendChild(card);
        });
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
    }

    btnIndumentaria.addEventListener("click", () => {

        mostrarProductos("indumentaria");

        btnIndumentaria.classList.add("activo");
        btnCalzado.classList.remove("activo");
    });

    btnCalzado.addEventListener("click", () => {

        mostrarProductos("calzado");

        btnCalzado.classList.add("activo");
        btnIndumentaria.classList.remove("activo");
    });

    btnCarrito.addEventListener("click", () => {
        window.location.href = "carrito.html";
    });

    mostrarProductos("indumentaria");
    actualizarContador();

});