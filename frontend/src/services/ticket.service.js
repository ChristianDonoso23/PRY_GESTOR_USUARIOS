const API_URL = "http://localhost:3000/tickets";

const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const TicketService = {
    getAll: async () => {
        const res = await fetch(API_URL, { headers: authHeader() });
        return res.json();
    },

    create: async (ticket) => {
        await fetch(API_URL, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(ticket)
        });
    },

    assign: async (id, soporteId) => {
        await fetch(`${API_URL}/${id}/asignar`, {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify({ asignado_a: soporteId })
        });
    },

    updateEstado: async (id, estado) => {
        await fetch(`${API_URL}/${id}/estado`, {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify({ estado })
        });
    },

    delete: async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: authHeader()
        });
    }
};
