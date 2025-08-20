// ========== USER CREATION MODULE ==========

// ========== NEW USER FORM ==========
// Validate and send new user data (and register in audit trail)
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
            // AUDIT TRAIL REGISTRATION
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

// ========== ADD USER MODAL ==========
// Load available roles and groups
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