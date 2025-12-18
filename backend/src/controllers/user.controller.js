import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";

export const UserController = {
    getAll: async (req, res) => {
        /* Lista todos los usuarios */
        const users = await UserModel.getAll();
        res.json(users);
    },

    getById: async (req, res) => {
        /* Obtiene un usuario por id */
        const user = await UserModel.getById(req.params.id);
        /* Responde 404 si no existe */
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    },

    create: async (req, res) => {
        /* Crea un usuario nuevo */
        const { nombre, correo, password, rol } = req.body;

        /* Hashea la contraseña antes de guardar */
        const hash = await bcrypt.hash(password, 10);
        const id = await UserModel.create({
            nombre,
            correo,
            password: hash,
            rol
        });

        res.status(201).json({ message: "Usuario creado", id });
    },

    update: async (req, res) => {
        /* Actualiza datos del usuario por id */
        await UserModel.update(req.params.id, req.body);
        res.json({ message: "Usuario actualizado" });
    },

    delete: async (req, res) => {
        /* Elimina un usuario por id */
        await UserModel.delete(req.params.id);
        res.json({ message: "Usuario eliminado" });
    },

    getSoportes: async (req, res) => {
        try {
            const soportes = await UserModel.getSoportesActivos();
            res.json(soportes);
        } catch (err) {
            res.status(500).json({ message: "Error obteniendo soportes" });
        }
    },
};
