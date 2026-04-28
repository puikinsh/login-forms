// Minimal Music Login Form
class MinimalMusicLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
            validators: {
                email: FormUtils.validateEmail,
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Password is required' };
                    if (v.length < 6) return { isValid: false, message: 'Password must be at least 6 characters long' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        if (this.passwordToggle && this.passwordInput) {
            this.passwordInput.addEventListener('input', () => {
                this.passwordToggle.style.transform =
                    this.passwordInput.type === 'text' ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new MinimalMusicLoginForm());
