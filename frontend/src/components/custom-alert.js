import { LitElement, html, css } from 'lit';

export class CustomAlert extends LitElement {
    static properties = {
        message: { type: String },
        type: { type: String }, // 'success', 'error', 'warning'
        open: { type: Boolean }
    };

    static styles = css`
        :host {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        }

        .toast {
            background: white;
            color: #333;
            min-width: 300px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 6px solid #ccc;
            pointer-events: auto;
            font-family: 'Segoe UI', sans-serif;
        }

        .toast.open {
            transform: translateX(0);
        }

        .toast.success { border-left-color: #2ecc71; }
        .toast.success .icon { color: #2ecc71; }

        .toast.error { border-left-color: #e74c3c; }
        .toast.error .icon { color: #e74c3c; }

        .toast.warning { border-left-color: #f1c40f; }
        .toast.warning .icon { color: #f1c40f; }

        .content {
            flex: 1;
        }

        .title {
            font-weight: 700;
            font-size: 0.9rem;
            display: block;
            margin-bottom: 2px;
        }

        .msg {
            font-size: 0.85rem;
            color: #666;
        }

        .close-btn {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
        }
    `;

    constructor() {
        super();
        this.open = false;
        this.message = '';
        this.type = 'info';
    }

    // Método público para invocar la alerta desde otros componentes
    notify(message, type = 'success') {
        this.message = message;
        this.type = type;
        this.open = true;
        
        // Auto-cierre a los 4 segundos
        setTimeout(() => {
            this.open = false;
        }, 4000);
    }

    render() {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        const titles = {
            success: '¡Éxito!',
            error: 'Error',
            warning: 'Atención'
        };

        return html`
            <div class="toast ${this.open ? 'open' : ''} ${this.type}">
                <div class="icon">${icons[this.type] || 'ℹ️'}</div>
                <div class="content">
                    <span class="title">${titles[this.type]}</span>
                    <span class="msg">${this.message}</span>
                </div>
                <button class="close-btn" @click=${() => this.open = false}>&times;</button>
            </div>
        `;
    }
}

customElements.define('custom-alert', CustomAlert);