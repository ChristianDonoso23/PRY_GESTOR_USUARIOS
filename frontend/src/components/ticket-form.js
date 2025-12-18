import { LitElement, html, css } from "lit";
import { TicketService } from "../services/ticket.service.js";
import { UserService } from "../services/user.service.js"; 

export class TicketForm extends LitElement {
    static properties = {
        soportes: { state: true },
        loading: { state: true }
    };

    static styles = css`
        :host { display: block; }
        
        .card-custom {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding: 2rem;
        }

        h2 {
            margin-top: 0;
            color: #1b263b;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 1rem;
        }

        .form-group { margin-bottom: 1.2rem; }
        
        .form-label {
            display: block;
            font-weight: 600;
            color: #415a77;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .form-control, .form-select {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
            font-family: inherit;
        }

        .form-control:focus, .form-select:focus {
            border-color: #415a77;
            outline: none;
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

        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 1rem;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(27, 38, 59, 0.4);
        }
    `;

    constructor() {
        super();
        this.soportes = [];
        this.loading = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadSoportes();
    }

    async loadSoportes() {
        try {
            this.soportes = await UserService.getSoportes(); 
        } catch (error) {
            console.error("Error cargando soportes", error);
            // Usamos tu sistema de notificación existente
            this.dispatchNotify('Error al cargar agentes de soporte', 'error');
        }
    }

    // Método auxiliar para disparar notificaciones
    dispatchNotify(msg, type) {
        this.dispatchEvent(new CustomEvent('notify', {
            detail: { msg, type },
            bubbles: true,
            composed: true
        }));
    }

    // Nueva lógica de validación visual
    validateInputs() {
        const inputs = this.shadowRoot.querySelectorAll('[required]');
        let isValid = true;
        let firstError = null;

        inputs.forEach(input => {
            // Limpiar estado previo
            input.classList.remove('input-error');

            if (!input.value.trim()) {
                input.classList.add('input-error');
                isValid = false;
                if (!firstError) firstError = input;

                // UX: Limpiar error apenas el usuario escriba
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

    async submit(e) {
        e.preventDefault();
        
        // 1. Validar antes de procesar
        if (!this.validateInputs()) return;

        this.loading = true;

        const titulo = this.shadowRoot.getElementById('titulo').value;
        const descripcion = this.shadowRoot.getElementById('descripcion').value;
        const prioridad = this.shadowRoot.getElementById('prioridad').value;
        const asignadoA = this.shadowRoot.getElementById('asignado').value;

        try {
            await TicketService.create({
                titulo,
                descripcion,
                prioridad,
                asignado_a: asignadoA || null
            });

            this.dispatchNotify('Ticket creado y asignado correctamente', 'success');
            
            this.dispatchEvent(new CustomEvent('ticket-saved', {
                bubbles: true,
                composed: true
            }));

            this.resetForm();

        } catch (error) {
            this.dispatchNotify('Error al crear el ticket en el servidor', 'error');
        } finally {
            this.loading = false;
        }
    }

    resetForm() {
        this.shadowRoot.querySelector('form').reset();
        // Asegurar que se limpien estilos de error si quedaron
        this.shadowRoot.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }

    render() {
        return html`
            <div class="card-custom">
                <h2>➕ Nuevo Ticket Administrativo</h2>
                
                <form @submit=${this.submit} novalidate>
                    <div class="form-group">
                        <label class="form-label">Título del Incidente</label>
                        <input id="titulo" class="form-control" required placeholder="Ej: Error en servidor de correos">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Descripción Detallada</label>
                        <textarea id="descripcion" class="form-control" required placeholder="Detalle el problema..."></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Asignar a Agente de Soporte</label>
                        <select id="asignado" class="form-select" required>
                            <option value="" disabled selected>Seleccione un agente...</option>
                            ${this.soportes.map(soporte => html`
                                <option value="${soporte.id}">👤 ${soporte.nombre} (${soporte.correo})</option>
                            `)}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Nivel de Prioridad</label>
                        <select id="prioridad" class="form-select">
                            <option value="Baja">🟢 Baja</option>
                            <option value="Media" selected>🟡 Media</option>
                            <option value="Alta">🔴 Alta</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-primary" ?disabled=${this.loading}>
                        ${this.loading ? 'Guardando...' : 'Crear y Asignar Ticket'}
                    </button>
                </form>
            </div>
        `;
    }
}

customElements.define("ticket-form", TicketForm);