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

        .card-body-custom {
            padding: 2rem 1.75rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-weight: 600;
            color: #1b263b;
            margin-bottom: 0.6rem;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .form-control, .form-select {
            width: 100%;
            border: 2px solid #e0e1dd;
            border-radius: 12px;
            padding: 0.85rem 1.1rem;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
            font-family: inherit;
            background: white;
            color: #0d1b2a;
        }

        .form-control::placeholder {
            color: #778da9;
        }

        .form-control:focus, .form-select:focus {
            outline: none;
            border-color: #415a77;
            box-shadow: 0 0 0 4px rgba(65, 90, 119, 0.1);
        }

        /* --- NUEVOS ESTILOS PARA VALIDACIÓN (UX) --- */
        .input-error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1) !important;
            animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
        /* ------------------------------------------- */

        .btn-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 2rem;
        }

        .btn {
            flex: 1;
            padding: 0.95rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(27, 38, 59, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(27, 38, 59, 0.4);
        }

        .btn-secondary {
            background-color: #778da9;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #415a77;
            transform: translateY(-2px);
        }

        .btn:active {
            transform: scale(0.98);
        }
    `;

    constructor() {
        super();
        this.user = null;
    }

    // Helper para disparar notificaciones al componente padre
    dispatchNotify(msg, type) {
        this.dispatchEvent(new CustomEvent('notify', {
            detail: { msg, type },
            bubbles: true,
            composed: true
        }));
    }

    // Lógica de validación visual
    validateInputs() {
        // Selecciona todos los inputs que tengan el atributo 'required'
        const inputs = this.shadowRoot.querySelectorAll('[required]');
        let isValid = true;
        let firstError = null;

        inputs.forEach(input => {
            // Limpiar error previo
            input.classList.remove('input-error');

            // Si está vacío
            if (!input.value.trim()) {
                input.classList.add('input-error');
                isValid = false;
                if (!firstError) firstError = input;

                // UX: Quitar el error apenas el usuario empiece a escribir
                input.addEventListener('input', () => {
                    input.classList.remove('input-error');
                }, { once: true });
            }
        });

        if (!isValid) {
            this.dispatchNotify('Por favor, completa los campos obligatorios resaltados.', 'warning');
            if (firstError) firstError.focus();
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 1. Validar antes de procesar
        if (!this.validateInputs()) return;

        const data = {
            nombre: this.shadowRoot.getElementById("nombre").value,
            correo: this.shadowRoot.getElementById("correo").value,
            rol: this.shadowRoot.getElementById("rol").value,
            estado: this.shadowRoot.getElementById("estado").value
        };

        // SOLO al crear (password)
        if (!this.user) {
            data.password = this.shadowRoot.getElementById("password").value;
        }

        try {
            if (this.user) {
                await UserService.update(this.user.id, data);
                this.dispatchNotify('Usuario actualizado correctamente', 'success');
            } else {
                await UserService.create(data);
                this.dispatchNotify('Usuario creado exitosamente', 'success');
            }

            this.dispatchEvent(new CustomEvent("user-saved", {
                bubbles: true,
                composed: true
            }));

            this.resetForm();

        } catch (error) {
            console.error(error);
            this.dispatchNotify('Ocurrió un error al guardar el usuario', 'error');
        }
    }

    resetForm() {
        this.user = null;
        this.requestUpdate();
        // Limpiar errores visuales si quedaron pendientes
        const errorInputs = this.shadowRoot.querySelectorAll('.input-error');
        errorInputs.forEach(input => input.classList.remove('input-error'));
        // Limpiar formulario nativo
        const form = this.shadowRoot.querySelector('form');
        if (form) form.reset();
    }

    render() {
        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    <span>${this.user ? "✏️" : "➕"}</span>
                    ${this.user ? "Editar Usuario" : "Nuevo Usuario"}
                </div>
                <div class="card-body-custom">
                    <form @submit=${this.handleSubmit} novalidate>
                        <div class="form-group">
                            <label for="nombre" class="form-label">
                                <span>👤</span> Nombre Completo
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

                        <div class="form-group">
                            <label for="correo" class="form-label">
                                <span>📧</span> Correo Electrónico
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

                        ${!this.user ? html`
                            <div class="form-group">
                                <label for="password" class="form-label">
                                    <span>🔑</span> Contraseña
                                </label>
                                <input 
                                    type="password"
                                    id="password" 
                                    class="form-control"
                                    placeholder="Contraseña inicial"
                                    required 
                                />
                            </div>
                            ` : ""}


                        <div class="form-group">
                            <label for="rol" class="form-label">
                                <span>🏷️</span> Rol
                            </label>
                            <select id="rol" class="form-select" .value=${this.user?.rol ?? "Usuario"}>
                                <option value="Usuario">Usuario</option>
                                <option value="Soporte">Soporte</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="estado" class="form-label">
                                <span>🔘</span> Estado
                            </label>
                            <select id="estado" class="form-select" .value=${this.user?.estado ?? "Activo"}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>

                        <div class="btn-group">
                            ${this.user ? html`
                                <button 
                                    type="button" 
                                    class="btn btn-secondary"
                                    @click=${this.resetForm}>
                                    <span>❌</span> Cancelar
                                </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <span>💾</span> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define("user-form", UserForm);