import { LitElement, html, css } from "lit";
import { UserService } from "../services/user.service.js";

export class UserList extends LitElement {
    static properties = {
        users: { state: true }
    };

    static styles = css`
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #ccc; padding: 5px; }
        button { margin-right: 5px; }
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
        await UserService.delete(id);
        this.loadUsers();
    }

    render() {
        return html`
        <h3>Listado de Usuarios</h3>

        <table>
            <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
            </tr>

            ${this.users.map(user => html`
            <tr>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.rol}</td>
                <td>${user.estado}</td>
                <td>
                <button @click=${() =>
                    this.dispatchEvent(new CustomEvent("edit-user", {
                    detail: user,
                    bubbles: true,
                    composed: true
                    }))
                }>
                    Editar
                </button>

                <button @click=${() => this.deleteUser(user.id)}>
                    Eliminar
                </button>
                </td>
            </tr>
            `)}
        </table>
        `;
    }
}

customElements.define("user-list", UserList);
