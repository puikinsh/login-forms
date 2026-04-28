// Brutalist Login Form
class BrutalistLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.social-login', '.signup-link'],
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
