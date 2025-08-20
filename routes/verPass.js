// ========== VER CONTRASEÑA SOLO ADMIN ==========
// Variables globales para el usuario a visualizar
let usuarioVerPassNombre = null;

// Muestra el modal para ver la contraseña de un usuario (solo si el usuario logueado es admin).
function verPass(id_usuario) {
    usuarioVerPassId = id_usuario;
    document.getElementById('modalVerPass').style.display = 'flex';
    document.getElementById('formVerPass').reset();
}

// Cierra el modal y limpia variables
function cerrarModalVerPass() {
    document.getElementById('modalVerPass').style.display = 'none';
    usuarioVerPassId = null;
    usuarioVerPassNombre = null;
}

// Evento submit del formulario para ver contraseña
document.getElementById('formVerPass').onsubmit = async function(e) {
    e.preventDefault();
    const usuarioAdmin = document.getElementById('verPassUsuario').value.trim();
    const password = document.getElementById('verPassPassword').value;
    try {
        // Autenticación del admin
        const res = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ usuario: usuarioAdmin, password })
        });
        const data = await res.json();
        if (data.success && data.user && data.user.rol && data.user.rol.toLowerCase() === 'administrador') {
            // Mostrar la contraseña en texto plano
            const passInput = document.getElementById('pass-' + usuarioVerPassId);
            passInput.type = passInput.type === 'password' ? 'text' : 'password';

            // Registrar en la bitácora con ID
            registrarLog(
                12,
                `El administrador ${usuarioAdmin} visualizó la contraseña del usuario ${usuarioVerPassId}`,
                usuarioVerPassId
            );

            cerrarModalVerPass();
        } else {
            alert('Solo un administrador puede ver la contraseña.');
        }
    } catch (err) {
        alert('Error de red o credenciales incorrectas');
    }
};