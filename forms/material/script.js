// Material Design Login Form
class MaterialLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.material-btn',
            hideOnSuccess: ['.social-login', '.signup-link'],
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
        this.injectKeyframes();
        this.setupRipples();
    }

    injectKeyframes() {
        if (document.getElementById('material-keyframes')) return;
        const style = document.createElement('style');
        style.id = 'material-keyframes';
        style.textContent = `
            @keyframes materialPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
            @keyframes materialSuccessScale { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }

    createRipple(event, container) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        container.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupRipples() {
        // Inputs ripple on focus
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.addEventListener('focus', (e) => {
                const r = input.parentNode.querySelector('.ripple-container');
                if (r) this.createRipple(e, r);
            });
        });

        // Submit ripple
        this.submitBtn?.addEventListener('click', (e) => {
            this.createRipple(e, this.submitBtn.querySelector('.btn-ripple'));
        });

        // Toggle ripple
        this.passwordToggle?.addEventListener('click', (e) => {
            this.createRipple(e, this.passwordToggle.querySelector('.toggle-ripple'));
        });

        // Social buttons ripple
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRipple(e, btn.querySelector('.social-ripple'));
            });
        });

        // Checkbox ripple
        const checkbox = document.querySelector('.checkbox-wrapper');
        checkbox?.addEventListener('click', (e) => {
            this.createRipple(e, checkbox.querySelector('.checkbox-ripple'));
        });
    }

    shakeForm() {
        if (this.submitBtn) {
            this.submitBtn.style.animation = 'materialPulse 0.3s ease';
            this.submitBtn.addEventListener('animationend', () => {
                this.submitBtn.style.animation = '';
            }, { once: true });
        }
    }

    onSuccess() {
        this.form.style.transition = 'all 0.3s ease';
        this.form.style.transform = 'translateY(-16px) scale(0.95)';
        this.form.style.opacity = '0';

        setTimeout(() => {
            this.form.style.display = 'none';
            ['.social-login', '.signup-link'].forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.style.display = 'none';
            });
            this.successMessage?.classList.add('show');
            const successIcon = this.successMessage?.querySelector('.success-icon');
            if (successIcon) successIcon.style.animation = 'materialSuccessScale 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => new MaterialLoginForm());
