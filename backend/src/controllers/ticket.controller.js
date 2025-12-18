import { TicketModel } from "../models/ticket.model.js";

const ESTADOS_VALIDOS = new Set(["Abierto", "En Proceso", "Cerrado"]);
const PRIORIDADES_VALIDAS = new Set(["Baja", "Media", "Alta"]);

export const TicketController = {
    // POST /tickets
    create: async (req, res) => {
        try {
        const { titulo, descripcion, prioridad } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({ message: "Título y descripción son obligatorios" });
        }
        if (prioridad && !PRIORIDADES_VALIDAS.has(prioridad)) {
            return res.status(400).json({ message: "Prioridad inválida" });
        }

        const id = await TicketModel.create({
            titulo,
            descripcion,
            prioridad: prioridad || "Media",
            creado_por: req.user.id
        });

        res.status(201).json({ message: "Ticket creado", id });
        } catch (err) {
        res.status(500).json({ message: "Error creando ticket", error: err.message });
        }
    },

    // GET /tickets
    getAll: async (req, res) => {
        try {
        const { id, rol } = req.user;

        if (rol === "Admin") {
            const rows = await TicketModel.getAllForAdmin();
            return res.json(rows);
        }

        if (rol === "Soporte") {
            const rows = await TicketModel.getAllForSoporte(id);
            return res.json(rows);
        }

        // Usuario
        const rows = await TicketModel.getAllForUsuario(id);
        return res.json(rows);
        } catch (err) {
        res.status(500).json({ message: "Error listando tickets", error: err.message });
        }
    },

    // PUT /tickets/:id/asignar  (Admin)
    assign: async (req, res) => {
        try {
        const ticketId = Number(req.params.id);
        const { asignado_a } = req.body; // id soporte

        if (!ticketId || !asignado_a) {
            return res.status(400).json({ message: "ticketId y asignado_a son obligatorios" });
        }

        const soporte = await TicketModel.findSoporteActivoById(asignado_a);
        if (!soporte) {
            return res.status(400).json({ message: "El usuario asignado debe ser Soporte Activo" });
        }

        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const ok = await TicketModel.assign(ticketId, asignado_a);
        if (!ok) return res.status(400).json({ message: "No se pudo asignar el ticket" });

        res.json({ message: "Ticket asignado a soporte y marcado En Proceso" });
        } catch (err) {
        res.status(500).json({ message: "Error asignando ticket", error: err.message });
        }
    },

    // PUT /tickets/:id/estado  (Admin o Soporte)
    updateEstado: async (req, res) => {
        try {
        const ticketId = Number(req.params.id);
        const { estado } = req.body;

        if (!ticketId || !estado) {
            return res.status(400).json({ message: "ticketId y estado son obligatorios" });
        }
        if (!ESTADOS_VALIDOS.has(estado)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        // Soporte solo puede tocar si está asignado a él
        if (req.user.rol === "Soporte" && ticket.asignado_a !== req.user.id) {
            return res.status(403).json({ message: "No puedes modificar un ticket no asignado a ti" });
        }

        const ok = await TicketModel.updateEstado(ticketId, estado);
        if (!ok) return res.status(400).json({ message: "No se pudo actualizar el estado" });

        res.json({ message: "Estado actualizado" });
        } catch (err) {
        res.status(500).json({ message: "Error actualizando estado", error: err.message });
        }
    },

    // DELETE /tickets/:id (Admin)
    delete: async (req, res) => {
        try {
        const ticketId = Number(req.params.id);
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

        const ok = await TicketModel.delete(ticketId);
        if (!ok) return res.status(400).json({ message: "No se pudo eliminar" });

        res.json({ message: "Ticket eliminado" });
        } catch (err) {
        res.status(500).json({ message: "Error eliminando ticket", error: err.message });
        }
    }
};
