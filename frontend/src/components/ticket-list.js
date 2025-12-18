import { LitElement, html, css } from 'lit';
import { TicketService } from '../services/ticket.service.js';

export class TicketList extends LitElement {
    static properties = {
        tickets: { type: Array }
    };

    // Estilos propios + Bootstrap inyectado en el render
    static styles = css`
        :host { display: block; }
        .pointer { cursor: pointer; }
    `;

    constructor() {
        super();
        this.tickets = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadTickets();
    }

    async loadTickets() {
        try {
            this.tickets = await TicketService.getAll();
        } catch (error) {
            console.error("Error cargando tickets:", error);
        }
    }

    async deleteTicket(id) {
        if (confirm('¿Estás seguro de eliminar este ticket?')) {
            await TicketService.delete(id);
            this.loadTickets(); // Recargar la lista
        }
    }

    // Helpers para obtener colores de Bootstrap según el valor
    getPriorityColor(prioridad) {
        switch(prioridad) {
            case 'Alta': return 'danger';   // Rojo
            case 'Media': return 'warning'; // Amarillo
            case 'Baja': return 'success';  // Verde
            default: return 'secondary';
        }
    }

    getStatusColor(estado) {
        switch(estado) {
            case 'Abierto': return 'primary';    // Azul
            case 'En Proceso': return 'info';    // Cian
            case 'Cerrado': return 'secondary';  // Gris
            default: return 'light';
        }
    }

    render() {
        return html`
        <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

        <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3><i class="bi bi-ticket-detailed"></i> Gestión de Tickets</h3>
                <button class="btn btn-primary" 
                    @click=${() => this.dispatchEvent(new CustomEvent('new-ticket', { bubbles: true, composed: true }))}>
                    <i class="bi bi-plus-circle"></i> Nuevo Ticket
                </button>
            </div>

            <div class="table-responsive card shadow-sm">
                <table class="table table-hover mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Usuario</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th class="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.tickets.map(ticket => html`
                        <tr>
                            <td>${ticket.id}</td>
                            <td class="fw-bold">${ticket.titulo}</td>
                            <td>${ticket.usuario || ticket.usuario_id}</td> 
                            <td>
                                <span class="badge bg-${this.getPriorityColor(ticket.prioridad)}">
                                    ${ticket.prioridad}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-${this.getStatusColor(ticket.estado)}">
                                    ${ticket.estado}
                                </span>
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-1"
                                    @click=${() => this.dispatchEvent(new CustomEvent('edit-ticket', { 
                                        detail: ticket, 
                                        bubbles: true, 
                                        composed: true 
                                    }))}>
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger"
                                    @click=${() => this.deleteTicket(ticket.id)}>
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        `)}
                    </tbody>
                </table>
                ${this.tickets.length === 0 ? html`<div class="p-3 text-center text-muted">No hay tickets registrados.</div>` : ''}
            </div>
        </div>
        `;
    }
}

customElements.define('ticket-list', TicketList);