// Logout simple
document.getElementById('cerrarSesion').onclick = function() {
    localStorage.removeItem('usuario');
    window.location.href = "views/login.html";
};
// Logout con registro en bitácora
function cerrarSesion() {
    const usuarioStr = localStorage.getItem('usuario');
    const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : {};
    registrarLog(
        2, // id_operacion para logout
        `El usuario ${usuarioObj.id_usuario} cerró sesión`,
        usuarioObj.nombre
    );
    localStorage.removeItem('usuario');
    window.location.href = 'views/login.html';
}