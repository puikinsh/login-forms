// Neumorphism Login Form
class NeumorphismLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.social-login', '.signup-link'],
            cardSelector: '.login-card',
            validators: {
                email: FormUtils.validateEmail,
                password: (value) => {
                    if (!value) return { isValid: false, message: 'Password is required' };
                    if (value.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        // Hover scale on neumorphic surfaces
        document.querySelectorAll('.neu-icon, .neu-checkbox, .neu-social').forEach(el => {
            el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.05)'; });
            el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        });

        // Ambient light shadow that follows mouse
        const card = document.querySelector('.login-card');
        if (card) {
            document.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                card.style.boxShadow = `${x * 30}px ${y * 30}px 60px #bec3cf, ${-x * 30}px ${-y * 30}px 60px #ffffff`;
            });
        }
    }

    onInputFocus(e) {
        super.onInputFocus(e);
        const group = e.target.closest('.neu-input');
        if (group) group.style.transform = 'scale(0.98)';
    }

    onInputBlur(e) {
        super.onInputBlur(e);
        const group = e.target.closest('.neu-input');
        if (group) group.style.transform = 'scale(1)';
    }
}

document.addEventListener('DOMContentLoaded', () => new NeumorphismLoginForm());
