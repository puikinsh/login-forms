// Brutalist Login Form
class BrutalistLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.social-login', '.signup-link'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        if (this.passwordInput && this.passwordToggle) {
            const updateLabel = () => {
                const txt = this.passwordToggle.querySelector('.toggle-text');
                if (txt) txt.textContent = this.passwordInput.type === 'password' ? 'SHOW' : 'HIDE';
            };
            this.passwordToggle.addEventListener('click', () => setTimeout(updateLabel, 0));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new BrutalistLoginForm());
