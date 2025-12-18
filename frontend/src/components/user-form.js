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
        
        .form-card {
            background: linear-gradient(135deg, #06141B 0%, #11212D 100%);
            border-radius: 20px;
            padding: 2.25rem;
            box-shadow: 0 8px 32px rgba(6, 20, 27, 0.5);
            border: 1px solid rgba(155, 186, 171, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .form-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #9BBA AB 0%, #4A5C6A 100%);
        }
        
        .card-title {
            color: #CCD0CF;
            font-weight: 700;
            font-size: 1.6rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            letter-spacing: -0.3px;
        }
        
        .title-icon {
            color: #9BBA AB;
            font-size: 1.8rem;
        }
        
        .form-label {
            color: #4A5C6A;
            font-weight: 600;
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        
        .label-icon {
            color: #9BBA AB;
        }
        
        .form-control, .form-select {
            background: #253745;
            border: 2px solid rgba(74, 92, 106, 0.3);
            color: #CCD0CF;
            padding: 0.9rem 1.1rem;
            border-radius: 12px;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            font-weight: 500;
        }
        
        .form-control:focus, .form-select:focus {
            background: #253745;
            border-color: #9BBA AB;
            color: #CCD0CF;
            box-shadow: 0 0 0 4px rgba(155, 186, 171, 0.1);
            outline: none;
        }
        
        .form-control::placeholder {
            color: #4A5C6A;
            font-weight: 400;
        }
        
        .form-select option {
            background: #253745;
            color: #CCD0CF;
        }
        
        .btn-primary-custom {
            background: linear-gradient(135deg, #9BBA AB 0%, #4A5C6A 100%);
            border: none;
            color: #06141B;
            font-weight: 700;
            padding: 1.1rem;
            border-radius: 12px;
            width: 100%;
            transition: all 0.3s ease;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 16px rgba(155, 186, 171, 0.25);
        }
        
        .btn-primary-custom:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(155, 186, 171, 0.4);
            background: linear-gradient(135deg, #a8c7b7 0%, #576b78 100%);
        }
        
        .btn-secondary-custom {
            background: transparent;
            border: 2px solid rgba(74, 92, 106, 0.5);
            color: #CCD0CF;
            font-weight: 600;
            padding: 0.95rem;
            border-radius: 12px;
            width: 100%;
            transition: all 0.3s ease;
            margin-top: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .btn-secondary-custom:hover {
            background: rgba(74, 92, 106, 0.2);
            border-color: #4A5C6A;
            transform: translateY(-2px);
        }
        
        .mb-3 {
            margin-bottom: 1.5rem;
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
            <link rel="stylesheet" href="./src/vendor/bootstrap/css/bootstrap.min.css">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            
            <div class="form-card">
                <h3 class="card-title">
                    <i class="bi bi-${this.user ? 'pencil-square' : 'person-plus-fill'} title-icon"></i>
                    ${this.user ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                
                <form @submit=${this.handleSubmit}>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">
                            <i class="bi bi-person-fill label-icon"></i> Nombre Completo
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

                    <div class="mb-3">
                        <label for="correo" class="form-label">
                            <i class="bi bi-envelope-fill label-icon"></i> Correo Electrónico
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

                    <div class="mb-3">
                        <label for="rol" class="form-label">
                            <i class="bi bi-shield-fill-check label-icon"></i> Rol
                        </label>
                        <select id="rol" class="form-select" .value=${this.user?.rol ?? "Usuario"}>
                            <option value="Usuario">Usuario</option>
                            <option value="Soporte">Soporte</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="estado" class="form-label">
                            <i class="bi bi-toggle-on label-icon"></i> Estado
                        </label>
                        <select id="estado" class="form-select" .value=${this.user?.estado ?? "Activo"}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-primary-custom">
                        <i class="bi bi-save-fill"></i> Guardar Usuario
                    </button>
                    
                    ${this.user ? html`
                        <button type="button" class="btn-secondary-custom" @click=${this.resetForm}>
                            <i class="bi bi-x-circle-fill"></i> Cancelar
                        </button>
                    ` : ''}
                </form>
            </div>
        `;
    }
}

customElements.define("user-form", UserForm);