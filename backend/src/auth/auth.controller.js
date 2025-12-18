import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const user = await UserModel.getByEmail(correo);
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// =========================
// REGISTER (ROL USUARIO)
// =========================
export const register = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const existe = await UserModel.getByEmail(correo);
        if (existe) {
            return res.status(409).json({ message: "Correo ya registrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        await UserModel.createFromRegister({
            nombre,
            correo,
            password: hash
        });

        res.status(201).json({
            message: "Usuario registrado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
