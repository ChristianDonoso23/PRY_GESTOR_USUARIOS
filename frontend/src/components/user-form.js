import { LitElement, html, css } from "lit";
import { UserService } from "../services/user.service.js";

export class UserForm extends LitElement {
    static properties = {
        user: { type: Object }
    };

    static styles = css`
        form { border: 1px solid #ccc; padding: 10px; margin-bottom: 15px; }
        input, select, button { display: block; margin: 5px 0; width: 100%; }
    `;

    constructor() {
        super();
        this.user = null;
    }

    async handleSubmit(e) {
        e.preventDefault();

        const data = {
        nombre: this.shadowRoot.getElementById("nombre").value,
        correo: this.shadowRoot.getElementById("correo").value,
        rol: this.shadowRoot.getElementById("rol").value,
        estado: this.shadowRoot.getElementById("estado").value
        };

        if (this.user) {
        await UserService.update(this.user.id, data);
        } else {
        await UserService.create(data);
        }

        this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
        this.resetForm();
    }

    resetForm() {
        this.user = null;
        this.requestUpdate();
    }

    render() {
        return html`
        <form @submit=${this.handleSubmit}>
            <h3>${this.user ? "Editar Usuario" : "Nuevo Usuario"}</h3>

            <input id="nombre" placeholder="Nombre" .value=${this.user?.nombre ?? ""} required />
            <input id="correo" placeholder="Correo" .value=${this.user?.correo ?? ""} required />

            <select id="rol">
            <option value="Usuario">Usuario</option>
            <option value="Soporte">Soporte</option>
            <option value="Admin">Admin</option>
            </select>

            <select id="estado">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            </select>

            <button type="submit">Guardar</button>
        </form>
        `;
    }
}

customElements.define("user-form", UserForm);
