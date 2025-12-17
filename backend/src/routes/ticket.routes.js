import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";

const router = Router();

// ADMIN / SOPORTE
router.get("/", TicketController.getAll);

// USUARIO
router.get("/user/:id", TicketController.getByUser);

// CREAR TICKET
router.post("/", TicketController.create);

// CAMBIAR ESTADO
router.put("/:id", TicketController.updateEstado);

// ELIMINAR
router.delete("/:id", TicketController.delete);

export default router;
