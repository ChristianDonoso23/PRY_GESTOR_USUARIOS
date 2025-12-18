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
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            border: none;
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            padding: 1.5rem 1.75rem;
            font-weight: 700;
            font-size: 1.15rem;
            border: none;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .table-responsive {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }

        thead {
            background: #0d1b2a;
            color: white;
        }

        thead th {
            border: none;
            padding: 1.1rem 1.5rem;
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
            transition: all 0.2s ease;
            border-bottom: 1px solid #e0e1dd;
        }

        tbody tr:hover {
            background-color: rgba(65, 90, 119, 0.05);
        }

        tbody tr:nth-child(even) {
            background-color: rgba(224, 225, 221, 0.3);
        }

        tbody td {
            padding: 1.1rem 1.5rem;
            vertical-align: middle;
            font-size: 0.95rem;
        }

        tbody td.text-center {
            text-align: center;
        }

        .badge-estado {
            display: inline-block;
            padding: 0.5rem 1.1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            white-space: nowrap;
        }

        .badge-activo {
            background-color: #5ea073;
            color: white;
        }

        .badge-inactivo {
            background-color: #778da9;
            color: white;
        }

        .badge-rol {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            font-weight: 600;
            font-size: 0.85rem;
            color: white;
        }

        .badge-admin {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .badge-soporte {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .badge-usuario {
            background: linear-gradient(135deg, #415a77, #1b263b);
        }

        .btn-action {
            padding: 0.6rem 1.1rem;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            margin-right: 0.5rem;
            font-family: inherit;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-edit {
            background: linear-gradient(135deg, #415a77, #1b263b);
            color: white;
        }

        .btn-edit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(65, 90, 119, 0.4);
        }

        .btn-delete {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
        }

        .btn-delete:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }

        .btn-action:active {
            transform: scale(0.95);
        }

        strong {
            font-weight: 600;
            color: #0d1b2a;
        }

        @media (max-width: 768px) {
            thead th,
            tbody td {
                padding: 0.85rem;
                font-size: 0.85rem;
            }

            .btn-action {
                padding: 0.5rem 0.9rem;
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
                    <span>📋</span> Listado de Usuarios
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
                                        <span class="badge-estado ${user.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}">
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
                                            <span>✏️</span> Editar
                                        </button>
                                        <button 
                                            class="btn-action btn-delete"
                                            @click=${() => this.deleteUser(user.id)}>
                                            <span>🗑️</span> Eliminar
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