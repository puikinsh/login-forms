// AI Assistant Login Form
class AIAssistantLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.neural-button',
            formGroupSelector: '.smart-field',
            hideOnSuccess: ['.neural-social', '.signup-section', '.auth-separator'],
            validators: {
                email: (v) => {
                    if (!v) return { isValid: false, message: 'Neural access requires email address' };
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { isValid: false, message: 'Invalid email format detected' };
                    return { isValid: true };
                },
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Security key required for access' };
                    if (v.length < 6) return { isValid: false, message: 'Security key must be at least 6 characters' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.setAttribute('placeholder', ' ');
            input.addEventListener('focus', () => {
                const indicator = input.closest('.smart-field')?.querySelector('.ai-indicator');
                if (!indicator) return;
                indicator.style.opacity = '1';
                setTimeout(() => { indicator.style.opacity = ''; }, 2000);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new AIAssistantLoginForm());
