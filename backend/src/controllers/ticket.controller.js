import { TicketModel } from "../models/ticket.model.js";

export const TicketController = {

    // =============================
    // ADMIN / SOPORTE → TODOS
    // =============================
    getAll: async (req, res) => {
        const tickets = await TicketModel.getAll();
        res.json(tickets);
    },

    // =============================
    // USUARIO → SUS TICKETS
    // =============================
    getByUser: async (req, res) => {
        const tickets = await TicketModel.getByUser(req.params.id);
        res.json(tickets);
    },

    // =============================
    // CREAR TICKET
    // =============================
    create: async (req, res) => {
        const id = await TicketModel.create(req.body);
        res.status(201).json({
        message: "Ticket creado",
        id
        });
    },

    // =============================
    // CAMBIAR ESTADO
    // =============================
    updateEstado: async (req, res) => {
        await TicketModel.updateEstado(
        req.params.id,
        req.body.estado
        );
        res.json({ message: "Estado actualizado" });
    },

    // =============================
    // ELIMINAR
    // =============================
    delete: async (req, res) => {
        await TicketModel.delete(req.params.id);
        res.json({ message: "Ticket eliminado" });
    }
};
