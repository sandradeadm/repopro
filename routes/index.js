const express = require('express');
const path = require('path');
const router = express.Router();

// Serve index page from routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Serve other view pages
router.get('/administracion-usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/AdministracionUsuarios.html'));
});

router.get('/bitacora', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/bitacora.html'));
});

router.get('/configuracion', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/Configuracion.html'));
});

router.get('/cursos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/Cursos.html'));
});

router.get('/gestion-academica', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/GestionAcademica.html'));
});

router.get('/alumnos-oficina', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/AlumnosOficina.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

module.exports = router;