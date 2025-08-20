// ========== FORMULARIO AGREGAR USUARIO ==========
// Valida y envía los datos del nuevo usuario (y registra en bitácora).
document.getElementById('formAgregarUsuario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const btn = document.getElementById('btnAgregarUsuario');
    btn.disabled = true;
    btn.textContent = "Guardando...";

    const data = {
        nombre: document.getElementById('nombre').value,
        password: document.getElementById('password').value,
        dni: document.getElementById('dni').value,
        id_rol: document.getElementById('rol').value,
        id_grupo: document.getElementById('grupo').value
    };

    if (!validarPassword(data.password)) {
        alert('La contraseña debe tener entre 8 y 16 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
        btn.disabled = false;
        btn.textContent = "Agregar Usuario";
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const usuarioCreado = await res.json();
            alert('Usuario agregado correctamente');
            // REGISTRO EN BITÁCORA -- ESTA LÍNEA ES CLAVE
            registrarLog(
                3,
                `El usuario ${usuario.id_usuario} dio de alta al usuario ${usuarioCreado.id_usuario} (${usuarioCreado.nombre})`,
                usuarioCreado.nombre
            );
            cerrarModalAgregarUsuario();
            cargarUsuarios && cargarUsuarios();
            if (typeof cargarUsuariosPorRol === "function") cargarUsuariosPorRol();
        } else {
            const txt = await res.text();
            alert('Error: ' + txt);
        }
    } catch (err) {
        alert('Error de red o servidor. Intente nuevamente.');
    }
    btn.disabled = false;
    btn.textContent = "Agregar Usuario";
});
// ========== MODAL AGREGAR USUARIO ==========
// Abre/cierra el modal y carga los roles y grupos disponibles.
function abrirModalAgregarUsuario() {
    document.getElementById('modalAgregarUsuario').style.display = 'flex';
    cargarRolesYGrupos();
    const btn = document.getElementById('btnAgregarUsuario');
    btn.disabled = false;
    btn.textContent = "Agregar Usuario";
}

function cerrarModalAgregarUsuario() {
    document.getElementById('modalAgregarUsuario').style.display = 'none';
    document.getElementById('formAgregarUsuario').reset();
    const btn = document.getElementById('btnAgregarUsuario');
    btn.disabled = false;
    btn.textContent = "Agregar Usuario";
}

function cargarRolesYGrupos() {
    const selectRol = document.getElementById('rol');
    const selectGrupo = document.getElementById('grupo');
    selectRol.innerHTML = "<option disabled selected>Cargando...</option>";
    selectGrupo.innerHTML = "<option disabled selected>Cargando...</option>";

    fetch('http://localhost:3000/api/usuarios/roles')
    .then(res => res.json())
    .then(roles => {
        selectRol.innerHTML = "";
        roles.forEach(r => {
            selectRol.innerHTML += `<option value="${r.id_rol}">${r.nombre}</option>`;
        });
    });

    fetch('http://localhost:3000/api/usuarios/grupos')
    .then(res => res.json())
    .then(grupos => {
        selectGrupo.innerHTML = "";
        grupos.forEach(g => {
            selectGrupo.innerHTML += `<option value="${g.id_grupo}">${g.nombre}</option>`;
        });
    });
}
// Modal de acción sobre usuario (bloquear, habilitar, cambiar password)
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

// Modal para cambiar contraseña
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