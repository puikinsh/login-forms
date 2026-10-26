// Minimal Music Login Form
class MinimalMusicLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        if (this.passwordToggle && this.passwordInput) {
            this.passwordInput.addEventListener('input', () => {
                this.passwordToggle.style.transform =
                    this.passwordInput.type === 'text' ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new MinimalMusicLoginForm());
