// AI Assistant Login Form
class AIAssistantLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.neural-button',
            formGroupSelector: '.smart-field',
            hideOnSuccess: ['.neural-social', '.signup-section', '.auth-separator'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
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
