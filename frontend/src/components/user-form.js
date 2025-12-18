import { LitElement, html, css } from "lit";
import { UserService } from "../services/user.service.js";

export class UserForm extends LitElement {
    static properties = {
        user: { type: Object }
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
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #123499, #3b6ed9);
            color: white;
            padding: 1.25rem 1.5rem;
            font-weight: 600;
            font-size: 1.1rem;
            border: none;
        }

        .card-body-custom {
            padding: 2rem;
        }

        form {
            display: block;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            margin: -0.5rem;
        }

        .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
            padding: 0.5rem;
        }

        .col-12 {
            flex: 0 0 100%;
            max-width: 100%;
            padding: 0.5rem;
        }

        .form-label {
            display: block;
            font-weight: 600;
            color: #0d2472;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .form-control, .form-select {
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
            font-family: inherit;
        }

        .form-control:focus, .form-select:focus {
            outline: none;
            border-color: #123499;
            box-shadow: 0 0 0 0.2rem rgba(18, 52, 153, 0.15);
        }

        .text-end {
            text-align: right;
            margin-top: 1rem;
        }

        .btn {
            padding: 0.75rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            font-family: inherit;
        }

        .btn-primary-custom {
            background: linear-gradient(135deg, #123499, #3b6ed9);
            color: white;
            box-shadow: 0 4px 12px rgba(18, 52, 153, 0.3);
        }

        .btn-primary-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(18, 52, 153, 0.4);
            background: linear-gradient(135deg, #3b6ed9, #2563eb);
        }

        .btn-secondary {
            background-color: #6b7280;
            color: white;
            margin-right: 0.5rem;
        }

        .btn-secondary:hover {
            background-color: #4b5563;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .col-md-6 {
                flex: 0 0 100%;
                max-width: 100%;
            }

            .card-body-custom {
                padding: 1.5rem;
            }

            .text-end {
                text-align: center;
            }
        }
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

        this.dispatchEvent(new CustomEvent("user-saved", {
            bubbles: true,
            composed: true
        }));

        this.resetForm();
    }

    resetForm() {
        this.user = null;
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    ✏️ ${this.user ? "Editar Usuario" : "Nuevo Usuario"}
                </div>
                <div class="card-body-custom">
                    <form @submit=${this.handleSubmit}>
                        <div class="row">
                            <div class="col-md-6">
                                <label for="nombre" class="form-label">
                                    👤 Nombre Completo
                                </label>
                                <input 
                                    type="text"
                                    id="nombre" 
                                    class="form-control"
                                    placeholder="Ingrese el nombre completo"
                                    .value=${this.user?.nombre ?? ""} 
                                    required 
                                />
                            </div>

                            <div class="col-md-6">
                                <label for="correo" class="form-label">
                                    ✉️ Correo Electrónico
                                </label>
                                <input 
                                    type="email"
                                    id="correo" 
                                    class="form-control"
                                    placeholder="usuario@ejemplo.com"
                                    .value=${this.user?.correo ?? ""} 
                                    required 
                                />
                            </div>

                            <div class="col-md-6">
                                <label for="rol" class="form-label">
                                    🏷️ Rol
                                </label>
                                <select id="rol" class="form-select" .value=${this.user?.rol ?? "Usuario"}>
                                    <option value="Usuario">Usuario</option>
                                    <option value="Soporte">Soporte</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label for="estado" class="form-label">
                                    🔘 Estado
                                </label>
                                <select id="estado" class="form-select" .value=${this.user?.estado ?? "Activo"}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>

                            <div class="col-12 text-end">
                                ${this.user ? html`
                                    <button 
                                        type="button" 
                                        class="btn btn-secondary"
                                        @click=${this.resetForm}>
                                        ❌ Cancelar
                                    </button>
                                ` : ''}
                                <button type="submit" class="btn btn-primary-custom">
                                    💾 Guardar Usuario
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define("user-form", UserForm);