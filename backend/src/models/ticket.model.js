import { pool } from "../config/db.js";

export const TicketModel = {
    create: async ({ titulo, descripcion, prioridad, creado_por }) => {
        const [result] = await pool.query(
        `INSERT INTO tickets (titulo, descripcion, prioridad, creado_por)
        VALUES (?, ?, ?, ?)`,
        [titulo, descripcion, prioridad, creado_por]
        );
        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await pool.query(
        `SELECT t.*
        FROM tickets t
        WHERE t.id = ?`,
        [id]
        );
        return rows[0];
    },

    getAllForAdmin: async () => {
        const [rows] = await pool.query(
        `SELECT 
            t.*,
            u.nombre AS creado_por_nombre,
            u.correo AS creado_por_correo,
            s.nombre AS asignado_a_nombre,
            s.correo AS asignado_a_correo
        FROM tickets t
        JOIN usuarios u ON u.id = t.creado_por
        LEFT JOIN usuarios s ON s.id = t.asignado_a
        ORDER BY t.fecha_creacion DESC`
        );
        return rows;
    },

    getAllForUsuario: async (userId) => {
        const [rows] = await pool.query(
        `SELECT 
            t.*,
            u.nombre AS creado_por_nombre,
            u.correo AS creado_por_correo,
            s.nombre AS asignado_a_nombre,
            s.correo AS asignado_a_correo
        FROM tickets t
        JOIN usuarios u ON u.id = t.creado_por
        LEFT JOIN usuarios s ON s.id = t.asignado_a
        WHERE t.creado_por = ?
        ORDER BY t.fecha_creacion DESC`,
        [userId]
        );
        return rows;
    },

    getAllForSoporte: async (soporteId) => {
        const [rows] = await pool.query(
        `SELECT 
            t.*,
            u.nombre AS creado_por_nombre,
            u.correo AS creado_por_correo,
            s.nombre AS asignado_a_nombre,
            s.correo AS asignado_a_correo
        FROM tickets t
        JOIN usuarios u ON u.id = t.creado_por
        LEFT JOIN usuarios s ON s.id = t.asignado_a
        WHERE t.asignado_a = ?
        ORDER BY t.fecha_creacion DESC`,
        [soporteId]
        );
        return rows;
    },

    assign: async (ticketId, soporteId) => {
        const [result] = await pool.query(
        `UPDATE tickets
        SET asignado_a = ?, estado = 'En Proceso'
        WHERE id = ?`,
        [soporteId, ticketId]
        );
        return result.affectedRows > 0;
    },

    updateEstado: async (ticketId, estado) => {
        const [result] = await pool.query(
        `UPDATE tickets
        SET estado = ?
        WHERE id = ?`,
        [estado, ticketId]
        );
        return result.affectedRows > 0;
    },

    delete: async (ticketId) => {
        const [result] = await pool.query(
        `DELETE FROM tickets WHERE id = ?`,
        [ticketId]
        );
        return result.affectedRows > 0;
    },

    // util: validar que el asignado_a sea Soporte activo
    findSoporteActivoById: async (id) => {
        const [rows] = await pool.query(
        `SELECT id, rol, estado
        FROM usuarios
        WHERE id = ? AND rol = 'Soporte' AND estado = 'Activo'`,
        [id]
        );
        return rows[0];
    }
};
