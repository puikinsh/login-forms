// Glassmorphism Login Form
class GlassmorphismLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
        });
    }

    decorate() {
        FormUtils.addEntranceAnimation(document.querySelector('.login-card'));

        // Stagger inputs on entrance
        this.form.querySelectorAll('input').forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(10px)';
            setTimeout(() => {
                input.style.transition = 'all 0.4s ease';
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, 200 + index * 150);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new GlassmorphismLoginForm());
