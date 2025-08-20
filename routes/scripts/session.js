// Protección de sesión y saludo personalizado
if (!localStorage.getItem('usuario')) {
    window.location.href = "/login";
}
const usuario = JSON.parse(localStorage.getItem('usuario'));
document.getElementById('saludoUsuario').textContent = usuario ? `Hola, ${usuario.nombre}` : "Hola, Administrador";