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
        
        .list-card {
            background: linear-gradient(135deg, #06141B 0%, #11212D 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(6, 20, 27, 0.5);
            border: 1px solid rgba(155, 186, 171, 0.1);
            position: relative;
        }
        
        .list-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #9BBA AB 0%, #4A5C6A 100%);
        }
        
        .card-header {
            background: rgba(37, 55, 69, 0.4);
            padding: 1.75rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(74, 92, 106, 0.2);
        }
        
        .card-title {
            color: #CCD0CF;
            font-weight: 700;
            font-size: 1.6rem;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            letter-spacing: -0.3px;
        }
        
        .title-icon {
            color: #9BBA AB;
            font-size: 1.8rem;
        }
        
        .user-count {
            background: linear-gradient(135deg, #9BBA AB 0%, #4A5C6A 100%);
            color: #06141B;
            padding: 0.5rem 1.2rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(155, 186, 171, 0.25);
        }
        
        .table-wrapper {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }
        
        thead {
            background: rgba(37, 55, 69, 0.4);
        }
        
        th {
            color: #9BBA AB;
            font-weight: 700;
            padding: 1.25rem 1.5rem;
            text-align: left;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }
        
        th.text-center {
            text-align: center;
        }
        
        tbody tr {
            border-bottom: 1px solid rgba(74, 92, 106, 0.15);
            transition: all 0.3s ease;
        }
        
        tbody tr:hover {
            background: rgba(155, 186, 171, 0.05);
            transform: scale(1.005);
        }
        
        td {
            color: #CCD0CF;
            padding: 1.25rem 1.5rem;
            font-size: 0.95rem;
        }
        
        td.text-center {
            text-align: center;
        }
        
        .user-name {
            font-weight: 600;
            color: #CCD0CF;
            font-size: 1rem;
        }
        
        .user-email {
            color: #4A5C6A;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        }
        
        .email-icon {
            color: #9BBA AB;
        }
        
        .badge {
            padding: 0.5rem 1rem;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.85rem;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .badge-admin {
            background: linear-gradient(135deg, #253745 0%, #11212D 100%);
            color: #9BBA AB;
            border: 1px solid rgba(155, 186, 171, 0.3);
            box-shadow: 0 2px 8px rgba(37, 55, 69, 0.3);
        }
        
        .badge-soporte {
            background: linear-gradient(135deg, #4A5C6A 0%, #253745 100%);
            color: #CCD0CF;
            box-shadow: 0 2px 8px rgba(74, 92, 106, 0.3);
        }
        
        .badge-usuario {
            background: linear-gradient(135deg, #9BBA AB 0%, #4A5C6A 100%);
            color: #06141B;
            box-shadow: 0 2px 8px rgba(155, 186, 171, 0.3);
        }
        
        .badge-activo {
            background: linear-gradient(135deg, #9BBA AB 0%, #4A5C6A 100%);
            color: #06141B;
            box-shadow: 0 2px 8px rgba(155, 186, 171, 0.3);
        }
        
        .badge-inactivo {
            background: linear-gradient(135deg, #4A5C6A 0%, #253745 100%);
            color: #CCD0CF;
            box-shadow: 0 2px 8px rgba(74, 92, 106, 0.3);
        }
        
        .btn-group {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
        }
        
        .btn {
            padding: 0.7rem 1.3rem;
            border-radius: 10px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .btn-edit {
            background: linear-gradient(135deg, #9BBA AB 0%, #4A5C6A 100%);
            color: #06141B;
            box-shadow: 0 2px 8px rgba(155, 186, 171, 0.25);
        }
        
        .btn-edit:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(155, 186, 171, 0.4);
        }
        
        .btn-delete {
            background: linear-gradient(135deg, #253745 0%, #11212D 100%);
            color: #CCD0CF;
            border: 1px solid rgba(74, 92, 106, 0.5);
            box-shadow: 0 2px 8px rgba(37, 55, 69, 0.3);
        }
        
        .btn-delete:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(37, 55, 69, 0.5);
            background: linear-gradient(135deg, #253745 0%, #06141B 100%);
        }
        
        .empty-state {
            padding: 5rem 2rem;
            text-align: center;
        }
        
        .empty-icon {
            font-size: 5rem;
            color: #4A5C6A;
            margin-bottom: 1.5rem;
            opacity: 0.5;
        }
        
        .empty-text {
            color: #4A5C6A;
            font-size: 1.2rem;
            font-weight: 600;
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
        const classes = {
            'Admin': 'badge-admin',
            'Soporte': 'badge-soporte',
            'Usuario': 'badge-usuario'
        };
        return classes[rol] || 'badge-usuario';
    }

    getEstadoClass(estado) {
        return estado === 'Activo' ? 'badge-activo' : 'badge-inactivo';
    }

    render() {
        return html`
            <link rel="stylesheet" href="./src/vendor/bootstrap/css/bootstrap.min.css">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            
            <div class="list-card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="bi bi-list-ul title-icon"></i>
                        Listado de Usuarios
                    </h3>
                    <span class="user-count">${this.users.length} usuarios</span>
                </div>
                
                ${this.users.length === 0 ? html`
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="bi bi-inbox"></i>
                        </div>
                        <p class="empty-text">No hay usuarios registrados</p>
                    </div>
                ` : html`
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th><i class="bi bi-person-fill"></i> Nombre</th>
                                    <th><i class="bi bi-envelope-fill"></i> Correo</th>
                                    <th class="text-center"><i class="bi bi-shield-fill"></i> Rol</th>
                                    <th class="text-center"><i class="bi bi-toggle-on"></i> Estado</th>
                                    <th class="text-center"><i class="bi bi-gear-fill"></i> Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.users.map(user => html`
                                    <tr>
                                        <td class="user-name">${user.nombre}</td>
                                        <td>
                                            <span class="user-email">
                                                <i class="bi bi-envelope email-icon"></i> ${user.correo}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge ${this.getRolClass(user.rol)}">
                                                ${user.rol}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge ${this.getEstadoClass(user.estado)}">
                                                ${user.estado}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <div class="btn-group">
                                                <button 
                                                    class="btn btn-edit" 
                                                    title="Editar usuario"
                                                    @click=${() =>
                                                        this.dispatchEvent(new CustomEvent("edit-user", {
                                                            detail: user,
                                                            bubbles: true,
                                                            composed: true
                                                        }))
                                                    }>
                                                    <i class="bi bi-pencil-fill"></i> Editar
                                                </button>
                                                <button 
                                                    class="btn btn-delete" 
                                                    title="Eliminar usuario"
                                                    @click=${() => this.deleteUser(user.id)}>
                                                    <i class="bi bi-trash-fill"></i> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define("user-list", UserList);