// ticket-app.js
import { LitElement, html, css } from "lit";
import "./ticket-form.js";
import "./ticket-list.js";

export class TicketApp extends LitElement {
    static properties = {
        rol: { state: true }
    };

    static styles = css`
        :host {
        display: block;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 2rem 0;
        box-sizing: border-box;
        }

        .main-header {
        background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
        color: white;
        padding: 2.5rem 2rem;
        border-radius: 20px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        margin-left: 2rem;
        margin-right: 2rem;
        box-sizing: border-box;
        }

        .main-header h1 {
        font-weight: 700;
        font-size: 2.2rem;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        }

        .main-header p {
        margin: 0.75rem 0 0 0;
        opacity: 0.95;
        font-size: 1.05rem;
        }

        /* Grid base */
        .content-grid {
        display: grid;
        gap: 3rem;
        align-items: start;
        padding: 0 2rem;
        box-sizing: border-box;
        width: 100%;
        }

        /* Admin/Usuario: 2 columnas (form + tabla) */
        .content-grid.two-cols {
        grid-template-columns: minmax(360px, 420px) 1fr;
        }

        /* Soporte: 1 columna full */
        .content-grid.one-col {
        grid-template-columns: 1fr;
        }

        /* Garantiza que la lista use todo el ancho disponible */
        ticket-list {
        width: 100%;
        min-width: 0;
        }

        @media (max-width: 1400px) {
        .main-header {
            margin-left: 1.5rem;
            margin-right: 1.5rem;
        }
        .content-grid {
            padding: 0 1.5rem;
        }
        }

        @media (max-width: 1200px) {
        .content-grid.two-cols {
            grid-template-columns: 1fr;
            padding: 0 2rem;
        }
        }

        @media (max-width: 768px) {
        :host {
            padding: 1rem 0;
        }
        .content-grid {
            padding: 0 1rem;
        }
        .main-header {
            padding: 1.5rem;
            margin: 0 1rem;
        }
        .main-header h1 {
            font-size: 1.8rem;
        }
        }
    `;

    constructor() {
        super();
        this.rol = "Usuario";
    }

    connectedCallback() {
        super.connectedCallback();
        this.rol = this.getRolFromToken();
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

    render() {
        const isSoporte = this.rol === "Soporte";
        const gridClass = isSoporte ? "one-col" : "two-cols";

        return html`
        <div class="main-header">
            <h1><span>🎫</span> Gestión de Tickets</h1>
            <p>Sistema de soporte y seguimiento</p>
        </div>

        <div class="content-grid ${gridClass}">
            ${!isSoporte ? html`<ticket-form></ticket-form>` : null}
            <ticket-list></ticket-list>
        </div>
        `;
    }
}

customElements.define("ticket-app", TicketApp);
