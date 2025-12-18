import { LitElement, html, css } from 'lit';
import { TicketService } from '../services/ticket.service.js';
import { UserService } from '../services/user.service.js';
import './custom-alert.js'; // Importamos la alerta

export class TicketForm extends LitElement {
    static properties = {
        ticket: { type: Object },
        currentUser: { type: Object }, // Objeto usuario logueado (Simulado)
        usersList: { state: true },    // Lista completa de usuarios para buscar
        searchQuery: { state: true }   // Texto del buscador
    };

    constructor() {
        super();
        this.ticket = null;
        this.currentUser = { rol: 'Admin' }; // Valor por defecto por seguridad
        this.usersList = [];
        this.searchQuery = '';
    }

    async connectedCallback() {
        super.connectedCallback();
        // Cargar usuarios para el buscador
        try {
            this.usersList = await UserService.getAll();
        } catch (e) {
            console.error('Error cargando usuarios', e);
        }
    }

    // Detectar cambios en properties para inicializar el buscador en modo edición
    updated(changedProps) {
        if (changedProps.has('ticket') && this.ticket) {
            // Si editamos, buscamos el nombre del usuario dueño del ticket
            const owner = this.usersList.find(u => u.id == this.ticket.usuario_id);
            if (owner) this.searchQuery = owner.nombre;
        }
    }

    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
        this.resetForm();
    }

    showNotification(msg, type) {
        const alertComponent = this.shadowRoot.querySelector('custom-alert');
        if (alertComponent) alertComponent.showAlert(msg, type);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 1. Obtener ID del usuario basado en el nombre buscado (Datalist logic)
        const selectedUser = this.usersList.find(u => u.nombre === this.searchQuery);
        
        // Validación: Si es admin, debe haber seleccionado un usuario válido
        if (this.currentUser.rol === 'Admin' && !selectedUser) {
            this.showNotification('Error: Debes seleccionar un usuario válido de la lista.', 'danger');
            return;
        }

        // Si es rol "Usuario", el usuario_id es él mismo. Si es Admin, es el seleccionado.
        const finalUserId = (this.currentUser.rol === 'Usuario') ? this.currentUser.id : selectedUser?.id;

        // Recolectar datos
        const data = {
            titulo: this.shadowRoot.getElementById('titulo').value,
            descripcion: this.shadowRoot.getElementById('descripcion').value,
            prioridad: this.shadowRoot.getElementById('prioridad')?.value || 'Media',
            estado: this.shadowRoot.getElementById('estado')?.value || 'Abierto',
            usuario_id: finalUserId
        };

        try {
            if (this.ticket && this.ticket.id) {
                await TicketService.update(this.ticket.id, data);
                this.showNotification('Ticket actualizado correctamente', 'success');
            } else {
                await TicketService.create(data);
                this.showNotification('Ticket creado exitosamente', 'success');
            }

            // Esperar un poco para que se vea la alerta antes de cerrar
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('ticket-saved', { bubbles: true, composed: true }));
                this.resetForm();
            }, 1500);

        } catch (error) {
            console.error(error);
            this.showNotification('Error al guardar en el servidor', 'danger');
        }
    }

    resetForm() {
        this.ticket = null;
        this.searchQuery = '';
        this.requestUpdate();
    }

    // --- RENDER HELPERS ---

    renderUserSelect() {
        // Si soy Usuario normal, no elijo usuario (soy yo mismo), campo oculto
        if (this.currentUser.rol === 'Usuario') return html``;

        // Si soy Soporte, solo veo quién es, pero no puedo cambiarlo (readonly)
        const isSupport = this.currentUser.rol === 'Soporte';

        return html`
            <div class="col-md-12 mb-3">
                <label class="form-label">Usuario Solicitante</label>
                <input list="users-options" class="form-control" 
                    .value="${this.searchQuery}"
                    @input="${(e) => this.searchQuery = e.target.value}"
                    ?disabled="${isSupport}"
                    placeholder="Escribe para buscar usuario..." required>
                
                <datalist id="users-options">
                    ${this.usersList.map(u => html`<option value="${u.nombre}">ID: ${u.id} - ${u.correo}</option>`)}
                </datalist>
            </div>
        `;
    }

    render() {
        // Definir permisos según rol
        const role = this.currentUser?.rol || 'Usuario';
        const isSupport = role === 'Soporte';
        const isAdmin = role === 'Admin';
        
        // Soporte NO puede editar titulo/descripcion, solo ver
        // Usuario NO puede editar Estado (o quizás sí cerrar, pero vamos a restringirlo según tu prompt)
        
        const title = this.ticket ? `Editar Ticket #${this.ticket.id}` : 'Nuevo Ticket';

        return html`
        <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

        <custom-alert></custom-alert>

        <div class="container mt-4">
            <div class="card shadow border-${isSupport ? 'info' : 'primary'}">
                <div class="card-header bg-${isSupport ? 'info' : 'primary'} text-white d-flex justify-content-between">
                    <h4 class="mb-0"><i class="bi bi-ticket-detailed"></i> ${title}</h4>
                    <span class="badge bg-dark">Vista: ${role}</span>
                </div>
                <div class="card-body">
                    <form @submit=${this.handleSubmit}>
                        
                        <div class="row">
                            ${this.renderUserSelect()}
                        </div>

                        <div class="mb-3">
                            <label for="titulo" class="form-label">Título del Incidente</label>
                            <input type="text" class="form-control" id="titulo" 
                                .value=${this.ticket?.titulo || ''} 
                                ?disabled=${isSupport} 
                                required>
                        </div>

                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción Detallada</label>
                            <textarea class="form-control" id="descripcion" rows="4" 
                                ?disabled=${isSupport}
                                required>${this.ticket?.descripcion || ''}</textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="prioridad" class="form-label">Prioridad</label>
                                <select class="form-select" id="prioridad" 
                                    .value=${this.ticket?.prioridad || 'Media'}
                                    ?disabled=${isSupport}> 
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="estado" class="form-label">Estado Actual</label>
                                <select class="form-select" id="estado" 
                                    .value=${this.ticket?.estado || 'Abierto'}
                                    ?disabled=${!isAdmin && !isSupport}> <option value="Abierto">Abierto</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" class="btn btn-secondary" @click=${this.cancel}>
                                Volver
                            </button>
                            
                            <button type="submit" class="btn btn-success">
                                <i class="bi bi-save"></i> ${isSupport ? 'Actualizar Estado' : 'Guardar Ticket'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('ticket-form', TicketForm);