document.addEventListener("DOMContentLoaded", () => {
    const productosBase = [
        { id: 1, nombre: "Campera de Cuero Vintage", precio: 25000, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
        { id: 2, nombre: "Remera Oversize Rock 90s", precio: 8500, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400" },
        { id: 3, nombre: "Jeans Baggy Retro Levis", precio: 18000, categoria: "indumentaria", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" }
    ];

    let inventario = JSON.parse(localStorage.getItem("inventarioProductos"));
    if (!inventario) {
        inventario = productosBase;
        localStorage.setItem("inventarioProductos", JSON.stringify(inventario));
    }

    const tbody = document.getElementById("tbody-productos");
    const formAlta = document.getElementById("form-alta-producto");

    function renderizarTabla() {
        tbody.innerHTML = "";

        if (inventario.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="table-empty-msg">No hay productos en stock.</td></tr>`;
            return;
        }

        inventario.forEach((prod, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${prod.img}" class="prod-thumb" alt="${prod.nombre}" onerror="this.src='https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400'"></td>
                <td><strong>${prod.nombre}</strong></td>
                <td><span class="badge-cat cat-${prod.categoria}">${prod.categoria}</span></td>
                <td class="table-price">$${prod.precio.toLocaleString("es-AR")}</td>
                <td>
                    <button class="btn-delete" data-index="${index}" title="Eliminar Producto">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        const botonesBorrar = document.querySelectorAll(".btn-delete");
        botonesBorrar.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                eliminarProducto(idx);
            });
        });
    }
    formAlta.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("prod-nombre").value.trim();
        const precio = parseFloat(document.getElementById("prod-precio").value);
        const categoria = document.getElementById("prod-categoria").value;
        const imagen = document.getElementById("prod-imagen").value.trim();

        const nuevoProducto = {
            id: Date.now(), 
            nombre: nombre,
            precio: precio,
            categoria: categoria,
            img: imagen
        };

        inventario.push(nuevoProducto);
        localStorage.setItem("inventarioProductos", JSON.stringify(inventario));
        
        formAlta.reset();
        renderizarTabla();
        alert("✨ ¡Producto agregado al inventario exitosamente!");
    });

    function eliminarProducto(index) {
        if (confirm(`¿Está seguro que desea eliminar "${inventario[index].nombre}" del catálogo?`)) {
            inventario.splice(index, 1);
            localStorage.setItem("inventarioProductos", JSON.stringify(inventario));
            renderizarTabla();
        }
    }
    renderizarTabla();
});