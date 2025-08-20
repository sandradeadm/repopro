const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilitar CORS para permitir peticiones desde Live Server (localhost:5500)
app.use(cors());

// Parsear cuerpos JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas (asegúrate que usuarios.js exporta el router)
const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);

// Puerto
const PORT = 3000;

const logsRouter = require('./routes/logs');
app.use('/api', logsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
