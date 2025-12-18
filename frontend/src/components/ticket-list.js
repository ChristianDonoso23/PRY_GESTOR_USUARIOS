import { LitElement, html, css } from "lit";
import { TicketService } from "../services/ticket.service.js";
import { UserService } from "../services/user.service.js";

export class TicketList extends LitElement {
    static properties = {
        tickets: { state: true },
        soportes: { state: true },
        asignandoId: { state: true },
        soporteSeleccionado: { state: true },
        cambiandoEstadoId: { state: true },
        estadoSeleccionado: { state: true }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        .card-custom {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,.15);
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #1b263b, #415a77);
            color: white;
            padding: 1.5rem;
            font-weight: 700;
            font-size: 1.1rem;
        }

        .table-wrapper {
            overflow-x: auto;
            padding: 1.5rem;
        }

        table {
            width: 100%;
            min-width: 950px;
            border-collapse: collapse;
        }

        thead {
            background: #0d1b2a;
            color: white;
        }

        thead th, tbody td {
            padding: .9rem;
            white-space: nowrap;
            text-align: left;
        }

        tbody tr:hover {
            background: rgba(0,0,0,.03);
        }

        .badge-prioridad {
            padding: .4rem .9rem;
            border-radius: 20px;
            font-size: .8rem;
            color: white;
            font-weight: 600;
        }

        .prioridad-alta { background: #dc2626; }
        .prioridad-media { background: #f59e0b; }
        .prioridad-baja { background: #778da9; }

        .badge-estado {
            padding: .4rem .9rem;
            border-radius: 20px;
            font-size: .8rem;
            color: white;
            background: #5ea073;
            font-weight: 600;
        }

        .actions {
            display: flex;
            gap: .5rem;
            align-items: center;
            flex-wrap: wrap;
        }

        select {
            padding: .4rem;
            border-radius: 8px;
            font-size: .8rem;
        }

        button {
            padding: .5rem .9rem;
            border-radius: 10px;
            font-size: .8rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            color: white;
        }

        .btn-assign { background: #f59e0b; }
        .btn-estado { background: #415a77; }
        .btn-save { background: #1b263b; }
        .btn-delete { background: #dc2626; }
    `;

    constructor() {
        super();
        this.tickets = [];
        this.soportes = [];
        this.asignandoId = null;
        this.soporteSeleccionado = "";
        this.cambiandoEstadoId = null;
        this.estadoSeleccionado = "";
    }

    connectedCallback() {
        super.connectedCallback();
        this.load();
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

    getPrioridadClass(p) {
        return p === "Alta"
            ? "prioridad-alta"
            : p === "Media"
            ? "prioridad-media"
            : "prioridad-baja";
    }

    async iniciarAsignacion(id) {
        this.asignandoId = id;
        this.soportes = await UserService.getSoportes();
        this.soporteSeleccionado = "";
    }

    async guardarAsignacion(id) {
        if (!this.soporteSeleccionado) {
            alert("Seleccione un soporte");
            return;
        }
        await TicketService.assign(id, this.soporteSeleccionado);
        this.asignandoId = null;
        this.load();
    }

    iniciarCambioEstado(id, estadoActual) {
        this.cambiandoEstadoId = id;
        this.estadoSeleccionado = estadoActual;
    }

    async guardarEstado(id) {
        if (!this.estadoSeleccionado) return;
        await TicketService.updateEstado(id, this.estadoSeleccionado);
        this.cambiandoEstadoId = null;
        this.load();
    }

    async eliminarTicket(id) {
        if (!confirm("¿Está seguro de eliminar este ticket?")) return;
        await TicketService.delete(id);
        this.load();
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">📄 Listado de Tickets</div>

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
                                        ${this.cambiandoEstadoId === t.id
                                            ? html`
                                                <select
                                                    @change=${e => this.estadoSeleccionado = e.target.value}>
                                                    ${["Abierto","En Proceso","Cerrado"].map(est => html`
                                                        <option value=${est} ?selected=${est === t.estado}>
                                                            ${est}
                                                        </option>
                                                    `)}
                                                </select>
                                            `
                                            : html`<span class="badge-estado">${t.estado}</span>`
                                        }
                                    </td>

                                    <td>${t.creado_por_nombre}</td>
                                    <td>${t.asignado_a_nombre || "—"}</td>

                                    <td>
                                        <div class="actions">

                                            ${this.rol === "Admin" ? (
                                                this.asignandoId === t.id
                                                    ? html`
                                                        <select
                                                            @change=${e => this.soporteSeleccionado = e.target.value}>
                                                            <option value="">Soporte...</option>
                                                            ${this.soportes.map(s => html`
                                                                <option value=${s.id}>${s.nombre}</option>
                                                            `)}
                                                        </select>
                                                        <button class="btn-save"
                                                            @click=${() => this.guardarAsignacion(t.id)}>
                                                            Guardar
                                                        </button>
                                                    `
                                                    : html`
                                                        <button class="btn-assign"
                                                            @click=${() => this.iniciarAsignacion(t.id)}>
                                                            👤 Asignar
                                                        </button>
                                                    `
                                            ) : ""}

                                            ${(this.rol === "Admin" || this.rol === "Soporte") ? (
                                                this.cambiandoEstadoId === t.id
                                                    ? html`
                                                        <button class="btn-save"
                                                            @click=${() => this.guardarEstado(t.id)}>
                                                            Guardar
                                                        </button>
                                                    `
                                                    : html`
                                                        <button class="btn-estado"
                                                            @click=${() => this.iniciarCambioEstado(t.id, t.estado)}>
                                                            🔄 Estado
                                                        </button>
                                                    `
                                            ) : ""}

                                            ${this.rol === "Admin" ? html`
                                                <button class="btn-delete"
                                                    @click=${() => this.eliminarTicket(t.id)}>
                                                    🗑️ Eliminar
                                                </button>
                                            ` : ""}

                                        </div>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

customElements.define("ticket-list", TicketList);
