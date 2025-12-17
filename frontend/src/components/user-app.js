import { LitElement, html } from "lit";
import "./user-form.js";
import "./user-list.js";

export class UserApp extends LitElement {
    static properties = {
        selectedUser: { state: true }
    };

    constructor() {
        super();
        this.selectedUser = null;
    }

    handleReload() {
        this.shadowRoot
        .getElementById("userList")
        .loadUsers();

        this.selectedUser = null;
    }

    render() {
        return html`
        <h2>Gestión de Usuarios</h2>

        <user-form
            .user=${this.selectedUser}
            @user-saved=${this.handleReload}>
        </user-form>

        <user-list
            id="userList"
            @edit-user=${e => this.selectedUser = e.detail}>
        </user-list>
        `;
    }
}

customElements.define("user-app", UserApp);
