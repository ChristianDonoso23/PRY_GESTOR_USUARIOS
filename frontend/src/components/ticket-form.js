import { LitElement, html, css } from 'lit';
import { TicketService } from '../services/ticket.service.js';

export class TicketForm extends LitElement {
    static properties = {
        ticket: { type: Object } // Si llega null, es CREAR. Si llega objeto, es EDITAR.
    };

    constructor() {
        super();
        this.ticket = null;
    }

    // Método para cancelar y volver a la lista
    cancel() {
        this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
        this.resetForm();
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Recolectar datos del DOM (ShadowRoot)
        const data = {
            titulo: this.shadowRoot.getElementById('titulo').value,
            descripcion: this.shadowRoot.getElementById('descripcion').value,
            prioridad: this.shadowRoot.getElementById('prioridad').value,
            estado: this.shadowRoot.getElementById('estado').value,
            usuario_id: this.shadowRoot.getElementById('usuario_id').value 
        };

        try {
            if (this.ticket && this.ticket.id) {
                // Modo Edición
                await TicketService.update(this.ticket.id, data);
                alert('Ticket actualizado correctamente');
            } else {
                // Modo Creación
                await TicketService.create(data);
                alert('Ticket creado exitosamente');
            }

            // Notificar al padre (ticket-app) que ya terminamos
            this.dispatchEvent(new CustomEvent('ticket-saved', { bubbles: true, composed: true }));
            this.resetForm();

        } catch (error) {
            console.error(error);
            alert('Error al guardar el ticket. Revisa que el ID de usuario exista.');
        }
    }

    resetForm() {
        this.ticket = null;
        this.requestUpdate();
    }

    render() {
        // Título dinámico
        const title = this.ticket ? `Editar Ticket #${this.ticket.id}` : 'Nuevo Ticket de Soporte';
        
        return html`
        <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

        <div class="container mt-4">
            <div class="card shadow">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0"><i class="bi bi-pencil-square"></i> ${title}</h4>
                </div>
                <div class="card-body">
                    <form @submit=${this.handleSubmit}>
                        
                        <div class="row">
                            <div class="col-md-8 mb-3">
                                <label for="titulo" class="form-label">Título del Incidente</label>
                                <input type="text" class="form-control" id="titulo" 
                                    .value=${this.ticket?.titulo || ''} required>
                            </div>
                            
                            <div class="col-md-4 mb-3">
                                <label for="usuario_id" class="form-label">ID Usuario Solicitante</label>
                                <input type="number" class="form-control" id="usuario_id" 
                                    .value=${this.ticket?.usuario_id || ''} required placeholder="Ej: 1">
                                <div class="form-text">Debe ser un ID de usuario válido.</div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción Detallada</label>
                            <textarea class="form-control" id="descripcion" rows="3" required>${this.ticket?.descripcion || ''}</textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="prioridad" class="form-label">Prioridad</label>
                                <select class="form-select" id="prioridad" .value=${this.ticket?.prioridad || 'Media'}>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label for="estado" class="form-label">Estado Actual</label>
                                <select class="form-select" id="estado" .value=${this.ticket?.estado || 'Abierto'}>
                                    <option value="Abierto">Abierto</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" class="btn btn-secondary" @click=${this.cancel}>
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-success">
                                <i class="bi bi-save"></i> Guardar Ticket
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