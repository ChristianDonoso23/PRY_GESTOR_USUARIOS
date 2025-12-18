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
        }
        
        .header-section {
            background: linear-gradient(135deg, #11212D 0%, #06141B 100%);
            padding: 3rem 2.5rem;
            border-radius: 24px 24px 0 0;
            box-shadow: 0 10px 40px rgba(6, 20, 27, 0.6);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(155, 186, 171, 0.1);
        }
        
        .header-section::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(155, 186, 171, 0.08) 0%, transparent 70%);
            border-radius: 50%;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .main-title {
            color: #CCD0CF;
            font-weight: 700;
            font-size: 2.8rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            letter-spacing: -0.5px;
        }
        
        .title-icon {
            color: #9BBA AB;
            filter: drop-shadow(0 0 12px rgba(155, 186, 171, 0.3));
        }
        
        .subtitle {
            color: #4A5C6A;
            font-weight: 500;
            font-size: 1.15rem;
            margin: 0;
        }
        
        .content-wrapper {
            background: #11212D;
            padding: 2.5rem;
            border-radius: 0 0 24px 24px;
            box-shadow: 0 10px 40px rgba(6, 20, 27, 0.6);
            border: 1px solid rgba(155, 186, 171, 0.1);
            border-top: none;
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
            <link rel="stylesheet" href="./src/vendor/bootstrap/css/bootstrap.min.css">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            
            <div class="header-section">
                <div class="header-content">
                    <h1 class="main-title">
                        <i class="bi bi-people-fill title-icon"></i>
                        Gestión de Usuarios
                    </h1>
                    <p class="subtitle">Sistema de administración y control de usuarios</p>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="row g-4">
                    <div class="col-lg-4">
                        <user-form
                            .user=${this.selectedUser}
                            @user-saved=${this.handleReload}>
                        </user-form>
                    </div>

                    <div class="col-lg-8">
                        <user-list
                            id="userList"
                            @edit-user=${e => this.selectedUser = e.detail}>
                        </user-list>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("user-app", UserApp);