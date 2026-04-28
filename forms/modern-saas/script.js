// Modern SaaS Login Form
class ModernSaaSLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.submit-btn',
            formGroupSelector: '.input-group',
            hideOnSuccess: ['.divider', '.social-buttons', '.signup-link'],
            validators: {
                email: FormUtils.validateEmail,
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Password is required' };
                    if (v.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        if (this.passwordToggle && this.passwordInput) {
            this.passwordInput.addEventListener('input', () => {
                this.passwordToggle.style.color =
                    this.passwordInput.type === 'text' ? '#635BFF' : '#8792a2';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ModernSaaSLoginForm());
