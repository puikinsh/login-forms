// Elegant Portfolio Login Form
class ElegantPortfolioLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.signin-button',
            formGroupSelector: '.form-field',
            hideOnSuccess: ['.auth-divider', '.social-auth', '.signup-prompt'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        ['email', 'password'].forEach(id => {
            const input = this.form.querySelector('#' + id);
            if (input) input.setAttribute('placeholder', ' ');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ElegantPortfolioLoginForm());
