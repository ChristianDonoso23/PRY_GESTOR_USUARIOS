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

    render() {
        return html`
        <h2>Gestión de Usuarios</h2>

        <user-form
            .user=${this.selectedUser}
            @saved=${() => (this.selectedUser = null)}>
        </user-form>

        <user-list
            @edit-user=${e => this.selectedUser = e.detail}>
        </user-list>
        `;
    }
}

customElements.define("user-app", UserApp);
