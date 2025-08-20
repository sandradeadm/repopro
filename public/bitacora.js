document.addEventListener('DOMContentLoaded', async () => {
    // --- REGISTRO DE ACCESO ---
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

    // Chequeo para evitar doble registro
    if (id_usuario && !window.__logRegistrado) {
        window.__logRegistrado = true;  // Marca para no repetir
        await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_operacion: 11,
                id_usuario,
                ip: null,
                detalle: `El usuario ${id_usuario} accedió al apartado Bitacora`,
                usuario_afectado: null
            })
        });
    }

    // CÓDIGO PARA CARGAR Y MOSTRAR LOS LOGS 
    const tabla = document.querySelector('#tablaBitacora tbody');
    const noDatos = document.getElementById('noDatos');
    try {
        const response = await fetch('http://localhost:3000/api/logs');
        const logs = await response.json();
        if (!logs.length) {
            noDatos.classList.remove('hidden');
            return;
        }
        logs.forEach(log => {
            const fila = document.createElement('tr');
            fila.className = "border-b transition-colors data-[state=selected]:bg-muted hover:bg-gray-50";
            fila.innerHTML = `
                <td class="p-4 align-middle font-mono text-sm">${new Date(log.hora_y_fecha).toLocaleString()}</td>
                <td class="p-4 align-middle font-medium">${log.usuario || ''}</td>
                <td class="p-4 align-middle">${log.operacion || ''}</td>
                <td class="p-4 align-middle max-w-md"><p class="text-sm text-gray-600 truncate">${log.detalle || ''}</p></td>
                <td class="p-4 align-middle">${log.ip || ''}</td>
                <td class="p-4 align-middle">${log.mac || ''}</td>
                <td class="p-4 align-middle">${log.usuario_afectado || ''}</td>
            `;
            tabla.appendChild(fila);
        });
    } catch (e) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center text-red-500 p-4">Error al cargar los logs</td></tr>';
    }
});
