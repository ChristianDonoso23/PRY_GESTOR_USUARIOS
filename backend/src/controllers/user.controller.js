import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";

export const UserController = {
    getAll: async (req, res) => {
        const users = await UserModel.getAll();
        res.json(users);
    },

    getById: async (req, res) => {
        const user = await UserModel.getById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    },

    create: async (req, res) => {
        const { nombre, correo, password, rol } = req.body;

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
        await UserModel.update(req.params.id, req.body);
        res.json({ message: "Usuario actualizado" });
    },

    delete: async (req, res) => {
        await UserModel.delete(req.params.id);
        res.json({ message: "Usuario eliminado" });
    }
};
