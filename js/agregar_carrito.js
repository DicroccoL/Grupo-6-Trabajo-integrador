document.addEventListener("DOMContentLoaded", () => {
    const entradaImagen = document.querySelector('input[name="imagen"]');
    const formulario = document.querySelector('form');

    if (entradaImagen) {
        const vistaPreviaContenedor = document.createElement('div');
        vistaPreviaContenedor.style.marginTop = '10px';
        vistaPreviaContenedor.style.textAlign = 'center';
        
        const previaImagen = document.createElement('img');
        previaImagen.style.maxWidth = '150px';
        previaImagen.style.borderRadius = '8px';
        previaImagen.style.display = 'none'; 
        
        vistaPreviaContenedor.appendChild(previaImagen);
        entradaImagen.parentNode.appendChild(vistaPreviaContenedor);

        entradaImagen.addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            
            if (archivo) {
                const lectorArchivos = new FileReader();
                
            
                lectorArchivos.onload = (evento) => {
                    previaImagen.src = evento.target.result;
                    previaImagen.style.display = 'inline-block';
                };
                
                lectorArchivos.readAsDataURL(archivo);
            } else {
                previaImagen.style.display = 'none';
            }
        });
    }
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            const precio = parseFloat(document.querySelector('input[name="precio"]').value);
            const stock = parseInt(document.querySelector('input[name="stock"]').value);

            if (isNaN(precio) || precio <= 0 || precio > 500000) {
            e.preventDefault();
            alert("El precio debe ser mayor a $0 y menor o igual a $500.000.");
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