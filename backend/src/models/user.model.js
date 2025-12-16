import { pool } from "../config/db.js";

export const UserModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT * FROM usuarios");
        return rows;
},

    getById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
            id,
    ]);
    return rows[0];
},

create: async (user) => {
    const { nombre, correo, rol, estado } = user;
    const [result] = await pool.query(
        "INSERT INTO usuarios (nombre, correo, rol, estado) VALUES (?, ?, ?, ?)",
        [nombre, correo, rol, estado]
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
};
