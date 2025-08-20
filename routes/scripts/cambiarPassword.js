// ========== PASSWORD CHANGE FUNCTIONALITY ==========

// ========== CHANGE PASSWORD ==========
// Open/close modal to change password and send request to backend
function abrirModalCambiarPassword() {
    document.getElementById('modalCambiarPassword').style.display = 'flex';
    document.getElementById('formCambiarPassword').reset();
    document.getElementById('nombreUsuarioCambioPass').textContent = usuarioCambioPasswordNombre;
}

function cerrarModalCambiarPassword() {
    document.getElementById('modalCambiarPassword').style.display = 'none';
    usuarioCambioPasswordId = null;
    usuarioCambioPasswordNombre = "";
}

// Cambiar contraseña de usuario
document.getElementById('formCambiarPassword').addEventListener('submit', function(event) {
    event.preventDefault();
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    if (!validarPassword(nuevaPassword)) {
        alert('La contraseña debe tener entre 8 y 16 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
        return;
    }
    fetch(`http://localhost:3000/api/usuarios/${usuarioCambioPasswordId}/cambiar-password`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevaPassword })
    })
    .then(async res => {
        if (res.ok) {
            alert('Contraseña cambiada correctamente');
            registrarLog(
                7,
                `El usuario ${usuario.id_usuario} cambió la contraseña del usuario ${usuarioCambioPasswordId} (${usuarioCambioPasswordNombre})`,
                usuarioCambioPasswordNombre
            );
            cerrarModalCambiarPassword();
            cerrarModalAccionUsuario();
            cargarUsuarios();
        } else {
            const txt = await res.text();
            alert('Error: ' + txt);
        }
    });
});