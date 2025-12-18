import { pool } from "../config/db.js";

export const UserModel = {
    getAll: async () => {
        const [rows] = await pool.query(
            "SELECT id, nombre, correo, rol, estado, fecha_creacion FROM usuarios"
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query(
            "SELECT id, nombre, correo, rol, estado FROM usuarios WHERE id = ?",
            [id]
        );
        return rows[0];
    },

    getByEmail: async (correo) => {
        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE correo = ? AND estado='Activo'",
            [correo]
        );
        return rows[0];
    },

    create: async (user) => {
        const { nombre, correo, password, rol } = user;

        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)",
            [nombre, correo, password, rol]
        );
        return result.insertId;
    },

    update: async (id, user) => {
        const { nombre, correo, rol, estado } = user;
        await pool.query(
            "UPDATE usuarios SET nombre=?, correo=?, rol=?, estado=? WHERE id=?",
            [nombre, correo, rol, estado, id]
        );
    },

    delete: async (id) => {
        await pool.query("DELETE FROM usuarios WHERE id=?", [id]);
    },

    getSoportesActivos: async () => {
    const [rows] = await pool.query(
        `SELECT id, nombre, correo
            FROM usuarios
            WHERE rol = 'Soporte' AND estado = 'Activo'
            ORDER BY nombre`
    );
    return rows;
},

};