const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Habilitar CORS para permitir peticiones desde Live Server (localhost:5500)
app.use(cors());

// Parsear cuerpos JSON
app.use(express.json());

// Importar rutas de vistas ANTES de los archivos estáticos
const viewsRouter = require('./routes/views');
app.use('/', viewsRouter);

// Importar rutas de API
const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

const logsRouter = require('./routes/logs');
app.use('/api', logsRouter);

// Servir archivos estáticos desde la carpeta 'public' DESPUÉS de las rutas dinámicas
app.use(express.static(path.join(__dirname, 'public')));

// Puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
