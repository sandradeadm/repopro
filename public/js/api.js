// Controles de paginación y búsqueda
document.getElementById('buscarBtn').onclick = function() {
    search = document.getElementById('buscador').value;
    pagina = 1;
    cargarUsuarios();
};
document.getElementById('limite').onchange = function() {
    limite = parseInt(this.value);
    pagina = 1;
    cargarUsuarios();
};
document.getElementById('prevBtn').onclick = function() {
    if (pagina > 1) {
        pagina--;
        cargarUsuarios();
    }
};
document.getElementById('nextBtn').onclick = function() {
    pagina++;
    cargarUsuarios();
};