import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

/* Función para manejar el inicio de sesión de un usuario */
export const login = async (req, res) => {
    /* Extrae el correo y la contraseña del cuerpo de la solicitud */
    const { correo, password } = req.body;

    /* Busca al usuario en la base de datos por su correo */
    const user = await UserModel.getByEmail(correo);
    if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    /* Compara la contraseña proporcionada con la almacenada en la base de datos */
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    /* Genera un token JWT con el id y rol del usuario */
    const token = jwt.sign(
        { id: user.id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    /* Devuelve el token y la información del usuario */
    res.json({
        token,
        user: {
            id: user.id,
            nombre: user.nombre,
            rol: user.rol
        }
    });
};
