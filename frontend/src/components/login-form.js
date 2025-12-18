import { LitElement, html, css } from "lit";

export class LoginForm extends LitElement {
    static properties = {
        error: { type: String },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.error = "";
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
        }

        .header {
        background: linear-gradient(135deg, #1b263b, #415a77);
        padding: 45px 35px;
        text-align: center;
        color: white;
        }

        .header h2 {
        margin: 0;
        font-size: 32px;
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
        font-weight: 600;
        color: #1b263b;
        }

        .input-wrapper {
        position: relative;
        }

        .icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        }

        input {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border-radius: 14px;
        border: 2px solid #e0e1dd;
        font-size: 15px;
        box-sizing: border-box; /* 🔑 CLAVE */
        }


        button {
        width: 100%;
        padding: 15px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #1b263b, #415a77);
        color: white;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        }

        button:disabled {
        opacity: 0.7;
        }

        .alert {
        background: #dc2626;
        color: white;
        padding: 14px;
        border-radius: 12px;
        margin-bottom: 20px;
        }

        .footer {
        text-align: center;
        margin-top: 22px;
        }

        .footer a {
        color: #415a77;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        }

        .footer a:hover {
        text-decoration: underline;
        }
    `;

    async login(e) {
        e.preventDefault();
        if (this.loading) return;

        this.loading = true;
        this.error = "";

        const correo = this.shadowRoot.querySelector("#correo").value;
        const password = this.shadowRoot.querySelector("#password").value;

        try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            this.error = data.message || "Credenciales inválidas";
            this.loading = false;
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        location.reload();

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
                <h2>Bienvenido</h2>
                <p>Inicia sesión para continuar</p>
            </div>

            <div class="body">
                ${this.error ? html`<div class="alert">${this.error}</div>` : ""}

                <form @submit=${this.login}>
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
                    ${this.loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
                </form>

                <div class="footer">
                <a @click=${() =>
                    this.dispatchEvent(
                    new CustomEvent("go-register", {
                        bubbles: true,
                        composed: true
                    })
                    )
                }>
                    ¿No tienes cuenta? Regístrate
                </a>
                </div>
            </div>
            </div>
        </div>
        `;
    }
}

customElements.define("login-form", LoginForm);
