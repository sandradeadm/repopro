// ========== PASSWORD CHANGE MODAL FOR LOGIN ==========

// Modal for password change
function mostrarModalCambioPassword() {
    document.getElementById('modalCambioPassword').style.display = 'flex';
    document.getElementById('formCambioPassword').reset();
    document.getElementById('msgCambioPassword').textContent = '';
}

function cerrarModalCambioPassword() {
    document.getElementById('modalCambioPassword').style.display = 'none';
    usuarioCambioClave = null;
    document.getElementById('msgCambioPassword').textContent = '';
}

// PASSWORD REQUIREMENTS WARNING
document.getElementById('formCambioPassword').onsubmit = async function(e) {
    e.preventDefault();
    const nuevaPassword = document.getElementById('inputNuevaPassword').value.trim();
    if (!validarPassword(nuevaPassword)) {
        document.getElementById('msgCambioPassword').textContent = 'La contraseña debe tener entre 8 y 16 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.';
        return;
    }
    // Change password in backend
    const res = await fetch(`http://localhost:3000/api/usuarios/${usuarioCambioClave}/cambiar-password`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevaPassword })
    });
    if (res.ok) {
        document.getElementById('msgCambioPassword').style.color = 'green';
        document.getElementById('msgCambioPassword').textContent = 'Contraseña cambiada correctamente. Ingrese de nuevo.';
        setTimeout(()=>{
            cerrarModalCambioPassword();
        }, 1500);
    } else {
        // Read backend message and show it
        const msg = await res.text();
        document.getElementById('msgCambioPassword').textContent = msg || 'Error al cambiar la contraseña';
    }
};

// REQUIREMENTS
function validarPassword(password) {
    const minLength = 8;
    const maxLength = 16;
    if (password.length < minLength || password.length > maxLength) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*()_\-+=\[\]{};:,.<>|\/?]/.test(password)) return false;
    return true;
}