// Obtiene la lista de usuarios y los pinta en la tabla principal
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
                        <button onclick="verPass('${u.id_usuario}', '${u.nombre}')" class="hover:bg-gray-100 rounded-full p-1" title="Ver contraseña">
                            <!-- SVG -->
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
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M11.25 2.25c.38 0 .7.28.74.65l.01.1v.98c1.11.1 2.16.42 3.11.92l.7-.7a.75.75 0 0 1 1.13.98l-.07.08-.7.7a8.25 8.25 0 0 1 1.84 3.11l.98-.01a.75.75 0 0 1 .1 1.49l-.1.01-.98.01c-.1 1.11-.42 2.16-.92 3.11l.7.7a.75.75 0 0 1-.98 1.13l-.08-.07-.7-.7a8.25 8.25 0 0 1-3.11 1.84l.01.98a.75.75 0 0 1-1.49.1l-.01-.1-.01-.98a8.25 8.25 0 0 1-3.11-.92l-.7.7a.75.75 0 0 1-1.13-.98l.07-.08.7-.7a8.25 8.25 0 0 1-1.84-3.11l-.98.01a.75.75 0 0 1-.1-1.49l.1-.01.98-.01c.1-1.11.42-2.16.92-3.11l-.7-.7a.75.75 0 0 1 .98-1.13l.08.07.7.7a8.25 8.25 0 0 1 3.11-1.84l-.01-.98A.75.75 0 0 1 11.25 2.25z" />
</svg>

                    </button>
                </td>
            </tr>
        `;
    });

    // Actualiza paginación
    const paginacionInfo = document.getElementById('paginacionInfo');
    const inicio = (pagina - 1) * limite + 1;
    const fin = Math.min(pagina * limite, data.total);
    paginacionInfo.textContent = `Mostrando ${inicio} a ${fin} de ${data.total} usuarios`;

    document.getElementById('prevBtn').disabled = pagina === 1;
    document.getElementById('nextBtn').disabled = pagina * limite >= data.total;
}