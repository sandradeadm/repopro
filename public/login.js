// PRUEBAS (BORRAR)
fetch('http://localhost:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
})
.then(res => res.json())
.then(res => {
    if (res.success) {
        localStorage.setItem('usuario', JSON.stringify(res.user));
        registrarLog(
            1, // id_operacion para login
            `El usuario ${res.user.id_usuario} inició sesión`,
            res.user.nombre
        );
        window.location.href = 'inicio.html';
    } else {
        // mostrar error...
    }
});