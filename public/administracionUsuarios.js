// Función auxiliar para registrar logs
async function registrarLog(id_operacion, detalle, usuario_afectado = null) {
    const usuarioStr = localStorage.getItem('usuario');
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};
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
}

// Cuando bloqueás (deshabilitás) un usuario:
await registrarLog(
    5, // bloqueo
    `El usuario ${usuario.id_usuario} bloqueó al usuario ${usuarioAfectado.id_usuario} (${usuarioAfectado.nombre})`,
    usuarioAfectado.id_usuario
);

// Cuando desbloqueás (habilitás) un usuario:
await registrarLog(
    6, // desbloqueo
    `El usuario ${usuario.id_usuario} desbloqueó al usuario ${usuarioAfectado.id_usuario} (${usuarioAfectado.nombre})`,
    usuarioAfectado.id_usuario
);

// Cuando cambiás contraseña:
await registrarLog(
    7, // cambio_contraseña
    `El usuario ${usuario.id_usuario} cambió la contraseña del usuario ${usuarioAfectado.id_usuario} (${usuarioAfectado.nombre})`,
    usuarioAfectado.id_usuario
);
