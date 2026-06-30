document.addEventListener("DOMContentLoaded", () => {

    const inputImagen = document.querySelector('input[name="imagen"]');
    const form = document.querySelector('form');

    /**
     * Vista previa de imagen
     */
    if (inputImagen) {
        const imgPreview = document.createElement("img");
        imgPreview.style.maxWidth = "150px";
        imgPreview.style.display = "none";

        inputImagen.parentNode.appendChild(imgPreview);

        inputImagen.addEventListener("change", (e) => {
            const file = e.target.files[0];

            if (!file) {
                imgPreview.style.display = "none";
                return;
            }

            const reader = new FileReader();

            reader.onload = (ev) => {
                imgPreview.src = ev.target.result;
                imgPreview.style.display = "block";
            };

            reader.readAsDataURL(file);
        });
    }

    //VALIDACION PARA CUANDO AGREGAMOS  O EDITAMOS UN PRODUCTO
    if (form) {
        form.addEventListener("submit", (e) => {

            const nombre = document.querySelector('input[name="nombre"]').value.trim();
            const precio = Number(document.querySelector('input[name="precio"]').value);
            const stock = Number(document.querySelector('input[name="stock"]').value);

            // validar nombre
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,25}$/;
            if (!regex.test(nombre)) {
                e.preventDefault();
                alert("Nombre inválido");
                return;
            }

            // validar precio
            if (precio <= 0 || precio > 500000) {
                e.preventDefault();
                alert("Precio inválido");
                return;
            }

            // validar stock
            if (stock < 0) {
                e.preventDefault();
                alert("Stock inválido");
                return;
            }

            // desactivar botón
            const btn = form.querySelector("button[type='submit']");
            btn.textContent = "Cargando...";
            btn.disabled = true;
        });
    }
});