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

        if (nombre) {
            localStorage.setItem("nombreUsuario", nombre);
            localStorage.removeItem("esAdmin"); 
            window.location.href = "/inicio";
        } else {
            mensajeError.textContent = "Por favor, ingrese su nombre.";
            mensajeError.classList.add("mostrar");
        }
    });
    document.getElementById("nombre").addEventListener("input", () => {
        mensajeError.textContent = "";
    });
    //ES TEMPORAL SIN BASE DE DATOS
    btnIngresarAdmin.addEventListener("click", () => {
        const usuario = inputAdminUser.value.trim();
        const contrasenia = inputAdminPass.value.trim();

        if (!usuario || !contrasenia) {
            mensajeErrorAdmin.textContent = "Por favor, complete todos los campos.";
            return;
        }


        if (usuario === "admin" && contrasenia === "1234") {
            localStorage.setItem("nombreUsuario", "Administrador");
            localStorage.setItem("esAdmin", "true");
            window.location.href = "/admin";
        } else {
            mensajeErrorAdmin.textContent = "Usuario o contraseña incorrectos.";
        }
    });

    inputAdminUser.addEventListener("input", () => { mensajeErrorAdmin.textContent = ""; });
    inputAdminPass.addEventListener("input", () => { mensajeErrorAdmin.textContent = ""; });
});