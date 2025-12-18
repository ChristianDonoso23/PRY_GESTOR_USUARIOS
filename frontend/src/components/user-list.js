import { LitElement, html, css } from "lit";
import { UserService } from "../services/user.service.js";

export class UserList extends LitElement {
    static properties = {
        users: { state: true }
    };

    static styles = css`
        :host {
            display: block;
        }

        .card-custom {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            border: none;
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #123499, #0d2472);
            color: white;
            padding: 1.25rem 1.5rem;
            font-weight: 600;
            font-size: 1.1rem;
            border: none;
        }

        .table-responsive {
            overflow-x: auto;
            border-radius: 0 0 15px 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        thead {
            background: linear-gradient(135deg, #123499, #0d2472);
            color: white;
        }

        thead th {
            border: none;
            padding: 1rem 1.25rem;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
        }

        thead th.text-center {
            text-align: center;
        }

        tbody tr {
            transition: all 0.3s ease;
        }

        tbody tr:hover {
            background-color: rgba(18, 52, 153, 0.05);
            transform: scale(1.005);
        }

        tbody tr:nth-child(even) {
            background-color: rgba(59, 110, 217, 0.03);
        }

        tbody td {
            padding: 1rem 1.25rem;
            vertical-align: middle;
            border-bottom: 1px solid #e5e7eb;
        }

        tbody td.text-center {
            text-align: center;
        }

        .badge-custom {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.8rem;
            white-space: nowrap;
        }

        .badge-activo {
            background-color: #5ea073;
            color: white;
        }

        .badge-inactivo {
            background-color: #6b7280;
            color: white;
        }

        .badge-rol {
            display: inline-block;
            padding: 0.4rem 0.9rem;
            border-radius: 15px;
            font-weight: 600;
            font-size: 0.8rem;
            color: white;
        }

        .badge-admin {
            background-color: #dc2626;
        }

        .badge-soporte {
            background-color: #f59e0b;
        }

        .badge-usuario {
            background-color: #3b6ed9;
        }

        .btn-action {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            margin-right: 0.5rem;
            font-family: inherit;
        }

        .btn-edit {
            background-color: #3b6ed9;
            color: white;
        }

        .btn-edit:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(59, 110, 217, 0.3);
        }

        .btn-delete {
            background-color: #dc2626;
            color: white;
        }

        .btn-delete:hover {
            background-color: #b91c1c;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }

        strong {
            font-weight: 600;
            color: #0d2472;
        }

        @media (max-width: 768px) {
            thead th,
            tbody td {
                padding: 0.75rem;
                font-size: 0.85rem;
            }

            .btn-action {
                padding: 0.4rem 0.8rem;
                font-size: 0.8rem;
                margin-right: 0.3rem;
                margin-bottom: 0.3rem;
            }
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
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            await UserService.delete(id);
            this.loadUsers();
        }
    }

    getRolClass(rol) {
        switch(rol) {
            case 'Admin': return 'badge-admin';
            case 'Soporte': return 'badge-soporte';
            case 'Usuario': return 'badge-usuario';
            default: return 'badge-usuario';
        }
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    📋 Listado de Usuarios
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th class="text-center">Acciones</th>
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
                                        <span class="badge-custom ${user.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}">
                                            ${user.estado}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button 
                                            class="btn-action btn-edit"
                                            @click=${() => this.dispatchEvent(new CustomEvent("edit-user", {
                                                detail: user,
                                                bubbles: true,
                                                composed: true
                                            }))}>
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            class="btn-action btn-delete"
                                            @click=${() => this.deleteUser(user.id)}>
                                            🗑️ Eliminar
                                        </button>
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

customElements.define("user-list", UserList);