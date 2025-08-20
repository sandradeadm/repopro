# E.E.S.T N°4 - Sistema Dinámico de Administración

## Descripción

Sistema dinámico de administración escolar convertido desde una aplicación estática a una aplicación MVC (Modelo-Vista-Controlador) dinámica usando Express.js y EJS.

## Estructura del Proyecto

### Estructura Dinámica (Nueva)
```
/
├── app.js                 # Servidor principal de Express
├── package.json           # Dependencias y configuración
├── views/                 # Plantillas EJS (vistas dinámicas)
│   ├── layout.ejs        # Plantilla base con header y navegación
│   ├── index.ejs         # Página principal
│   ├── login.ejs         # Página de login
│   ├── administracion-usuarios.ejs
│   ├── alumnos-oficina.ejs
│   ├── configuracion.ejs
│   ├── cursos.ejs
│   ├── gestion-academica.ejs
│   └── bitacora.ejs
├── routes/               # Rutas del servidor
│   ├── views.js         # Rutas para las vistas
│   ├── usuarios.js      # API de usuarios
│   └── logs.js          # API de logs
└── public/              # Archivos estáticos
    ├── backup-html/     # HTML originales (respaldo)
    ├── js/             # JavaScript del cliente
    └── estilos escuela/ # Imágenes y estilos

```

### Funcionalidades

#### ✅ Implementado
- ✅ Motor de plantillas EJS configurado
- ✅ Rutas dinámicas para todas las páginas
- ✅ Layout compartido con navegación
- ✅ Resaltado del menú activo
- ✅ Protección de sesión
- ✅ API REST existente mantenida
- ✅ Estilos y funcionalidad preservados

#### 🔧 Rutas Disponibles
- `GET /` - Página principal
- `GET /login` - Página de login
- `GET /administracion-usuarios` - Administración de usuarios
- `GET /alumnos-oficina` - Oficina de alumnos
- `GET /configuracion` - Configuración del sistema
- `GET /cursos` - Gestión de cursos
- `GET /gestion-academica` - Gestión académica
- `GET /bitacora` - Bitácora del sistema

#### 🔧 APIs Mantenidas
- `POST /api/usuarios/login` - Login de usuarios
- `GET /api/usuarios` - Lista de usuarios
- `GET /api/logs` - Logs del sistema
- Todas las APIs existentes funcionan igual

## Instalación y Ejecución

### Prerrequisitos
- Node.js (v14 o superior)
- PostgreSQL (base de datos)

### Instalación
```bash
npm install
```

### Ejecución
```bash
npm start
# o
node app.js
```

El servidor se ejecutará en `http://localhost:3000`

## Características Técnicas

### Tecnologías Utilizadas
- **Express.js 5.1.0** - Framework web
- **EJS 3.1.10** - Motor de plantillas
- **PostgreSQL** - Base de datos
- **Tailwind CSS** - Framework CSS
- **CORS** - Manejo de CORS

### Ventajas de la Nueva Estructura
1. **Dinámico**: Generación de contenido en tiempo real
2. **Mantenible**: Código DRY con plantillas reutilizables
3. **Escalable**: Fácil agregar nuevas páginas y funcionalidades
4. **SEO Amigable**: Renderizado del lado del servidor
5. **Estructura MVC**: Separación clara de responsabilidades

### Navegación
- **Header común**: Logo y información de usuario
- **Navegación**: Menú horizontal con resaltado de página activa
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Protección**: Redirección automática a login si no hay sesión

## Migración Realizada

### De Estático a Dinámico
1. **HTML → EJS**: Convertidos archivos HTML a plantillas EJS
2. **Navegación**: Links actualizados para usar rutas dinámicas
3. **Layout**: Creado layout común para evitar duplicación
4. **Rutas**: Configuradas rutas Express para cada página
5. **Servidor**: Express configurado con EJS y archivos estáticos

### Archivos Originales
Los archivos HTML originales se mantienen en `public/backup-html/` como respaldo.

## Desarrollo

### Agregar Nueva Página
1. Crear vista EJS en `views/nueva-pagina.ejs`
2. Agregar ruta en `routes/views.js`
3. Actualizar navegación en `views/layout.ejs` si es necesario

### Estructura de Vista EJS
```ejs
<div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Título</h1>
        <p class="text-gray-600">Descripción</p>
    </div>
    <!-- Contenido de la página -->
</div>

<!-- Scripts específicos -->
<script src="js/mi-script.js"></script>
```

## Soporte

Para soporte técnico, contactar al equipo de desarrollo.

---

**Sistema desarrollado para E.E.S.T N°4 Prof. Ricardo A. López**  
**Versión 2.0.1 - Arquitectura Dinámica**

### Referencia Original
Original: https://felivasquez.github.io/Sist.-gestion-de-alumnosv2/
