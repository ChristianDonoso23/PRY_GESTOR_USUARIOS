import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import { auth } from "../auth/auth.middleware.js";
import { role } from "../auth/role.middleware.js";

const router = Router();

// Crear ticket: Admin y Usuario
router.post("/", auth, (req, res, next) => {
    const r = req.user.rol;
    if (r !== "Admin" && r !== "Usuario") {
        return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
}, TicketController.create);

// Listar tickets (filtrado por rol en el controller)
router.get("/", auth, TicketController.getAll);

// Asignar ticket: solo Admin
router.put("/:id/asignar", auth, role("Admin"), TicketController.assign);

// Cambiar estado: Admin o Soporte (validación extra en controller)
router.put("/:id/estado", auth, (req, res, next) => {
    const r = req.user.rol;
    if (r !== "Admin" && r !== "Soporte") {
        return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
}, TicketController.updateEstado);

// Eliminar ticket: solo Admin (opcional)
router.delete("/:id", auth, role("Admin"), TicketController.delete);

export default router;
