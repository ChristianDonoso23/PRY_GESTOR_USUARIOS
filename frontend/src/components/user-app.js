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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .main-header {
            background: linear-gradient(135deg, #123499, #0d2472);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .main-header h1 {
            font-weight: 700;
            font-size: 2rem;
            margin: 0;
        }

        .main-header p {
            margin: 0.5rem 0 0 0;
            opacity: 0.95;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }

        @media (max-width: 768px) {
            .main-header h1 {
                font-size: 1.5rem;
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
            <div class="container">
                <div class="main-header">
                    <h1>👥 Gestión de Usuarios</h1>
                    <p>Sistema de administración y control de usuarios</p>
                </div>

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