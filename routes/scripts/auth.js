// ========== AUTHENTICATION AND SESSION MANAGEMENT ==========

// Page protection - redirect to login if no user session
if (!localStorage.getItem('usuario')) {
    window.location.href = "Login.html";
}

// Get current user and display greeting
const usuario = JSON.parse(localStorage.getItem('usuario'));
document.getElementById('saludoUsuario').textContent = usuario ? `Hola, ${usuario.nombre}` : "Hola, Administrador";

// Role-based access restriction
const usuarioStr = localStorage.getItem('usuario');
if (!usuarioStr) {
    // If no user, redirect to login
    window.location.href = "Login.html";
} else {
    const usuario = JSON.parse(usuarioStr);
    // Check role
    const rol = usuario.rol ? usuario.rol.toLowerCase() : "";
    if (rol !== "administrador" && rol !== "soporte") {
        // If NOT administrator or support, redirect to dashboard
        alert("Acceso restringido. Solo Administradores y Soporte pueden acceder.");
        window.location.href = "index.html"; 
    }
}

// LOGOUT FUNCTIONALITY
// Remove user from session and redirect to login
document.getElementById('cerrarSesion').onclick = function() {
    localStorage.removeItem('usuario');
    window.location.href = "Login.html";
};

// LOGOUT WITH LOG REGISTRATION
// Redirect to login and register logout in logs
function cerrarSesion() {
    const usuarioStr = localStorage.getItem('usuario');
    const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : {};
    registrarLog(
        2, // logout operation id
        `El usuario ${usuarioObj.id_usuario} cerró sesión`,
        usuarioObj.nombre
    );
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}