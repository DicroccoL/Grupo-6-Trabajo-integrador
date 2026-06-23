document.addEventListener("DOMContentLoaded", () => {
    const inputImagen = document.querySelector('input[name="imagen"]');
    const formulario = document.querySelector('form');

    if (inputImagen) {
        const vistaPreviaContenedor = document.createElement('div');
        vistaPreviaContenedor.style.marginTop = '10px';
        vistaPreviaContenedor.style.textAlign = 'center';
        
        const imgPreview = document.createElement('img');
        imgPreview.style.maxWidth = '150px';
        imgPreview.style.borderRadius = '8px';
        imgPreview.style.display = 'none'; 
        
        vistaPreviaContenedor.appendChild(imgPreview);
        inputImagen.parentNode.appendChild(vistaPreviaContenedor);

        inputImagen.addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            
            if (archivo) {
                const lector = new FileReader();
                
            
                lector.onload = (evento) => {
                    imgPreview.src = evento.target.result;
                    imgPreview.style.display = 'inline-block';
                };
                
                lector.readAsDataURL(archivo);
            } else {
                imgPreview.style.display = 'none';
            }
        });
    }
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            const precio = parseFloat(document.querySelector('input[name="precio"]').value);
            const stock = parseInt(document.querySelector('input[name="stock"]').value);

            if (precio <= 0) {
                e.preventDefault();
                alert("Por favor, ingresá un precio mayor a 0.");
                return;
            }

            if (stock < 0) {
                e.preventDefault();
                alert("El stock no puede ser un número negativo.");
                return;
            }
            const botonSubmit = formulario.querySelector('button[type="submit"]');
            if (botonSubmit) {
                botonSubmit.textContent = "🚀 Subiendo prenda...";
                botonSubmit.disabled = true;
                formulario.submit();
            }
        });
    }
});