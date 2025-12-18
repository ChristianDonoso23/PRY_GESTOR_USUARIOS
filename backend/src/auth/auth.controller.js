import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const login = async (req, res) => {
    const { correo, password } = req.body;

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
};
