import { LitElement, html, css } from "lit";
import { UserService } from "../services/user.service.js";

export class UserList extends LitElement {
    static properties = {
        users: { state: true }
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

        /* 🔑 AQUÍ ESTABA EL PROBLEMA */
        .card-body {
            padding: 1.5rem 1.75rem;
        }

        .table-wrapper {
            width: 100%;
            overflow-x: auto;
        }

        table {
            width: 100%;
            min-width: 900px;
            border-collapse: collapse;
        }

        thead {
            background: #0d1b2a;
            color: white;
        }

        thead th {
            padding: 1rem 1.25rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            white-space: nowrap;
            text-align: left;
        }

        tbody tr {
            border-bottom: 1px solid #e0e1dd;
        }

        tbody td {
            padding: 1rem 1.25rem;
            font-size: 0.9rem;
            white-space: nowrap;
        }

        .badge-rol,
        .badge-estado {
            padding: 0.45rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
        }

        .badge-admin { background: #dc2626; }
        .badge-soporte { background: #f59e0b; }
        .badge-usuario { background: #415a77; }
        .badge-activo { background: #5ea073; }
        .badge-inactivo { background: #778da9; }

        .actions {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            white-space: nowrap;
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

        .btn-edit {
            background: #1b263b;
            color: white;
        }

        .btn-delete {
            background: #dc2626;
            color: white;
        }
    `;

    constructor() {
        super();
        this.users = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadUsers();
    }

    async loadUsers() {
        this.users = await UserService.getAll();
    }

    async deleteUser(id) {
        if (confirm("¿Eliminar usuario?")) {
            await UserService.delete(id);
            this.loadUsers();
        }
    }

    getRolClass(rol) {
        return rol === "Admin"
            ? "badge-admin"
            : rol === "Soporte"
            ? "badge-soporte"
            : "badge-usuario";
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    📋 Listado de Usuarios
                </div>

                <div class="card-body">
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th style="text-align:center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.users.map(user => html`
                                    <tr>
                                        <td><strong>${user.nombre}</strong></td>
                                        <td>${user.correo}</td>
                                        <td>
                                            <span class="badge-rol ${this.getRolClass(user.rol)}">
                                                ${user.rol}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge-estado ${user.estado === "Activo" ? "badge-activo" : "badge-inactivo"}">
                                                ${user.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="actions">
                                                <button class="btn-action btn-edit"
                                                    @click=${() => this.dispatchEvent(new CustomEvent("edit-user", {
                                                        detail: user,
                                                        bubbles: true,
                                                        composed: true
                                                    }))}>
                                                    ✏️ Editar
                                                </button>
                                                <button class="btn-action btn-delete"
                                                    @click=${() => this.deleteUser(user.id)}>
                                                    🗑️ Eliminar
                                                </button>
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

customElements.define("user-list", UserList);
