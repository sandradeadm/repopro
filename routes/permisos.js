// Gestión de permisos (cambio de rol de usuario)
function abrirModalGestionarPermisos() {
    document.getElementById('modalGestionarPermisos').style.display = 'flex';
    document.getElementById('buscarUsuarioPermisos').value = '';
    document.getElementById('selectUsuarioPermisos').innerHTML = '';
    document.getElementById('rolActualPermisos').classList.add('hidden');
    document.getElementById('cambiarRolPermisos').classList.add('hidden');
    document.getElementById('btnGuardarRolPermisos').classList.add('hidden');
    usuariosBusquedaPermisos = [];
    usuarioSeleccionadoPermisos = null;
}
function cerrarModalGestionarPermisos() {
    document.getElementById('modalGestionarPermisos').style.display = 'none';
}
function buscarUsuarioParaPermiso() {
    const query = document.getElementById('buscarUsuarioPermisos').value.trim();
    if (query.length < 2) {
        document.getElementById('selectUsuarioPermisos').innerHTML = '';
        document.getElementById('rolActualPermisos').classList.add('hidden');
        document.getElementById('cambiarRolPermisos').classList.add('hidden');
        document.getElementById('btnGuardarRolPermisos').classList.add('hidden');
        return;
    }
    fetch(`http://localhost:3000/api/usuarios?search=${encodeURIComponent(query)}&page=1&limit=10`)
        .then(res => res.json())
        .then(data => {
            usuariosBusquedaPermisos = data.usuarios;
            const select = document.getElementById('selectUsuarioPermisos');
            select.innerHTML = '';
            usuariosBusquedaPermisos.forEach(u => {
                select.innerHTML += `<option value="${u.id_usuario}">${u.nombre} (${u.dni})</option>`;
            });
            document.getElementById('rolActualPermisos').classList.add('hidden');
            document.getElementById('cambiarRolPermisos').classList.add('hidden');
            document.getElementById('btnGuardarRolPermisos').classList.add('hidden');
        });
}
function cargarRolActualUsuario() {
    const select = document.getElementById('selectUsuarioPermisos');
    const userId = select.value;
    if (!userId) {
        document.getElementById('rolActualPermisos').classList.add('hidden');
        document.getElementById('cambiarRolPermisos').classList.add('hidden');
        document.getElementById('btnGuardarRolPermisos').classList.add('hidden');
        usuarioSeleccionadoPermisos = null;
        return;
    }
    usuarioSeleccionadoPermisos = usuariosBusquedaPermisos.find(u => u.id_usuario == userId);
    document.getElementById('rolActualPermisos').classList.remove('hidden');
    document.getElementById('inputRolActualPermisos').value = usuarioSeleccionadoPermisos.rol || '';
    fetch('http://localhost:3000/api/usuarios/roles')
    .then(res => res.json())
    .then(roles => {
        const selectRol = document.getElementById('selectNuevoRolPermisos');
        selectRol.innerHTML = '';
        roles.forEach(r => {
            selectRol.innerHTML += `<option value="${r.id_rol}" ${usuarioSeleccionadoPermisos.id_rol == r.id_rol ? 'selected' : ''}>${r.nombre}</option>`;
        });
        document.getElementById('cambiarRolPermisos').classList.remove('hidden');
        document.getElementById('btnGuardarRolPermisos').classList.remove('hidden');
    });
}
function guardarNuevoRolPermisos() {
    if (!usuarioSeleccionadoPermisos) return;
    const btn = document.getElementById('btnGuardarRolPermisos');
    btn.disabled = true;
    btn.textContent = "Guardando...";
    const nuevoRol = document.getElementById('selectNuevoRolPermisos').value;
    const nombreRol = document.getElementById('selectNuevoRolPermisos').selectedOptions[0].textContent;
    if (nuevoRol == usuarioSeleccionadoPermisos.id_rol) {
        alert('El usuario ya tiene ese rol.');
        btn.disabled = false;
        btn.textContent = "Guardar cambio de rol";
        return;
    }
    fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionadoPermisos.id_usuario}/cambiar-rol`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevoRol })
    })
    .then(res => {
        if (res.ok) {
            alert('Rol cambiado correctamente');
            registrarLog(
                9,
                `El usuario ${usuario.id_usuario} cambió el rol del usuario ${usuarioSeleccionadoPermisos.id_usuario} (${usuarioSeleccionadoPermisos.nombre}) al rol ${nombreRol}`,
                usuarioSeleccionadoPermisos.nombre
            );
            cerrarModalGestionarPermisos();
            cargarUsuarios && cargarUsuarios();
            if (typeof cargarUsuariosPorRol === "function") cargarUsuariosPorRol();
        } else {
            res.text().then(txt => alert('Error: ' + txt));
        }
        btn.disabled = false;
        btn.textContent = "Guardar cambio de rol";
    })
    .catch(() => {
        alert('Error de red o servidor. Intente nuevamente.');
        btn.disabled = false;
        btn.textContent = "Guardar cambio de rol";
    });
}