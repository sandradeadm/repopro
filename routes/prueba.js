
    // ========== PROTECCIÓN DE SESIÓN Y SALUDO ==========
// Si no hay usuario en localStorage, redirige al login.
// También muestra el saludo personalizado arriba a la derecha.
if (!localStorage.getItem('usuario')) {
    window.location.href = "views/login.html";
}
const usuario = JSON.parse(localStorage.getItem('usuario'));
document.getElementById('saludoUsuario').textContent = usuario ? `Hola, ${usuario.nombre}` : "Hola, Administrador";

// Función para registrar una acción en el log/bitácora (POST a /api/logs).
async function registrarLog(id_operacion, detalle, usuario_afectado = null) {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return;
    const usuario = JSON.parse(usuarioStr);
    try {
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
    } catch (err) {
        console.error('Error registrando en bitácora:', err);
    }
}

// ========== VARIABLES GLOBALES ==========
// Variables para la paginación y búsqueda en la tabla de usuarios.
let pagina = 1;
let limite = 10;
let search = "";

// Variables para acciones sobre usuarios (bloquear, habilitar, cambiar password, etc.)
let usuarioAccionId = null;
let usuarioAccionNombre = "";
let usuarioAccionBloqueado = false;
let usuarioAccionDeshabilitado = false;

let usuarioCambioPasswordId = null;
let usuarioCambioPasswordNombre = "";

let usuariosBusquedaPermisos = [];
let usuarioSeleccionadoPermisos = null;

let usuariosBusquedaGrupos = [];
let usuarioSeleccionadoGrupos = null;

let usuarioVerPassId = null;

// ========== FUNCION REGISTRAR LOG ==========
// (Repetida, ya explicada arriba)

// ========== CARGAR USUARIOS Y PINTAR TABLA ==========
// Obtiene la lista de usuarios desde el backend y los pinta en la tabla principal.
// Aplica paginación, búsqueda y muestra el estado de cada usuario.
async function cargarUsuarios() {
    const res = await fetch(`http://localhost:3000/api/usuarios?search=${encodeURIComponent(search)}&page=${pagina}&limit=${limite}`);
    const data = await res.json();
    const tbody = document.getElementById('usuariosBody');
    tbody.innerHTML = "";
    data.usuarios.forEach((u, idx) => {
        let estados = [];
        if (u.deshabilitado) estados.push('Deshabilitado');
        else estados.push('Habilitado');
        if (u.bloqueado) estados.push('Bloqueado');
        const estadosStr = estados.join(' / ');
        const zebra = idx % 2 === 0 ? 'bg-white' : 'bg-blue-50';

        tbody.innerHTML += `
            <tr class="${zebra}">
                <td class="px-4 py-2">${u.id_usuario}</td>
                <td class="px-4 py-2">${u.nombre}</td>
                <td class="px-4 py-2">
                    <div class="flex items-center gap-2">
                        <input type="password" readonly value="${u.pass}" class="bg-transparent focus:outline-none w-24" id="pass-${u.id_usuario}">
                        <button onclick="verPass('${u.id_usuario}')" class="hover:bg-gray-100 rounded-full p-1" title="Ver contraseña">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542 7z"/>
                            </svg>
                        </button>
                    </div>
                </td>
                <td class="px-4 py-2">${u.dni}</td>
                <td class="px-4 py-2">${u.rol}</td>
                <td class="px-4 py-2">${u.grupo}</td>
                <td class="px-4 py-2">${estadosStr}</td>
                <td class="px-4 py-2 text-center">
                    <button onclick="abrirModalAccionUsuario(${u.id_usuario}, '${u.nombre}', ${u.bloqueado}, ${u.deshabilitado})"
                        class="hover:bg-blue-100 p-2 rounded-full border border-blue-200" title="Opciones">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="3" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11.25 2.25c.38 0 .7.28.74.65l.01.1v.98c1.11.1 2.16.42 3.11.92l.7-.7a.75.75 0 0 1 1.13.98l-.07.08-.7.7a8.25 8.25 0 0 1 1.84 3.11l.98-.01a.75.75 0 0 1 .1 1.49l-.1.01-.98.01c-.1 1.11-.42 2.16-.92 3.11l.7.7a.75.75 0 0 1-.98 1.13l-.08-.07-.7-.7a8.25 8.25 0 0 1-3.11 1.84l.01.98a.75.75 0 0 1-1.49.1l-.01-.1-.01-.98a8.25 8.25 0 0 1-3.11-.92l-.7.7a.75.75 0 0 1-1.13-.98l.07-.08.7-.7a8.25 8.25 0 0 1-1.84-3.11l-.98.01a.75.75 0 0 1-.1-1.49l.1-.01.98-.01c.1-1.11.42-2.16.92-3.11l-.7-.7a.75.75 0 0 1 .98-1.13l.08.07.7.7a8.25 8.25 0 0 1 3.11-1.84l-.01-.98A.75.75 0 0 1 11.25 2.25z" />
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    });

    // Muestra el rango de usuarios y total en la paginación
    const paginacionInfo = document.getElementById('paginacionInfo');
    const inicio = (pagina - 1) * limite + 1;
    const fin = Math.min(pagina * limite, data.total);
    paginacionInfo.textContent = `Mostrando ${inicio} a ${fin} de ${data.total} usuarios`;

    // Deshabilita o habilita los botones de paginación según corresponda
    document.getElementById('prevBtn').disabled = pagina === 1;
    document.getElementById('nextBtn').disabled = pagina * limite >= data.total;
}

// ========== USUARIOS POR ROL ==========
// Obtiene la cantidad de usuarios por cada rol y los muestra en badges.
async function cargarUsuariosPorRol() {
    const res = await fetch('http://localhost:3000/api/usuarios/usuarios-por-rol');
    const data = await res.json();
    const contenedor = document.getElementById('usuariosPorRolContainer');
    contenedor.innerHTML = '';

    // Paleta de colores para los badges, puedes agregar más si tienes más roles
    const colores = [
        'bg-red-100 text-red-800',
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
        'bg-yellow-100 text-yellow-800',
        'bg-gray-100 text-gray-800'
    ];

    data.forEach((rol, idx) => {
        contenedor.innerHTML += `
            <div class="flex justify-between items-center">
                <span class="text-gray-600">${rol.nombre}:</span>
                <span class="font-semibold px-2 py-1 rounded ${colores[idx % colores.length]}">${rol.cantidad}</span>
            </div>
        `;
    });
}

// ========== ACCIONES DE PAGINADOR Y BUSCADOR ==========
// Botón de búsqueda y paginador para la tabla principal de usuarios.
document.getElementById('buscarBtn').onclick = function() {
    search = document.getElementById('buscador').value;
    pagina = 1;
    cargarUsuarios();
};

document.getElementById('limite').onchange = function() {
    limite = parseInt(this.value);
    pagina = 1;
    cargarUsuarios();
};

document.getElementById('prevBtn').onclick = function() {
    if (pagina > 1) {
        pagina--;
        cargarUsuarios();
    }
};

document.getElementById('nextBtn').onclick = function() {
    pagina++;
    cargarUsuarios();
};

// ========== LOGOUT ==========
// Elimina el usuario de la sesión y redirige a login.
document.getElementById('cerrarSesion').onclick = function() {
    localStorage.removeItem('usuario');
    window.location.href = "views/login.html";
};

// ========== FUNCIÓN CERRAR SESIÓN CON REGISTRO EN LOG ==========
// Redirige al login y registra el logout en la bitácora.
function cerrarSesion() {
    const usuarioStr = localStorage.getItem('usuario');
    const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : {};
    registrarLog(
        2, // id_operacion para logout
        `El usuario ${usuarioObj.id_usuario} cerró sesión`,
        usuarioObj.nombre
    );
    localStorage.removeItem('usuario');
    window.location.href = 'views/login.html';
}

// ========== VALIDACIÓN CONTRASEÑA ==========
// Verifica que la contraseña cumpla con los requisitos de seguridad.
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

// ========== MODAL ACCION USUARIO ==========
// Abre/cierra el modal para las acciones sobre el usuario seleccionado.
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

// ========== DESHABILITAR, HABILITAR, DESBLOQUEAR USUARIO ==========
// Ejecutan la acción de habilitar, deshabilitar o desbloquear usuario vía API y registran la acción en la bitácora.
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
                    8, // Usa el id_operacion correcto si tienes uno específico para desbloqueo
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

// ========== CAMBIAR CONTRASEÑA ==========
// Abre/cierra el modal para cambiar la contraseña y envía la petición al backend.
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


// Muestra el modal para buscar usuarios y cambiarles el rol.
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
// Busca usuarios por nombre/DNI para el modal de permisos.
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
// Carga el rol actual del usuario seleccionado y los posibles roles nuevos.
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

// CAMBIO DE ROL - Guarda el nuevo rol seleccionado para el usuario.
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
                9, // ID de operación para cambio de rol
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

// ========== GESTIONAR GRUPOS ==========
// Modal para buscar usuarios y cambiarles el grupo.
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
// Busca usuarios para el modal de grupos.
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
// Carga el grupo actual del usuario y los posibles grupos nuevos.
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

// Guarda el nuevo grupo seleccionado para el usuario.
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
                10, // Ajusta este número según tu tabla de operaciones
                `El usuario ${usuario.id_usuario} cambió el grupo del usuario ${usuarioSeleccionadoGrupos.id_usuario} (${usuarioSeleccionadoGrupos.nombre}) al grupo ${nombreGrupo}`,
                usuarioSeleccionadoGrupos.nombre
            );
            cerrarModalGestionarGrupos();
            cargarUsuarios && cargarUsuarios();
        } else {
            res.text().then(txt => alert('Error: ' + txt));
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

// ========== VER CONTRASEÑA SOLO ADMIN ==========
// Muestra el modal para ver la contraseña de un usuario (solo si el usuario logueado es admin).
function verPass(id_usuario) {
    usuarioVerPassId = id_usuario;
    document.getElementById('modalVerPass').style.display = 'flex';
    document.getElementById('formVerPass').reset();
}
function cerrarModalVerPass() {
    document.getElementById('modalVerPass').style.display = 'none';
    usuarioVerPassId = null;
}
document.getElementById('formVerPass').onsubmit = async function(e) {
    e.preventDefault();
    const usuarioAdmin = document.getElementById('verPassUsuario').value.trim();
    const password = document.getElementById('verPassPassword').value;
    try {
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
            cerrarModalVerPass();
            registrarLog(
                12,
                `El administrador ${usuarioAdmin} visualizó la contraseña del usuario ${usuarioVerPassId}`,
                usuarioVerPassId
            );
        } else {
            alert('Solo un administrador puede ver la contraseña.');
        }
    } catch (err) {
        alert('Error de red o credenciales incorrectas');
    }
};

// ========== LOG DE ACCESO AL APARTADO ==========
// Registra en la bitácora el acceso al apartado "Administración de Usuarios" al cargar la página.
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioStr = localStorage.getItem('usuario');
    let id_usuario = null;
    if (usuarioStr) {
        try {
            const usuarioObj = JSON.parse(usuarioStr);
            id_usuario = usuarioObj.id_usuario;
        } catch(e) {
            id_usuario = null;
        }
    }
    if (id_usuario) {
        await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_operacion: 11, // acceso_apartado
                id_usuario,
                ip: null,
                detalle: `El usuario ${id_usuario} accedió al apartado Administración de Usuarios`,
                usuario_afectado: null
            })
        });
    }
    cargarUsuarios();
    cargarUsuariosPorRol();
});

// ========== FUNCIÓN REGISTRAR LOG (REPETIDA) ==========
// Ya explicada arriba; registra una acción en la bitácora.
// (Puedes eliminar las funciones repetidas y dejar solo una versión.)
