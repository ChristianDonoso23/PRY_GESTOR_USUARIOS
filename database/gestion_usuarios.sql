-- =====================================================
-- BASE DE DATOS
-- =====================================================
CREATE DATABASE IF NOT EXISTS gestion_usuarios;
USE gestion_usuarios;

-- =====================================================
-- TABLA USUARIOS
-- =====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,

    -- Contraseña en HASH (bcrypt)
    password VARCHAR(255) NOT NULL,

    rol ENUM('Usuario','Soporte','Admin')
        NOT NULL DEFAULT 'Usuario',

    estado ENUM('Activo','Inactivo')
        NOT NULL DEFAULT 'Activo',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA TICKETS
-- =====================================================
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,

    estado ENUM('Abierto','En Proceso','Cerrado')
        NOT NULL DEFAULT 'Abierto',

    prioridad ENUM('Baja','Media','Alta')
        NOT NULL DEFAULT 'Media',

    -- Usuario solicitante
    creado_por INT NOT NULL,

    -- Usuario soporte asignado (NULL al inicio)
    asignado_a INT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_creador
        FOREIGN KEY (creado_por)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ticket_asignado
        FOREIGN KEY (asignado_a)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
);

-- =====================================================
-- TABLA RESPUESTAS DE TICKETS
-- =====================================================
CREATE TABLE ticket_respuestas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    ticket_id INT NOT NULL,
    usuario_id INT NOT NULL,

    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_respuesta_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_respuesta_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
);