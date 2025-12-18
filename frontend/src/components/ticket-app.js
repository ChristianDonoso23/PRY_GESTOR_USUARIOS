import { LitElement, html } from 'lit';
import { UserService } from '../services/user.service.js';
import './ticket-list.js';
import './ticket-form.js';

export class TicketApp extends LitElement {
  
  static properties = {
    view: { type: String },
    selectedTicket: { type: Object },
    currentUser: { type: Object }, // Usuario "logueado" actualmente
    usersForLogin: { state: true } // Lista para el select de simulación
  };

  constructor() {
    super();
    this.view = 'list';
    this.selectedTicket = null;
    this.currentUser = null; 
    this.usersForLogin = [];
  }

  async connectedCallback() {
      super.connectedCallback();
      // Cargamos usuarios para poder simular el login
      this.usersForLogin = await UserService.getAll();
      
      // Auto-loguear como el primer admin que encuentre o el primer usuario
      if(this.usersForLogin.length > 0) {
          this.currentUser = this.usersForLogin.find(u => u.rol === 'Admin') || this.usersForLogin[0];
      }
  }

  _handleNewTicket() {
    this.selectedTicket = null;
    this.view = 'form';
  }

  _handleEditTicket(e) {
    this.selectedTicket = e.detail;
    this.view = 'form';
  }

  _handleReturnToList() {
    this.view = 'list';
    this.selectedTicket = null;
    setTimeout(() => {
      const list = this.shadowRoot.querySelector('ticket-list');
      if (list) list.loadTickets();
    }, 100);
  }

  // Simular cambio de usuario
  _handleLoginChange(e) {
      const userId = e.target.value;
      this.currentUser = this.usersForLogin.find(u => u.id == userId);
      this.requestUpdate(); // Forzar re-render
  }

  render() {
    return html`
      <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
      
      <div class="alert alert-dark d-flex justify-content-between align-items-center m-3 p-2">
          <span><strong>Simulación de Sesión:</strong> Actuando como:</span>
          <select class="form-select w-50" @change="${this._handleLoginChange}">
              ${this.usersForLogin.map(u => html`
                  <option value="${u.id}" ?selected="${this.currentUser?.id === u.id}">
                      ${u.nombre} (${u.rol})
                  </option>
              `)}
          </select>
      </div>

      <div>
        ${this.view === 'list' 
          ? html`
              <ticket-list
                .currentUser="${this.currentUser}" 
                 @new-ticket="${this._handleNewTicket}"
                 @edit-ticket="${this._handleEditTicket}">
              </ticket-list>          
            `
          : html`
              <ticket-form
                .ticket="${this.selectedTicket}"
                .currentUser="${this.currentUser}"
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