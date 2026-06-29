document.addEventListener("DOMContentLoaded", () => {

    const tabCliente = document.getElementById("tab-cliente");
    const tabAdmin = document.getElementById("tab-admin");
    const formCliente = document.getElementById("form-cliente");
    const formAdmin = document.getElementById("form-admin");

    const btnIngresar = document.getElementById("btnIngresar");
    const mensajeError = document.getElementById("mensajeError");

    const btnIngresarAdmin = document.getElementById("btnIngresarAdmin");
    const mensajeErrorAdmin = document.getElementById("mensajeErrorAdmin");
    const inputAdminUser = document.getElementById("admin-user");
    const inputAdminPass = document.getElementById("admin-pass");

    tabCliente.addEventListener("click", () => {
        formCliente.style.display = "block";
        formAdmin.style.display = "none";
        
        tabCliente.style.color = "#111";
        tabCliente.style.fontWeight = "bold";
        tabCliente.style.borderBottom = "2px solid #111";
        
        tabAdmin.style.color = "#888";
        tabAdmin.style.fontWeight = "normal";
        tabAdmin.style.borderBottom = "none";
    });

    tabAdmin.addEventListener("click", () => {
        formCliente.style.display = "none";
        formAdmin.style.display = "block";
        
        tabAdmin.style.color = "#111";
        tabAdmin.style.fontWeight = "bold";
        tabAdmin.style.borderBottom = "2px solid #111";
        
        tabCliente.style.color = "#888";
        tabCliente.style.fontWeight = "normal";
        tabCliente.style.borderBottom = "none";
    });

    btnIngresar.addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();

    if (!validarTexto(nombre)) {
        mensajeError.textContent =
            "El nombre debe tener entre 5 y 25 letras y no contener números ni caracteres especiales.";
        mensajeError.classList.add("mostrar");
        return;
    }

    localStorage.setItem("nombreUsuario", nombre);
    localStorage.removeItem("esAdmin");
    window.location.href = "/inicio";
});

    document.getElementById("nombre").addEventListener("input", () => {
        mensajeError.textContent = "";
    });
    btnIngresarAdmin.addEventListener("click", async () => {
        const usuario = inputAdminUser.value.trim();
        const contrasenia = inputAdminPass.value.trim();

        if (!usuario || !contrasenia) {
            mensajeErrorAdmin.textContent = "Por favor, complete todos los campos.";
            return;
        }

        try {
            const respuesta = await fetch("/login-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ usuario, contrasenia })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok && resultado.success) {
                localStorage.setItem("nombreUsuario", resultado.nombre || "Administrador");
                localStorage.setItem("esAdmin", "true");
                window.location.href = "/admin";
            } else {
                mensajeErrorAdmin.textContent = resultado.message || "Usuario o contraseña incorrectos.";
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
            mensajeErrorAdmin.textContent = "Error de conexión con el servidor.";
        }
    });

    inputAdminUser.addEventListener("input", () => { mensajeErrorAdmin.textContent = ""; });
    inputAdminPass.addEventListener("input", () => { mensajeErrorAdmin.textContent = ""; });

    const btnTemaClaro = document.getElementById("btn-theme-light");
    const btnTemaOscuro = document.getElementById("btn-theme-dark");

    function actualizarBotonesTema() {
        const tema = localStorage.getItem("theme") || "dark";
        establecerTema(tema);
        if (btnTemaClaro && btnTemaOscuro) {
            btnTemaClaro.classList.toggle("active", tema === "light");
            btnTemaOscuro.classList.toggle("active", tema === "dark");
        }
    }

    if (btnTemaClaro && btnTemaOscuro) {
        btnTemaClaro.addEventListener("click", () => {
            establecerTema("light");
            actualizarBotonesTema();
        });

        btnTemaOscuro.addEventListener("click", () => {
            establecerTema("dark");
            actualizarBotonesTema();
        });

        actualizarBotonesTema();
    }
});

function establecerTema(modo) {
    localStorage.setItem("theme", modo);
    document.body.classList.toggle("theme-light", modo === "light");
    document.body.classList.toggle("theme-dark", modo === "dark");
}


//valida texto y largo.
function validarTexto(texto) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,25}$/;
    return regex.test(texto.trim());
}