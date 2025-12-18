import { LitElement, html, css } from "lit";

export class RegisterForm extends LitElement {
    static properties = {
        error: { type: String },
        success: { type: String },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.error = "";
        this.success = "";
        this.loading = false;
    }

    static styles = css`
        :host {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 9999;
        }

        .container {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
        padding: 20px;
        box-sizing: border-box;
        }

        .card {
        background: white;
        border-radius: 24px;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        max-width: 440px;
        width: 100%;
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        }

        .header {
        background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
        padding: 45px 35px;
        text-align: center;
        color: white;
        }

        .header h2 {
        margin: 0;
        font-size: 30px;
        font-weight: 700;
        }

        .header p {
        margin-top: 10px;
        font-size: 14px;
        opacity: 0.95;
        }

        .body {
        padding: 40px 35px;
        }

        .form-group {
        margin-bottom: 22px;
        }

        .label {
        display: block;
        margin-bottom: 8px;
        color: #1b263b;
        font-weight: 600;
        font-size: 14px;
        }

        .input-wrapper {
        position: relative;
        }

        .icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        }

        input {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border: 2px solid #e0e1dd;
        border-radius: 14px;
        font-size: 15px;
        box-sizing: border-box;
        }

        input:focus {
        outline: none;
        border-color: #415a77;
        box-shadow: 0 0 0 4px rgba(65, 90, 119, 0.1);
        }

        button {
        width: 100%;
        padding: 15px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
        color: white;
        cursor: pointer;
        transition: 0.3s;
        }

        button:hover:not(:disabled) {
        transform: translateY(-2px);
        }

        button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        }

        .alert {
        padding: 14px;
        border-radius: 12px;
        margin-bottom: 20px;
        font-size: 14px;
        color: white;
        }

        .error {
        background: linear-gradient(135deg, #dc3545, #c82333);
        }

        .success {
        background: linear-gradient(135deg, #16a34a, #15803d);
        }

        .footer {
        margin-top: 22px;
        text-align: center;
        }

        .footer a {
        color: #415a77;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        }

        .footer a:hover {
        text-decoration: underline;
        }
    `;

    async register(e) {
        e.preventDefault();
        if (this.loading) return;

        this.loading = true;
        this.error = "";
        this.success = "";

        const nombre = this.shadowRoot.querySelector("#nombre").value;
        const correo = this.shadowRoot.querySelector("#correo").value;
        const password = this.shadowRoot.querySelector("#password").value;

        try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, password })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            this.error = data.message || "Error al registrar";
            this.loading = false;
            return;
        }

        this.success = "Registro exitoso. Ahora puedes iniciar sesión.";
        this.shadowRoot.querySelector("form").reset();
        } catch {
        this.error = "Error al conectar con el servidor";
        } finally {
        this.loading = false;
        }
    }

    render() {
        return html`
        <div class="container">
            <div class="card">
            <div class="header">
                <h2>Crear cuenta</h2>
                <p>Regístrate para acceder al sistema</p>
            </div>

            <div class="body">
                ${this.error
                ? html`<div class="alert error">⚠️ ${this.error}</div>`
                : ""}
                ${this.success
                ? html`<div class="alert success">✅ ${this.success}</div>`
                : ""}

                <form @submit=${this.register}>
                <div class="form-group">
                    <label class="label">Nombre</label>
                    <div class="input-wrapper">
                    <span class="icon">👤</span>
                    <input id="nombre" required />
                    </div>
                </div>

                <div class="form-group">
                    <label class="label">Correo</label>
                    <div class="input-wrapper">
                    <span class="icon">📧</span>
                    <input id="correo" type="email" required />
                    </div>
                </div>

                <div class="form-group">
                    <label class="label">Contraseña</label>
                    <div class="input-wrapper">
                    <span class="icon">🔒</span>
                    <input id="password" type="password" required />
                    </div>
                </div>

                <button ?disabled=${this.loading}>
                    ${this.loading ? "Registrando..." : "Registrarse"}
                </button>
                </form>

                <div class="footer">
                <a @click=${() => this.dispatchEvent(
                    new CustomEvent("go-login", { bubbles: true, composed: true })
                )}>
                    ¿Ya tienes cuenta? Inicia sesión
                </a>
                </div>
            </div>
            </div>
        </div>
        `;
    }
}

customElements.define("register-form", RegisterForm);
