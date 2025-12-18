import { LitElement, html, css } from 'lit';
import './ticket-list.js';
import './ticket-form.js';

export class TicketApp extends LitElement {
  
  static properties = {
    view: { type: String },      // 'list' | 'form'
    selectedTicket: { type: Object }
  };

  constructor() {
    super();
    this.view = 'list';          // Vista por defecto
    this.selectedTicket = null;
  }

  // --- Manejadores de Eventos ---

  // Cuando el usuario hace click en "Nuevo Ticket" en la lista
  _handleNewTicket() {
    this.selectedTicket = null; // Limpiamos selección
    this.view = 'form';         // Cambiamos vista
  }

  // Cuando el usuario hace click en "Editar" en la lista
  _handleEditTicket(e) {
    this.selectedTicket = e.detail; // Guardamos el ticket recibido
    this.view = 'form';
  }

  // Cuando el formulario termina (Guardar o Cancelar)
  _handleReturnToList() {
    this.view = 'list';
    this.selectedTicket = null;
    
    // Pequeño truco: Esperar a que se renderice la lista y pedirle que recargue datos
    setTimeout(() => {
      const listComponent = this.shadowRoot.querySelector('ticket-list');
      if (listComponent) listComponent.loadTickets();
    }, 0);
  }

  render() {
    // Renderizado condicional: ¿Qué vista mostramos?
    return html`
      <div>
        ${this.view === 'list' 
          ? html`
              <ticket-list
                @new-ticket="${this._handleNewTicket}"
                @edit-ticket="${this._handleEditTicket}">
              </ticket-list>
            `
          : html`
              <ticket-form
                .ticketData="${this.selectedTicket ? {...this.selectedTicket} : null}"
                .ticketId="${this.selectedTicket?.id}"
                @ticket-saved="${this._handleReturnToList}"
                @cancel="${this._handleReturnToList}">
              </ticket-form>
            `
        }
      </div>
    `;
  }
}

customElements.define('ticket-app', TicketApp);