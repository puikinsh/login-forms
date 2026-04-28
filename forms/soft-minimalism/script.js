// Soft Minimalism Login Form
class SoftMinimalismLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.comfort-button',
            formGroupSelector: '.soft-field',
            cardSelector: '.soft-card',
            hideOnSuccess: ['.comfort-social', '.comfort-signup', '.gentle-divider'],
            validators: {
                email: FormUtils.validateEmail,
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Please enter your password' };
                    if (v.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        // Soft hover lift on field containers
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.setAttribute('placeholder', ' ');
            input.addEventListener('focus', () => {
                const c = input.closest('.field-container');
                if (c) c.style.transform = 'translateY(-1px)';
            });
            input.addEventListener('blur', () => {
                const c = input.closest('.field-container');
                if (c) c.style.transform = 'translateY(0)';
            });
        });

        // Press effect on interactive elements
        document.querySelectorAll('.comfort-button, .social-soft, .gentle-checkbox').forEach(el => {
            el.addEventListener('mousedown', () => { el.style.transform = 'scale(0.98)'; });
            el.addEventListener('mouseup', () => { el.style.transform = 'scale(1)'; });
            el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new SoftMinimalismLoginForm());
