import { LitElement, html, css } from "lit";
import "./ticket-form.js";
import "./ticket-list.js";
import "./custom-alert.js"; 

export class TicketApp extends LitElement {
    static properties = {
        rol: { state: true }
    };

    constructor() {
        super();
        this.rol = "Usuario";
    }

    connectedCallback() {
        super.connectedCallback();
        this.rol = this.getRolFromToken();
        this.addEventListener('notify', this.handleNotification);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('notify', this.handleNotification);
    }

    getRolFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return "Usuario";
        try {
            return JSON.parse(atob(token.split(".")[1])).rol || "Usuario";
        } catch {
            return "Usuario";
        }
    }

    reloadTickets() {
        const list = this.shadowRoot.getElementById("ticketList");
        if (list) list.load();
    }

    // Manejador para activar la alerta global
    handleNotification(e) {
        const alertComponent = this.shadowRoot.querySelector('custom-alert');
        if (alertComponent) {
            alertComponent.notify(e.detail.msg, e.detail.type);
        }
    }

    static styles = css`
        :host {
            display: block;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .main-header {
            background: linear-gradient(135deg, #1b263b, #415a77);
            color: white;
            padding: 2.5rem 2rem;
            border-radius: 20px;
            margin: 0 2rem 2rem;
            text-align: center;
        }

        .content-grid {
            display: grid;
            gap: 3rem;
            padding: 0 2rem;
            width: 100%;
            box-sizing: border-box;
        }

        .content-grid.two-cols {
            grid-template-columns: minmax(360px, 420px) 1fr;
        }

        .content-grid.one-col {
            grid-template-columns: 1fr;
        }

        ticket-list {
            width: 100%;
            min-width: 0;
        }
    `;

    render() {
        const isSoporte = this.rol === "Soporte";
        const gridClass = isSoporte ? "one-col" : "two-cols";

        return html`
            <custom-alert></custom-alert>

            <div class="main-header">
                <h1>🎫 Gestión de Tickets</h1>
                <p>Sistema de soporte y seguimiento</p>
            </div>

            <div class="content-grid ${gridClass}">
                ${!isSoporte
                    ? html`<ticket-form @ticket-saved=${this.reloadTickets}></ticket-form>`
                    : null}

                <ticket-list id="ticketList"></ticket-list>
            </div>
        `;
    }
}

customElements.define("ticket-app", TicketApp);