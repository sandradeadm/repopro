// ========== USER ACTIONS (ENABLE, DISABLE, BLOCK/UNBLOCK) ==========

// ========== USER ACTION MODAL ==========
// Open modal for actions on selected user
function abrirModalAccionUsuario(id, nombre, bloqueado, deshabilitado) {
    usuarioAccionId = id;
    usuarioAccionNombre = nombre;
    usuarioAccionBloqueado = bloqueado;
    usuarioAccionDeshabilitado = deshabilitado;
    document.getElementById("accionesUsuarioNombre").textContent = nombre;
    document.getElementById("accionDesbloquear").disabled = !bloqueado;
    document.getElementById("accionDesbloquear").classList.toggle("opacity-50", !bloqueado);
    document.getElementById("accionHabilitar").disabled = !deshabilitado;
    document.getElementById("accionHabilitar").classList.toggle("opacity-50", !deshabilitado);
    document.getElementById("accionDeshabilitar").disabled = !!deshabilitado;
    document.getElementById("accionDeshabilitar").classList.toggle("opacity-50", !!deshabilitado);

    document.getElementById("accionCambiarPassword").onclick = function() {
        usuarioCambioPasswordId = id;
        usuarioCambioPasswordNombre = nombre;
        abrirModalCambiarPassword();
    };

    document.getElementById("modalAccionUsuario").style.display = "flex";
}

function cerrarModalAccionUsuario() {
    document.getElementById("modalAccionUsuario").style.display = "none";
    usuarioAccionId = null;
}

// ========== DISABLE, ENABLE, UNBLOCK USER ==========
// Execute enable, disable or unblock action, register action in audit trail
function deshabilitarUsuario() {
    if(document.getElementById("accionDeshabilitar").disabled) return;
    fetch(`http://localhost:3000/api/usuarios/${usuarioAccionId}/deshabilitar`, {method: "PUT"})
        .then(res => {
            if(res.ok){
                alert("Usuario deshabilitado correctamente");
                registrarLog(
                    5,
                    `El usuario ${usuario.id_usuario} deshabilitó al usuario ${usuarioAccionId} (${usuarioAccionNombre})`,
                    usuarioAccionNombre
                );
                cerrarModalAccionUsuario();
                cargarUsuarios();
                cargarUsuariosPorRol();
            } else {
                res.text().then(txt => alert("Error: " + txt));
            }
        });
}

function habilitarUsuario() {
    if(document.getElementById("accionHabilitar").disabled) return;
    fetch(`http://localhost:3000/api/usuarios/${usuarioAccionId}/habilitar`, {method: "PUT"})
        .then(res => {
            if(res.ok){
                alert("Usuario habilitado correctamente");
                registrarLog(
                    6,
                    `El usuario ${usuario.id_usuario} habilitó al usuario ${usuarioAccionId} (${usuarioAccionNombre})`,
                    usuarioAccionNombre
                );
                cerrarModalAccionUsuario();
                cargarUsuarios();
                cargarUsuariosPorRol();
            } else {
                res.text().then(txt => alert("Error: " + txt));
            }
        });
}

function desbloquearUsuario() {
    if(document.getElementById("accionDesbloquear").disabled) return;
    fetch(`http://localhost:3000/api/usuarios/${usuarioAccionId}/desbloquear`, {method: "PUT"})
        .then(res => {
            if(res.ok){
                alert("Usuario desbloqueado correctamente");
                registrarLog(
                    8, 
                    `El usuario ${usuario.id_usuario} desbloqueó a ${usuarioAccionId} (${usuarioAccionNombre})`,
                    usuarioAccionNombre
                );
                cerrarModalAccionUsuario();
                cargarUsuarios();
                cargarUsuariosPorRol();
            } else {
                res.text().then(txt => alert("Error: " + txt));
            }
        });
}