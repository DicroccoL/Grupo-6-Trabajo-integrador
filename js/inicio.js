document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    if (!nombreGuardado) { window.location.href = "../index.html"; return; }
    
    document.getElementById("nombreUsuario").textContent = nombreGuardado;
    document.getElementById("avatarUsuario").textContent = nombreGuardado.charAt(0).toUpperCase();


    const productos = [
        { id: 1, nombre: "Campera de Cuero Vintage", precio: 25000, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
        { id: 2, nombre: "Remera Oversize Rock 90s", precio: 8500, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400" },
        { id: 3, nombre: "Jeans Baggy Retro Levis", precio: 18000, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
        { id: 4, nombre: "Borcegos de Cuero Negro", precio: 35000, categoria: "calzado", img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400" },
        { id: 5, nombre: "Zapatillas Retro Skate", precio: 22000, categoria: "calzado", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" }
    ];

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedorProductos = document.getElementById("contenedor-productos");
    const btnIndumentaria = document.getElementById("btn-indumentaria");
    const btnCalzado = document.getElementById("btn-calzado");
    const contadorCarrito = document.getElementById("contador-carrito");

    function actualizarContador() {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;
    }

    function mostrarProductos(cat) {
        contenedorProductos.innerHTML = "";
        productos.filter(p => p.categoria === cat).forEach(prod => {
            const card = document.createElement("div");
            card.className = "producto-card";
            card.innerHTML = `
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p class="precio">$${prod.precio}</p>
                <button class="btn-agregar">Agregar al Carrito</button>
            `;
            card.querySelector(".btn-agregar").addEventListener("click", () => agregarAlCarrito(prod));
            contenedorProductos.appendChild(card);
        });
    }

    function agregarAlCarrito(producto) {
        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
    }

    document.getElementById("btn-ir-carrito").addEventListener("click", () => {
        window.location.href = "carrito.html";
    });

    btnIndumentaria.addEventListener("click", () => { mostrarProductos("indumentaria"); });
    btnCalzado.addEventListener("click", () => { mostrarProductos("calzado"); });

    mostrarProductos("indumentaria");
    actualizarContador();
});