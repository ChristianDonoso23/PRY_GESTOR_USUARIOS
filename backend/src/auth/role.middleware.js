/* Middleware de autorización por rol */
export const role = (rol) => {
    return (req, res, next) => {
        /* Verifica que el usuario tenga el rol requerido */
        if (req.user.rol !== rol) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    };
};
