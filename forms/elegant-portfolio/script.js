// Elegant Portfolio Login Form
class ElegantPortfolioLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.signin-button',
            formGroupSelector: '.form-field',
            hideOnSuccess: ['.auth-divider', '.social-auth', '.signup-prompt'],
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
        ['email', 'password'].forEach(id => {
            const input = this.form.querySelector('#' + id);
            if (input) input.setAttribute('placeholder', ' ');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ElegantPortfolioLoginForm());
