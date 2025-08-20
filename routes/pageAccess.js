// ========== PAGE ACCESS LOGGING ==========
// Register access to different modules in audit trail

// Function to register page access
async function registrarAccesoApartado(nombreApartado) {
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
                detalle: `El usuario ${id_usuario} accedió al apartado ${nombreApartado}`,
                usuario_afectado: null
            })
        });
    }
}

// Auto-register access when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Determine page name from URL or document title
    const path = window.location.pathname;
    let pageName = 'Página desconocida';
    
    if (path.includes('Cursos.html')) pageName = 'Cursos';
    else if (path.includes('GestionAcademica.html')) pageName = 'Gestión Académica';
    else if (path.includes('AlumnosOficina.html')) pageName = 'Oficina de Alumnos';
    else if (path.includes('Configuracion.html')) pageName = 'Configuración';
    else if (path.includes('index.html') || path === '/') pageName = 'Inicio';
    else if (path.includes('bitacora.html')) pageName = 'Bitácora';
    
    await registrarAccesoApartado(pageName);
});