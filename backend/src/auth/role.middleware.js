export const role = (rol) => {
    return (req, res, next) => {
        if (req.user.rol !== rol) {
            return res.status(403).json({ message: "Acceso denegado" });
        }
        next();
    };
};
