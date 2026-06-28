function establecerTema(modo) {
    localStorage.setItem("theme", modo);
    document.body.classList.toggle("theme-light", modo === "light");
    document.body.classList.toggle("theme-dark", modo === "dark");
}

function inicializarTema() {
    const tema = localStorage.getItem("theme") || "dark";
    establecerTema(tema);
}

inicializarTema();
