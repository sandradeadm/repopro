// Acciones de deshabilitar, habilitar, desbloquear usuario
function deshabilitarUsuario() {
    if(document.getElementById("accionDeshabilitar").disabled) return;
    fetch(`http://localhost:3000/api/usuarios/${usuarioAccionId}/deshabilitar`, {method: "PUT"})
        .then(res => {
            if(res.ok){
                alert("Usuario deshabilitado correctamente");
                registrarLog(
                    5,
                    `El usuario ${usuario.id_usuario} deshabilitó (bloqueó) al usuario ${usuarioAccionId} (${usuarioAccionNombre})`,
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
                    `El usuario ${usuario.id_usuario} habilitó (desbloqueó) al usuario ${usuarioAccionId} (${usuarioAccionNombre})`,
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