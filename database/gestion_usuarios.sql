-- =====================================================
-- BASE DE DATOS
-- =====================================================
CREATE DATABASE IF NOT EXISTS gestion_usuarios;
USE gestion_usuarios;

-- =====================================================
-- TABLA USUARIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('Usuario','Soporte','Admin') NOT NULL DEFAULT 'Usuario',
    estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA TICKETS
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('Abierto','En Proceso','Cerrado') NOT NULL DEFAULT 'Abierto',
    prioridad ENUM('Baja','Media','Alta') NOT NULL DEFAULT 'Media',
    usuario_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- =====================================================
-- TABLA RESPUESTAS DE TICKETS
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_respuestas (
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
        ON DELETE CASCADE
);