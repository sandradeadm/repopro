const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilitar CORS para permitir peticiones desde Live Server (localhost:5500)
app.use(cors());

// Parsear cuerpos JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public' (remaining assets)
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos desde 'estilos escuela' (images, css, etc)
app.use('/estilos escuela', express.static(path.join(__dirname, 'estilos escuela')));

// Import routes
const indexRouter = require('./routes/index');
const staticRouter = require('./routes/static');
const usuariosRouter = require('./routes/usuarios');
const logsRouter = require('./routes/logs');

// Use routes
app.use('/', indexRouter);  // Serve views from routes
app.use('/', staticRouter); // Serve scripts from routes
app.use('/api/usuarios', usuariosRouter);
app.use('/api', logsRouter);

// Puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
