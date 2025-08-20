// Gestión de grupos (cambio de grupo de usuario)
function abrirModalGestionarGrupos() {
    document.getElementById('modalGestionarGrupos').style.display = 'flex';
    document.getElementById('buscarUsuarioGrupos').value = '';
    document.getElementById('selectUsuarioGrupos').innerHTML = '';
    document.getElementById('grupoActualGrupos').classList.add('hidden');
    document.getElementById('cambiarGrupoGrupos').classList.add('hidden');
    document.getElementById('btnGuardarGrupoGrupos').classList.add('hidden');
    usuariosBusquedaGrupos = [];
    usuarioSeleccionadoGrupos = null;
}
function cerrarModalGestionarGrupos() {
    document.getElementById('modalGestionarGrupos').style.display = 'none';
}
function buscarUsuarioParaGrupo() {
    const query = document.getElementById('buscarUsuarioGrupos').value.trim();
    if (query.length < 2) {
        document.getElementById('selectUsuarioGrupos').innerHTML = '';
        document.getElementById('grupoActualGrupos').classList.add('hidden');
        document.getElementById('cambiarGrupoGrupos').classList.add('hidden');
        document.getElementById('btnGuardarGrupoGrupos').classList.add('hidden');
        return;
    }
    fetch(`http://localhost:3000/api/usuarios?search=${encodeURIComponent(query)}&page=1&limit=10`)
        .then(res => res.json())
        .then(data => {
            usuariosBusquedaGrupos = data.usuarios;
            const select = document.getElementById('selectUsuarioGrupos');
            select.innerHTML = '';
            usuariosBusquedaGrupos.forEach(u => {
                select.innerHTML += `<option value="${u.id_usuario}">${u.nombre} (${u.dni})</option>`;
            });
            document.getElementById('grupoActualGrupos').classList.add('hidden');
            document.getElementById('cambiarGrupoGrupos').classList.add('hidden');
            document.getElementById('btnGuardarGrupoGrupos').classList.add('hidden');
        });
}
function cargarGrupoActualUsuario() {
    const select = document.getElementById('selectUsuarioGrupos');
    const userId = select.value;
    if (!userId) {
        document.getElementById('grupoActualGrupos').classList.add('hidden');
        document.getElementById('cambiarGrupoGrupos').classList.add('hidden');
        document.getElementById('btnGuardarGrupoGrupos').classList.add('hidden');
        usuarioSeleccionadoGrupos = null;
        return;
    }
    usuarioSeleccionadoGrupos = usuariosBusquedaGrupos.find(u => u.id_usuario == userId);
    document.getElementById('grupoActualGrupos').classList.remove('hidden');
    document.getElementById('inputGrupoActualGrupos').value = usuarioSeleccionadoGrupos.grupo || '';
    fetch('http://localhost:3000/api/usuarios/grupos')
    .then(res => res.json())
    .then(grupos => {
        const selectGrupo = document.getElementById('selectNuevoGrupoGrupos');
        selectGrupo.innerHTML = '';
        grupos.forEach(g => {
            selectGrupo.innerHTML += `<option value="${g.id_grupo}" ${usuarioSeleccionadoGrupos.id_grupo == g.id_grupo ? 'selected' : ''}>${g.nombre}</option>`;
        });
        document.getElementById('cambiarGrupoGrupos').classList.remove('hidden');
        document.getElementById('btnGuardarGrupoGrupos').classList.remove('hidden');
    });
}
function guardarNuevoGrupoGrupos() {
    if (!usuarioSeleccionadoGrupos) return;
    const btn = document.getElementById('btnGuardarGrupoGrupos');
    btn.disabled = true;
    btn.textContent = "Guardando...";
    const nuevoGrupo = document.getElementById('selectNuevoGrupoGrupos').value;
    const nombreGrupo = document.getElementById('selectNuevoGrupoGrupos').selectedOptions[0].textContent;
    if (nuevoGrupo == usuarioSeleccionadoGrupos.id_grupo) {
        alert('El usuario ya está en ese grupo.');
        btn.disabled = false;
        btn.textContent = "Guardar cambio de grupo";
        return;
    }
    fetch(`http://localhost:3000/api/usuarios/${usuarioSeleccionadoGrupos.id_usuario}/cambiar-grupo`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nuevoGrupo })
    })
    .then(res => {
        if (res.ok) {
            alert('Grupo cambiado correctamente');
            registrarLog(
                10,
                `El usuario ${usuario.id_usuario} cambió el grupo del usuario ${usuarioSeleccionadoGrupos.id_usuario} (${usuarioSeleccionadoGrupos.nombre}) al grupo ${nombreGrupo}`,
                usuarioSeleccionadoGrupos.nombre
            );
            cerrarModalGestionarGrupos();
            cargarUsuarios && cargarUsuarios();
        } else {
            res.text().then(txt => alert("Error: " + txt));
        }
        btn.disabled = false;
        btn.textContent = "Guardar cambio de grupo";
    })
    .catch(() => {
        alert('Error de red o servidor. Intente nuevamente.');
        btn.disabled = false;
        btn.textContent = "Guardar cambio de grupo";
    });
}