# PRY_GESTOR_USUARIOS

## Objetivos
El objetivo principal de este proyecto es desarrollar un sistema de gestión de usuarios y tickets de soporte, permitiendo la administración de usuarios con diferentes roles (Usuario, Soporte, Admin), la creación y gestión de tickets de soporte, y la implementación de autenticación segura.

## Descripción
PRY_GESTOR_USUARIOS es una aplicación web full-stack que permite gestionar usuarios y tickets de soporte. El backend está construido con Node.js y Express, utilizando una base de datos MySQL para el almacenamiento de datos. El frontend utiliza tecnologías web modernas como Lit para componentes web y Bootstrap para el diseño responsivo. La aplicación sigue la arquitectura MVC (Modelo-Vista-Controlador) para una separación clara de responsabilidades.

## Estructura del Proyecto
```
PRY_GESTOR_USUARIOS/
├── backend/                    # Servidor backend con Node.js
│   ├── package.json           # Dependencias y scripts del backend
│   ├── src/
│   │   ├── app.js             # Configuración principal de la aplicación Express
│   │   ├── server.js          # Punto de entrada del servidor
│   │   ├── auth/              # Módulos de autenticación
│   │   │   ├── auth.controller.js    # Controlador para login y registro
│   │   │   ├── auth.middleware.js    # Middleware para verificación de JWT
│   │   │   └── role.middleware.js    # Middleware para control de roles
│   │   ├── config/
│   │   │   └── db.js          # Configuración de conexión a MySQL
│   │   ├── controllers/       # Controladores MVC
│   │   │   ├── ticket.controller.js  # Lógica para gestión de tickets
│   │   │   └── user.controller.js    # Lógica para gestión de usuarios
│   │   ├── models/            # Modelos de datos
│   │   │   ├── ticket.model.js      # Modelo para tickets
│   │   │   └── user.model.js        # Modelo para usuarios
│   │   └── routes/            # Definición de rutas API
│   │       ├── auth.routes.js       # Rutas de autenticación
│   │       ├── ticket.routes.js     # Rutas para tickets
│   │       └── user.routes.js       # Rutas para usuarios
├── database/                  # Scripts de base de datos
│   └── gestion_usuarios.sql   # Esquema y datos iniciales de MySQL
├── frontend/                  # Aplicación frontend
│   ├── package.json           # Dependencias del frontend
│   ├── index.html             # Página principal
│   ├── public/                # Archivos estáticos
│   └── src/
│       ├── index.css          # Estilos globales
│       ├── my-element.js      # Componente raíz
│       ├── assets/            # Recursos adicionales
│       ├── components/        # Componentes web con Lit
│       │   ├── custom-alert.js      # Componente para alertas
│       │   ├── login-form.js        # Formulario de login
│       │   ├── ticket-app.js        # Aplicación principal de tickets
│       │   ├── ticket-form.js       # Formulario para crear/editar tickets
│       │   ├── ticket-list.js       # Lista de tickets
│       │   ├── user-app.js          # Aplicación principal de usuarios
│       │   ├── user-form.js         # Formulario para usuarios
│       │   └── user-list.js         # Lista de usuarios
│       ├── services/          # Servicios para API
│       │   ├── ticket.service.js    # Servicio para llamadas a tickets
│       │   └── user.service.js      # Servicio para llamadas a usuarios
│       └── vendor/            # Librerías de terceros
│           └── bootstrap/     # Framework CSS Bootstrap
└── README.md                  # Este archivo
```

## Tecnologías Utilizadas
- **Backend**: Node.js, Express.js, MySQL2
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Lit (para componentes web), Bootstrap
- **Autenticación**: JSON Web Tokens (JWT), bcryptjs para hashing de contraseñas
- **Base de Datos**: MySQL
- **Herramientas de Desarrollo**: Vite (para el frontend), Nodemon (para desarrollo backend)

## Conceptos Utilizados
- Arquitectura MVC (Modelo-Vista-Controlador)
- API RESTful
- Autenticación y autorización basada en JWT
- Hashing de contraseñas
- Componentes web con Lit
- Diseño responsivo con Bootstrap
- Separación de responsabilidades
- Middleware para control de acceso

## Pasos para Clonar y Ejecutar el Repositorio

### Prerrequisitos
- Node.js (versión 14 o superior)
- MySQL Server
- Git

### Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PRY_GESTOR_USUARIOS
   ```

2. **Configurar la base de datos:**
   - Crear una base de datos MySQL llamada `gestion_usuarios`
   - Ejecutar el script SQL:
     ```bash
     mysql -u root -p < database/gestion_usuarios.sql
     ```

3. **Configurar variables de entorno:**
   - En la carpeta `backend`, crear un archivo `.env` con:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=tu_usuario_mysql
     DB_PASSWORD=tu_contraseña_mysql
     DB_NAME=gestion_usuarios
     JWT_SECRET=tu_clave_secreta_jwt
     ```

4. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

5. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Ejecutar el backend:**
   ```bash
   cd backend
   npm run dev
   ```
   El servidor backend estará disponible en `http://localhost:3000`

7. **Ejecutar el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   La aplicación frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

## Información Adicional
Este proyecto sigue las mejores prácticas de programación, incluyendo:
- **Separación de responsabilidades**: Uso de la arquitectura MVC para mantener el código organizado y mantenible.
- **Seguridad**: Implementación de autenticación JWT, hashing de contraseñas con bcrypt, y validación de entrada.
- **Manejo de errores**: Middleware para manejo de errores y respuestas consistentes.
- **Código modular**: Organización en módulos reutilizables y componentes.
- **Documentación**: Comentarios en el código y este README detallado.
- **Control de versiones**: Uso de Git para el versionado del código.

La aplicación utiliza MySQL como base de datos relacional, con tablas para usuarios y tickets, incluyendo relaciones de clave foránea para mantener la integridad de los datos.