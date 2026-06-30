// Espera a que toda la página cargue antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {


//obtiene lo importante para aplicar sus funciones.
    // Obtiene las pestañas de Cliente y Administrador
    const tabCliente = document.getElementById("tab-cliente");
    const tabAdmin = document.getElementById("tab-admin");

    // Obtiene ambos formularios
    const formCliente = document.getElementById("form-cliente");
    const formAdmin = document.getElementById("form-admin");

    // Elementos del formulario de cliente
    const btnIngresar = document.getElementById("btnIngresar");
    const mensajeError = document.getElementById("mensajeError");

    // Elementos del formulario de administrador
    const btnIngresarAdmin = document.getElementById("btnIngresarAdmin");
    const mensajeErrorAdmin = document.getElementById("mensajeErrorAdmin");
    const inputAdminUser = document.getElementById("admin-user");
    const inputAdminPass = document.getElementById("admin-pass");

////



    // VISTA DE SELECCION DE CLIENTE
    tabCliente.addEventListener("click", () => {

        // Muestra el formulario de cliente y oculta el de administrador
        formCliente.style.display = "block";
        formAdmin.style.display = "none";

        // Marca la pestaña de Cliente como activa
        tabCliente.style.color = "#111";
        tabCliente.style.fontWeight = "bold";
        tabCliente.style.borderBottom = "2px solid #111";

        // Desactiva la pestaña Administrador
        tabAdmin.style.color = "#888";
        tabAdmin.style.fontWeight = "normal";
        tabAdmin.style.borderBottom = "none";
    });


    // VISTA DE SELECCION ADMIN
    tabAdmin.addEventListener("click", () => {

        // Muestra el formulario de administrador y oculta el de cliente
        formCliente.style.display = "none";
        formAdmin.style.display = "block";

        // Marca la pestaña Administrador como activa
        tabAdmin.style.color = "#111";
        tabAdmin.style.fontWeight = "bold";
        tabAdmin.style.borderBottom = "2px solid #111";

        // Desactiva la pestaña Cliente
        tabCliente.style.color = "#888";
        tabCliente.style.fontWeight = "normal";
        tabCliente.style.borderBottom = "none";
    });


    // Ingreso como cliente
    btnIngresar.addEventListener("click", () => {

        // Obtiene el nombre ingresado
        const nombre = document.getElementById("nombre").value.trim();

        // Valida el nombre
        if (!validarTexto(nombre)) {
            mensajeError.textContent =
                "El nombre debe tener entre 5 y 25 letras y no contener números ni caracteres especiales.";
            mensajeError.classList.add("mostrar");
            return;
        }

        // Guarda el nombre y elimina el modo administrador
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.removeItem("esAdmin");

        // Redirige al catálogo
        window.location.href = "/inicio";
    });


    // Limpia el mensaje de error mientras escribe
    document.getElementById("nombre").addEventListener("input", () => {
        mensajeError.textContent = "";
    });


    // Ingreso como administrador
    btnIngresarAdmin.addEventListener("click", async () => {

        // Obtiene usuario y contraseña
        const usuario = inputAdminUser.value.trim();
        const contrasenia = inputAdminPass.value.trim();

        // Verifica que ambos campos estén completos
        if (!usuario || !contrasenia) {
            mensajeErrorAdmin.textContent = "Por favor, complete todos los campos.";
            return;
        }

        try {

            // Envía los datos al servidor
            const respuesta = await fetch("/login-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ usuario, contrasenia })
            });

            // Obtiene la respuesta
            const resultado = await respuesta.json();

            // Si el login fue exitoso
            if (respuesta.ok && resultado.success) {

                // Guarda los datos del administrador
                localStorage.setItem("nombreUsuario", resultado.nombre || "Administrador");
                localStorage.setItem("esAdmin", "true");

                // Redirige al panel
                window.location.href = "/admin";

            } else {

                // Muestra mensaje de error
                mensajeErrorAdmin.textContent =
                    resultado.message || "Usuario o contraseña incorrectos.";
            }

        } catch (error) {

            // Error de conexión con el servidor
            console.error("Error en la conexión con el servidor:", error);
            mensajeErrorAdmin.textContent = "Error de conexión con el servidor.";
        }
    });


    // Limpia el mensaje de error al escribir usuario
    inputAdminUser.addEventListener("input", () => {
        mensajeErrorAdmin.textContent = "";
    });

    // Limpia el mensaje de error al escribir contraseña
    inputAdminPass.addEventListener("input", () => {
        mensajeErrorAdmin.textContent = "";
    });


    // Obtiene los botones para cambiar el tema
    const btnTemaClaro = document.getElementById("btn-theme-light");
    const btnTemaOscuro = document.getElementById("btn-theme-dark");


    // Actualiza el botón activo según el tema seleccionado
    function actualizarBotonesTema() {

        const tema = localStorage.getItem("theme") || "dark";

        // Aplica el tema
        establecerTema(tema);

        // Marca el botón correspondiente
        if (btnTemaClaro && btnTemaOscuro) {
            btnTemaClaro.classList.toggle("active", tema === "light");
            btnTemaOscuro.classList.toggle("active", tema === "dark");
        }
    }


    // Eventos para cambiar el tema
    if (btnTemaClaro && btnTemaOscuro) {

        // Activa el tema claro
        btnTemaClaro.addEventListener("click", () => {
            establecerTema("light");
            actualizarBotonesTema();
        });

        // Activa el tema oscuro
        btnTemaOscuro.addEventListener("click", () => {
            establecerTema("dark");
            actualizarBotonesTema();
        });

        // Aplica el tema guardado al cargar la página
        actualizarBotonesTema();
    }

});


// Cambia el tema y lo guarda en localStorage
function establecerTema(modo) {

    localStorage.setItem("theme", modo);

    document.body.classList.toggle("theme-light", modo === "light");
    document.body.classList.toggle("theme-dark", modo === "dark");
}


// Valida que el nombre tenga entre 5 y 25 letras
function validarTexto(texto) {

    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,25}$/;

    return regex.test(texto.trim());
}