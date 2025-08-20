// Muestra la cantidad de usuarios por cada rol
async function cargarUsuariosPorRol() {
    const res = await fetch('http://localhost:3000/api/usuarios/usuarios-por-rol');
    const data = await res.json();
    const contenedor = document.getElementById('usuariosPorRolContainer');
    contenedor.innerHTML = '';
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