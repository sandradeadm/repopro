const express = require('express');
const router = express.Router();
const path = require('path');

// Función helper para renderizar con layout
function renderWithLayout(res, view, data = {}) {
    const layoutData = {
        ...data,
        view: view
    };
    res.render('layout', layoutData);
}

// Ruta para la página principal
router.get('/', (req, res) => {
    renderWithLayout(res, 'index', {
        title: 'E.E.S.T N°4 - Sistema de Administración',
        currentPage: 'index'
    });
});

// Ruta para login
router.get('/login', (req, res) => {
    res.render('login', { 
        title: 'Login - E.E.S.T N°4'
    });
});

// Ruta para Administración de Usuarios
router.get('/administracion-usuarios', (req, res) => {
    renderWithLayout(res, 'administracion-usuarios', {
        title: 'Administración de Usuarios - E.E.S.T N°4',
        currentPage: 'administracion-usuarios'
    });
});

// Ruta para Oficina de Alumnos
router.get('/alumnos-oficina', (req, res) => {
    renderWithLayout(res, 'alumnos-oficina', {
        title: 'Oficina de Alumnos - E.E.S.T N°4',
        currentPage: 'alumnos-oficina'
    });
});

// Ruta para Configuración
router.get('/configuracion', (req, res) => {
    renderWithLayout(res, 'configuracion', {
        title: 'Configuración - E.E.S.T N°4',
        currentPage: 'configuracion'
    });
});

// Ruta para Cursos
router.get('/cursos', (req, res) => {
    renderWithLayout(res, 'cursos', {
        title: 'Cursos - E.E.S.T N°4',
        currentPage: 'cursos'
    });
});

// Ruta para Gestión Académica
router.get('/gestion-academica', (req, res) => {
    renderWithLayout(res, 'gestion-academica', {
        title: 'Gestión Académica - E.E.S.T N°4',
        currentPage: 'gestion-academica'
    });
});

// Ruta para Bitácora
router.get('/bitacora', (req, res) => {
    renderWithLayout(res, 'bitacora', {
        title: 'Bitácora - E.E.S.T N°4',
        currentPage: 'bitacora'
    });
});

module.exports = router;