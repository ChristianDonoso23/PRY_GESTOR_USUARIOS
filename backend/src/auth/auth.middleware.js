import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    /* Verifica la existencia del encabezado de autorización y maneja errores */
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "No autorizado" });
    }

    /* Extrae el token del encabezado de autorización */
    const token = header.split(" ")[1];

    try {
        /* Verifica y decodifica el token, asignando el usuario a la solicitud */
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        /* Maneja el error si el token es inválido */
        res.status(401).json({ message: "Token inválido" });
    }
};
