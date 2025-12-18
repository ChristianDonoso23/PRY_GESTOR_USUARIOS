// user-app.js
import { LitElement, html, css } from "lit";
import "./user-form.js";
import "./user-list.js";

export class UserApp extends LitElement {
    static properties = {
        selectedUser: { state: true }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 2rem 0; /* Solo vertical, el horizontal lo controla el grid */
        }

        .main-header {
            background: linear-gradient(135deg, #1b263b 0%, #415a77 100%);
            color: white;
            padding: 2.5rem 2rem;
            border-radius: 20px;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
            margin-left: 2rem;
            margin-right: 2rem;
        }

        .main-header h1 {
            font-weight: 700;
            font-size: 2.2rem;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }

        .main-header p {
            margin: 0.75rem 0 0 0;
            opacity: 0.95;
            font-size: 1.05rem;
        }

        .content-grid {
            display: grid;
            grid-template-columns: minmax(360px, 420px) 1fr;
            gap: 3rem;
            align-items: start; /* Cambiado de stretch a start para mejor alineación vertical */
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem; /* ← Padding horizontal simétrico para ambas columnas */
            box-sizing: border-box;
        }

        @media (max-width: 1400px) {
            .content-grid {
                padding: 0 1.5rem;
            }
            .main-header {
                margin-left: 1.5rem;
                margin-right: 1.5rem;
            }
        }

        @media (max-width: 1200px) {
            .content-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
                padding: 0 2rem;
            }
            .main-header {
                margin-left: 2rem;
                margin-right: 2rem;
            }
        }

        @media (max-width: 768px) {
            :host {
                padding: 1rem 0;
            }

            .content-grid {
                padding: 0 1rem;
            }

            .main-header {
                padding: 1.5rem;
                margin-left: 1rem;
                margin-right: 1rem;
            }

            .main-header h1 {
                font-size: 1.5rem;
                gap: 10px;
            }

            .main-header p {
                font-size: 0.9rem;
            }
        }
    `;

    constructor() {
        super();
        this.selectedUser = null;
    }

    handleReload() {
        this.shadowRoot
            .getElementById("userList")
            .loadUsers();

        this.selectedUser = null;
    }

    render() {
        return html`
            <div class="main-header">
                <h1><span>👥</span> Gestión de Usuarios</h1>
                <p>Sistema de administración y control de usuarios</p>
            </div>

            <div class="content-grid">
                <user-form
                    .user=${this.selectedUser}
                    @user-saved=${this.handleReload}>
                </user-form>

                <user-list
                    id="userList"
                    @edit-user=${e => this.selectedUser = e.detail}>
                </user-list>
            </div>
        `;
    }
}

customElements.define("user-app", UserApp);