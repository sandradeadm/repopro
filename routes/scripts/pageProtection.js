// ========== GENERIC PAGE PROTECTION ==========
// If no user in localStorage, redirect to login
// Also show personalized greeting on top right
if (!localStorage.getItem('usuario')) {
    window.location.href = "/login";
}

const usuario = JSON.parse(localStorage.getItem('usuario'));
if (document.getElementById('saludoUsuario')) {
    document.getElementById('saludoUsuario').textContent = usuario ? `Hola, ${usuario.nombre}` : "Hola, Administrador";
}

// Function to register logs in audit trail
async function registrarLog(id_operacion, detalle, usuario_afectado = null) {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return;
    const usuario = JSON.parse(usuarioStr);
    try {
        await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_operacion,
                id_usuario: usuario.id_usuario,
                ip: null,
                detalle,
                usuario_afectado
            })
        });
    } catch (err) {
        console.error('Error registrando en bitácora:', err);
    }
}

// Logout button (registers logout in audit trail)
if (document.getElementById('cerrarSesion')) {
    document.getElementById('cerrarSesion').onclick = async function() {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            await registrarLog(
                2, // logout operation id
                `El usuario ${usuario.id_usuario} cerró sesión`
            );
        }
        localStorage.removeItem('usuario');
        window.location.href = "/login";
    };
}