function setTheme(mode) {
    localStorage.setItem("theme", mode);
    document.body.classList.toggle("theme-light", mode === "light");
    document.body.classList.toggle("theme-dark", mode === "dark");
}

function initTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    setTheme(theme);
}

initTheme();
