// ticket-list.js
import { LitElement, html, css } from "lit";
import { TicketService } from "../services/ticket.service.js";

export class TicketList extends LitElement {
    static properties = {
        tickets: { state: true }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            min-width: 0;
        }

        .card-custom {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            width: 100%;
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #1b263b, #415a77);
            color: white;
            padding: 1.5rem 1.75rem;
            font-weight: 700;
            font-size: 1.15rem;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .card-body-custom {
            padding: 2rem 0;
            padding-bottom: 2rem;
        }

        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            padding: 0 1.75rem;
            box-sizing: border-box;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #0d1b2a;
            color: white;
        }

        thead th {
            padding: 1rem 0.75rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            white-space: nowrap;
            text-align: left;
        }

        tbody td {
            padding: 1rem 0.75rem;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .badge-prioridad {
            padding: 0.45rem 0.9rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
        }

        .prioridad-baja { background: #778da9; }
        .prioridad-media { background: #f59e0b; }
        .prioridad-alta { background: #dc2626; }

        .badge-estado {
            padding: 0.45rem 0.9rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
            background: #5ea073;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .btn-action {
            padding: 0.55rem 0.9rem;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-assign {
            background: #f59e0b;
            color: white;
        }

        .btn-estado {
            background: #415a77;
            color: white;
        }
    `;

    constructor() {
        super();
        this.tickets = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.load();
        this.addEventListener("ticket-updated", () => this.load());
    }

    async load() {
        this.tickets = await TicketService.getAll();
    }

    get rol() {
        const token = localStorage.getItem("token");
        if (!token) return "Usuario";
        try {
            return JSON.parse(atob(token.split(".")[1])).rol;
        } catch {
            return "Usuario";
        }
    }

    getPrioridadClass(prioridad) {
        return prioridad === "Alta" ? "prioridad-alta" :
               prioridad === "Media" ? "prioridad-media" :
               "prioridad-baja";
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    📄 Listado de Tickets
                </div>

                <div class="card-body-custom">
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>TÍTULO</th>
                                    <th>PRIORIDAD</th>
                                    <th>ESTADO</th>
                                    <th>CREADO POR</th>
                                    <th>ASIGNADO A</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.tickets.map(t => html`
                                    <tr>
                                        <td><strong>${t.titulo}</strong></td>
                                        <td>
                                            <span class="badge-prioridad ${this.getPrioridadClass(t.prioridad)}">
                                                ${t.prioridad}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge-estado">${t.estado || "Pendiente"}</span>
                                        </td>
                                        <td>${t.creado_por_nombre}</td>
                                        <td>${t.asignado_a_nombre || "—"}</td>
                                        <td>
                                            <div class="actions">
                                                ${this.rol === "Admin" ? html`
                                                    <button class="btn-action btn-assign">👤 Asignar</button>
                                                ` : ""}
                                                ${(this.rol === "Admin" || this.rol === "Soporte") ? html`
                                                    <button class="btn-action btn-estado">🔄 Cambiar Estado</button>
                                                ` : ""}
                                            </div>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("ticket-list", TicketList);