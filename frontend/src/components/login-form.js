import { LitElement, html, css } from "lit";

export class LoginForm extends LitElement {
    static properties = {
        error: { type: String },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.error = '';
        this.loading = false;
    }

    static styles = css`
        :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        }
        
        .login-container {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
        padding: 20px;
        box-sizing: border-box;
        }

        .login-card {
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

        .login-header {
        background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
        padding: 45px 35px;
        text-align: center;
        color: white;
        position: relative;
        overflow: hidden;
        }

        .login-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(119,141,169,0.2) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
        }

        .login-header h2 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 10px;
        position: relative;
        z-index: 1;
        }

        .login-header p {
        margin: 0;
        opacity: 0.95;
        font-size: 15px;
        position: relative;
        z-index: 1;
        }

        .login-body {
        padding: 40px 35px;
        background: #ffffff;
        }

        .form-group {
        margin-bottom: 24px;
        position: relative;
        }

        .form-label {
        display: block;
        margin-bottom: 8px;
        color: #1b263b;
        font-weight: 600;
        font-size: 14px;
        padding-left: 4px;
        }

        .input-wrapper {
        position: relative;
        }

        .input-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        z-index: 1;
        }

        .form-control {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border: 2px solid #e0e1dd;
        border-radius: 14px;
        font-size: 15px;
        transition: all 0.3s ease;
        background: #ffffff;
        color: #0d1b2a;
        box-sizing: border-box;
        }

        .form-control::placeholder {
        color: #778da9;
        }

        .form-control:focus {
        outline: none;
        border-color: #415a77;
        box-shadow: 0 0 0 4px rgba(65, 90, 119, 0.1);
        background: #ffffff;
        }

        .form-control:disabled {
        background: #f8f9fa;
        cursor: not-allowed;
        opacity: 0.7;
        }

        .btn-login {
        width: 100%;
        padding: 15px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 8px;
        box-shadow: 0 4px 15px rgba(27, 38, 59, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        }

        .btn-login:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(27, 38, 59, 0.4);
        background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
        }

        .btn-login:active:not(:disabled) {
        transform: scale(0.98);
        }

        .btn-login:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
        }

        .alert {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        padding: 14px 18px;
        border-radius: 12px;
        margin-bottom: 24px;
        animation: shake 0.5s ease;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        .alert strong {
        margin-right: 6px;
        }

        @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        .spinner-border {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
        to { transform: rotate(360deg); }
        }

        .forgot-password {
        text-align: center;
        margin-top: 24px;
        }

        .forgot-password a {
        color: #415a77;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        transition: color 0.3s ease;
        }

        .forgot-password a:hover {
        color: #1b263b;
        text-decoration: underline;
        }
    `;

    async login(e) {
        e.preventDefault();
        
        if (this.loading) return;
        
        this.loading = true;
        this.error = '';

        const correo = this.shadowRoot.querySelector("#correo").value;
        const password = this.shadowRoot.querySelector("#password").value;

        try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        const data = await res.json();

        if (!res.ok) {
            this.error = data.message || "Credenciales inválidas";
            this.loading = false;
            return;
        }

        // Guardar en localStorage como en el código original
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Recargar la página para que el index.html detecte el usuario
        window.location.reload();
        
        } catch (err) {
        this.error = "Error al conectar con el servidor";
        this.loading = false;
        }
    }

    render() {
        return html`
        <div class="login-container">
            <div class="login-card">
            <div class="login-header">
                <h2>¡Bienvenido!</h2>
                <p>Inicia sesión para continuar</p>
            </div>
            
            <div class="login-body">
                ${this.error ? html`
                <div class="alert" role="alert">
                    <strong>⚠️</strong> ${this.error}
                </div>
                ` : ''}

                <form @submit=${this.login}>
                <div class="form-group">
                    <label class="form-label" for="correo">Correo electrónico</label>
                    <div class="input-wrapper">
                    <span class="input-icon">📧</span>
                    <input
                        type="email"
                        class="form-control"
                        id="correo"
                        placeholder="nombre@ejemplo.com"
                        required
                        ?disabled=${this.loading}
                    />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Contraseña</label>
                    <div class="input-wrapper">
                    <span class="input-icon">🔒</span>
                    <input
                        type="password"
                        class="form-control"
                        id="password"
                        placeholder="Ingresa tu contraseña"
                        required
                        ?disabled=${this.loading}
                    />
                    </div>
                </div>

                <button 
                    type="submit" 
                    class="btn-login"
                    ?disabled=${this.loading}
                >
                    ${this.loading ? html`
                    <span class="spinner-border"></span>
                    <span>Iniciando sesión...</span>
                    ` : 'Iniciar sesión'}
                </button>
                </form>

                <div class="forgot-password">
                <a href="#" @click=${(e) => e.preventDefault()}>¿Olvidaste tu contraseña?</a>
                </div>
            </div>
            </div>
        </div>
        `;
    }
}

customElements.define("login-form", LoginForm);