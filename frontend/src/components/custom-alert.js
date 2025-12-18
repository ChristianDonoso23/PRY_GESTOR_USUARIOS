import { LitElement, html, css } from 'lit';

export class CustomAlert extends LitElement {
    static properties = {
        message: { type: String },
        type: { type: String }, // 'success', 'danger', 'warning'
        visible: { type: Boolean }
    };

    constructor() {
        super();
        this.visible = false;
        this.message = '';
        this.type = 'info';
    }

    showAlert(msg, type = 'info') {
        this.message = msg;
        this.type = type;
        this.visible = true;
        this.requestUpdate();

        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            this.visible = false;
        }, 3000);
    }

    render() {
        if (!this.visible) return html``;

        return html`
            <link rel="stylesheet" href="/src/vendor/bootstrap/css/bootstrap.min.css">
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050">
                <div class="toast show align-items-center text-white bg-${this.type} border-0" role="alert">
                    <div class="d-flex">
                        <div class="toast-body">
                            ${this.message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="${() => this.visible = false}"></button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('custom-alert', CustomAlert);