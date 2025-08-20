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

// Servir archivos estáticos desde la carpeta 'views'
app.use('/views', express.static(path.join(__dirname, 'views')));

// Servir archivos JavaScript desde la carpeta 'routes' como scripts
// Filter out non-router files
app.use('/js', (req, res, next) => {
  const allowedJSFiles = [
    'accionesUsuario.js', 'api.js', 'auth.js', 'cambiarPassword.js', 'grupos.js', 
    'gruposGestion.js', 'init.js', 'log.js', 'loginPasswordChange.js', 
    'loginPasswordToggle.js', 'logout.js', 'modals.js', 'nuevoUsuario.js', 
    'pageAccess.js', 'pageProtection.js', 'pagination.js', 'password.js', 
    'permisos.js', 'permissions.js', 'prueba.js', 'roles.js', 'session.js', 
    'userActions.js', 'usuariosFrontend.js', 'utils.js', 'validation.js', 'variables.js', 'verPass.js'
  ];
  
  const filename = path.basename(req.path);
  if (allowedJSFiles.includes(filename)) {
    express.static(path.join(__dirname, 'routes'), {
      setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
          res.set('Content-Type', 'application/javascript');
        }
      }
    })(req, res, next);
  } else {
    res.status(404).send('Not found');
  }
});

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
