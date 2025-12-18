import { LitElement, html, css } from 'lit';
import { TicketService } from '../services/ticket.service.js';
import './custom-alert.js'; // Reutilizamos tu alerta

export class TicketList extends LitElement {
    static properties = {
        tickets: { state: true },
        currentUser: { type: Object }, // Recibimos el usuario logueado
        filterText: { state: true },   // Para buscar por nombre
        filterPriority: { state: true } // Para ordenar
    };

    static styles = css`
        :host { display: block; }
        .pointer { cursor: pointer; }
        .actions-col { min-width: 120px; }
        /* Efecto hover suave para las filas */
        tbody tr { transition: background-color 0.2s; }
        tbody tr:hover { background-color: rgba(0,0,0,0.02); }
    `;

    constructor() {
        super();
        this.tickets = [];
        this.currentUser = null;
        this.filterText = '';
        this.filterPriority = 'Todas';
    }

    connectedCallback() {
        super.connectedCallback();
        // Cargar tickets al iniciar
        this.loadTickets();
    }

    // Detectar si cambia el usuario (ej: en la simulación) para recargar datos correctos
    updated(changedProps) {
        if (changedProps.has('currentUser')) {
            this.loadTickets();
        }
    }

    showNotification(msg, type) {
        const alert = this.shadowRoot.querySelector('custom-alert');
        if (alert) alert.showAlert(msg, type);
    }

    async loadTickets() {
        if (!this.currentUser) return;

        try {
            let data = [];
            
            // Lógica de carga según ROL
            if (this.currentUser.rol === 'Usuario') {
                // El usuario solo ve SUS tickets
                // Asumiendo que tienes un endpoint getByUser en el backend
                // Si no, traemos todos y filtramos (menos eficiente pero funcional para demo)
                // data = await TicketService.getByUser(this.currentUser.id); 
                // Usaremos getAll y filter por ahora para asegurar compatibilidad con tu servicio actual:
                const all = await TicketService.getAll();
                data = all.filter(t => t.usuario_id == this.currentUser.id);
            } else {
                // Admin y Soporte ven TODOS
                data = await TicketService.getAll();
            }
            this.tickets = data;
        } catch (error) {
            console.error("Error cargando tickets:", error);
            this.showNotification("Error de conexión con el servidor", "danger");
        }
    }

    // --- ACCIONES CRUD ---

    async deleteTicket(id) {
        if (confirm('¿Confirma eliminación definitiva del ticket?')) {
            try {
                await TicketService.delete(id);
                this.showNotification('Ticket eliminado', 'success');
                this.loadTickets();
            } catch (e) {
                this.showNotification('No se pudo eliminar', 'danger');
            }
        }
    }

    async markAsSolved(ticket) {
        try {
            // Solo cambiamos estado a Cerrado
            await TicketService.update(ticket.id, { 
                ...ticket, 
                estado: 'Cerrado' 
            });
            this.showNotification('Ticket marcado como RESUELTO', 'success');
            this.loadTickets();
        } catch (e) {
            this.showNotification('Error al actualizar estado', 'danger');
        }
    }

    // --- GETTERS INTELIGENTES ---

    get filteredTickets() {
        let filtered = [...this.tickets];

        // 1. Filtro por Nombre de Usuario (Búsqueda)
        if (this.filterText) {
            const term = this.filterText.toLowerCase();
            filtered = filtered.filter(t => 
                (t.usuario && t.usuario.toLowerCase().includes(term)) || 
                t.titulo.toLowerCase().includes(term)
            );
        }

        // 2. Ordenamiento por Prioridad
        // Mapa de valor para ordenar correctamente (Alta > Media > Baja)
        const priorityVal = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
        
        if (this.filterPriority === 'Alta') {
            filtered.sort((a, b) => priorityVal[b.prioridad] - priorityVal[a.prioridad]);
        } else if (this.filterPriority === 'Baja') {
            filtered.sort((a, b) => priorityVal[a.prioridad] - priorityVal[b.prioridad]);
        }

        return filtered;
    }

    // --- HELPERS DE UI ---
    
    getPriorityColor(p) {
        return { 'Alta': 'danger', 'Media': 'warning', 'Baja': 'success' }[p] || 'secondary';
    }

    getStatusColor(s) {
        return { 'Abierto': 'primary', 'En Proceso': 'info', 'Cerrado': 'secondary' }[s] || 'light';
    }

    // --- RENDERIZADO DE ACCIONES SEGÚN ROL ---
    renderActions(ticket) {
        const rol = this.currentUser?.rol;
        const isClosed = ticket.estado === 'Cerrado';

        // ADMIN: Todo poder
        if (rol === 'Admin') {
            return html`
                <button class="btn btn-sm btn-outline-primary" title="Editar"
                    @click=${() => this.dispatchEvent(new CustomEvent('edit-ticket', { detail: ticket, bubbles: true, composed: true }))}>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" title="Eliminar"
                    @click=${() => this.deleteTicket(ticket.id)}>
                    <i class="bi bi-trash"></i>
                </button>
            `;
        }

        // SOPORTE: Marcar hecho + Ver (No editar contenido, No borrar)
        if (rol === 'Soporte') {
            return html`
                <button class="btn btn-sm btn-outline-success" title="Marcar como Resuelto"
                    ?disabled=${isClosed}
                    @click=${() => this.markAsSolved(ticket)}>
                    <i class="bi bi-check-lg"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="Ver Detalle"
                    @click=${() => this.dispatchEvent(new CustomEvent('edit-ticket', { detail: ticket, bubbles: true, composed: true }))}>
                    <i class="bi bi-eye"></i>
                </button>
            `;
        }

        // USUARIO: Editar (si no está cerrado)
        if (rol === 'Usuario') {
            return html`
                <button class="btn btn-sm btn-outline-primary" title="Editar mi ticket"
                    ?disabled=${isClosed}
                    @click=${() => this.dispatchEvent(new CustomEvent('edit-ticket', { detail: ticket, bubbles: true, composed: true }))}>
                    <i class="bi bi-pencil"></i>
                </button>
            `;
        }
    }

    render() {
        const rol = this.currentUser?.rol || 'Invitado';
        
        return html`
        <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        
        <custom-alert></custom-alert>

        <div class="container mt-4">
            
            <div class="d-flex justify-content-between align-items-end mb-3">
                <div>
                    <h3 class="mb-0"><i class="bi bi-ticket-detailed"></i> Gestión de Tickets</h3>
                    <small class="text-muted">Vista de rol: <strong>${rol}</strong></small>
                </div>
                
                ${rol !== 'Soporte' && rol !== 'Admin' ? html`
                    <button class="btn btn-primary" 
                        @click=${() => this.dispatchEvent(new CustomEvent('new-ticket', { bubbles: true, composed: true }))}>
                        <i class="bi bi-plus-circle"></i> Nuevo Ticket
                    </button>
                ` : ''}
            </div>

            <div class="card p-3 mb-3 bg-light border-0 shadow-sm">
                <div class="row g-2">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-search"></i></span>
                            <input type="text" class="form-control" placeholder="Buscar por usuario o título..."
                                .value="${this.filterText}"
                                @input="${(e) => this.filterText = e.target.value}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" @change="${(e) => this.filterPriority = e.target.value}">
                            <option value="Todas">Prioridad: Todas</option>
                            <option value="Alta">Alta (Importante)</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                    <div class="col-md-3 text-end pt-1">
                        <span class="badge bg-secondary">${this.filteredTickets.length} Tickets</span>
                    </div>
                </div>
            </div>

            <div class="table-responsive card shadow-sm">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Asunto</th>
                            
                            ${rol !== 'Usuario' ? html`<th scope="col">Usuario Solicitante</th>` : ''}
                            
                            <th scope="col">Prioridad</th>
                            <th scope="col">Estado</th>
                            <th scope="col" class="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.filteredTickets.map(ticket => html`
                        <tr class="${ticket.estado === 'Cerrado' ? 'table-light text-muted' : ''}">
                            <td>${ticket.id}</td>
                            <td>
                                <span class="fw-bold d-block">${ticket.titulo}</span>
                                <small class="text-muted text-truncate" style="max-width: 200px; display:inline-block;">
                                    ${ticket.descripcion}
                                </small>
                            </td>
                            
                            ${rol !== 'Usuario' ? html`
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2" 
                                             style="width: 30px; height: 30px; font-size: 0.8rem;">
                                            ${ticket.usuario ? ticket.usuario.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        ${ticket.usuario || 'Desconocido'}
                                    </div>
                                </td>
                            ` : ''}

                            <td>
                                <span class="badge rounded-pill bg-${this.getPriorityColor(ticket.prioridad)}">
                                    ${ticket.prioridad}
                                </span>
                            </td>
                            <td>
                                <span class="badge bg-${this.getStatusColor(ticket.estado)}">
                                    ${ticket.estado}
                                </span>
                            </td>
                            <td class="text-end actions-col">
                                ${this.renderActions(ticket)}
                            </td>
                        </tr>
                        `)}
                        
                        ${this.filteredTickets.length === 0 ? html`
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">
                                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                    No se encontraron tickets con los filtros actuales.
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }
}

customElements.define('ticket-list', TicketList);