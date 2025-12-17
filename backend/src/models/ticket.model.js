import { pool } from "../config/db.js";

export const TicketModel = {

    // =============================
    // OBTENER TODOS LOS TICKETS
    // =============================
    getAll: async () => {
        const [rows] = await pool.query(`
        SELECT t.*, u.nombre AS usuario
        FROM tickets t
        JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY t.fecha_creacion DESC
        `);
        return rows;
    },

    // =============================
    // OBTENER TICKETS POR USUARIO
    // =============================
    getByUser: async (userId) => {
        const [rows] = await pool.query(
        "SELECT * FROM tickets WHERE usuario_id = ?",
        [userId]
        );
        return rows;
    },

    // =============================
    // CREAR TICKET
    // =============================
    create: async (ticket) => {
        const { titulo, descripcion, prioridad, usuario_id } = ticket;
        const [result] = await pool.query(
        `INSERT INTO tickets (titulo, descripcion, prioridad, usuario_id)
        VALUES (?, ?, ?, ?)`,
        [titulo, descripcion, prioridad, usuario_id]
        );
        return result.insertId;
    },

    // =============================
    // CAMBIAR ESTADO
    // =============================
    updateEstado: async (id, estado) => {
        await pool.query(
        "UPDATE tickets SET estado = ? WHERE id = ?",
        [estado, id]
        );
    },

    // =============================
    // ELIMINAR TICKET
    // =============================
    delete: async (id) => {
        await pool.query("DELETE FROM tickets WHERE id = ?", [id]);
    }
};
