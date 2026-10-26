// Modern SaaS Login Form
class ModernSaaSLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.submit-btn',
            formGroupSelector: '.input-group',
            hideOnSuccess: ['.divider', '.social-buttons', '.signup-link'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        if (this.passwordToggle && this.passwordInput) {
            this.passwordInput.addEventListener('input', () => {
                this.passwordToggle.style.color =
                    this.passwordInput.type === 'text' ? '#635BFF' : '#8792a2';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ModernSaaSLoginForm());
