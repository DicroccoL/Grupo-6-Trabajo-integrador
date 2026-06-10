const btnIngresar = document.getElementById("btnIngresar");
const mensajeError = document.getElementById("mensajeError");
//creo una función para validar el ingreso del nombre de usuario y redirigir a la página de inicio si es válida
btnIngresar.addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();

    if (nombre) {
        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "pages/inicio.html";
    } else {
        mensajeError.textContent = "Por favor, ingrese su nombre.";
        mensajeError.classList.add("mostrar");
    }
});