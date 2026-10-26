// Eco Wellness Login Form
class EcoWellnessLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.harmony-button',
            formGroupSelector: '.organic-field',
            hideOnSuccess: ['.natural-social', '.nurture-signup', '.balance-divider'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        if (!document.getElementById('wellness-keyframes')) {
            const style = document.createElement('style');
            style.id = 'wellness-keyframes';
            style.textContent = `
                @keyframes gentleBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.01); } }
            `;
            document.head.appendChild(style);
        }

        // Mindful breathing animation on focus
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.setAttribute('placeholder', ' ');
            input.addEventListener('focus', () => {
                const nature = input.closest('.organic-field')?.querySelector('.field-nature');
                if (nature) nature.style.animation = 'gentleBreath 3s ease-in-out infinite';
            });
            input.addEventListener('blur', () => {
                const nature = input.closest('.organic-field')?.querySelector('.field-nature');
                if (nature) nature.style.animation = '';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new EcoWellnessLoginForm());
