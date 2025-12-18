// ticket-form.js
import { LitElement, html, css } from "lit";
import { TicketService } from "../services/ticket.service.js";

export class TicketForm extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .card-custom {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }

        .card-header-custom {
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            padding: 1.5rem 1.75rem;
            font-weight: 700;
            font-size: 1.15rem;
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

        .form-control, .form-select, textarea {
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

        textarea {
            min-height: 120px;
            resize: vertical;
        }

        .form-control:focus, .form-select:focus, textarea:focus {
            outline: none;
            border-color: #415a77;
            box-shadow: 0 0 0 4px rgba(65, 90, 119, 0.1);
        }

        .btn-primary {
            width: 100%;
            padding: 0.95rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(27, 38, 59, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 1rem;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(27, 38, 59, 0.4);
        }
    `;

    get rol() {
        const token = localStorage.getItem("token");
        if (!token) return "Usuario";
        try {
            return JSON.parse(atob(token.split(".")[1])).rol;
        } catch {
            return "Usuario";
        }
    }

    async submit(e) {
        e.preventDefault();

        const data = {
            titulo: this.shadowRoot.getElementById("titulo").value,
            descripcion: this.shadowRoot.getElementById("descripcion").value,
            prioridad: this.shadowRoot.getElementById("prioridad").value
        };

        await TicketService.create(data);
        this.dispatchEvent(new CustomEvent("ticket-updated", { bubbles: true, composed: true }));
        e.target.reset();
    }

    render() {
        if (!["Admin", "Usuario"].includes(this.rol)) return html``;

        return html`
            <div class="card-custom">
                <div class="card-header-custom">
                    ➕ Nuevo Ticket
                </div>
                <div class="card-body-custom">
                    <form @submit=${this.submit}>
                        <div class="form-group">
                            <label class="form-label">📌 Título</label>
                            <input id="titulo" class="form-control" required placeholder="Ingrese un título claro">
                        </div>

                        <div class="form-group">
                            <label class="form-label">📝 Descripción</label>
                            <textarea id="descripcion" class="form-control" required placeholder="Describa el problema o solicitud"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">🔥 Prioridad</label>
                            <select id="prioridad" class="form-select">
                                <option value="Baja">Baja</option>
                                <option value="Media" selected>Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>

                        <button type="submit" class="btn-primary">
                            💾 Crear Ticket
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define("ticket-form", TicketForm);