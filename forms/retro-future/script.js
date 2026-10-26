// Retro Future Login Form
class RetroFutureLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.retro-button',
            formGroupSelector: '.retro-field',
            cardSelector: '.future-card',
            hideOnSuccess: ['.future-social', '.future-signup', '.retro-divider'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        // Hologram effect on focus
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.setAttribute('placeholder', ' ');
            input.addEventListener('focus', () => {
                const c = input.closest('.field-chrome');
                if (!c) return;
                c.style.transform = 'translateZ(10px)';
                c.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4)';
            });
            input.addEventListener('blur', () => {
                const c = input.closest('.field-chrome');
                if (!c) return;
                c.style.transform = 'translateZ(0)';
                c.style.boxShadow = '';
            });
        });

        // Chrome press effect
        document.querySelectorAll('.retro-button, .social-retro, .retro-checkbox').forEach(el => {
            el.addEventListener('mousedown', () => { el.style.filter = 'brightness(1.2) contrast(1.1)'; });
            el.addEventListener('mouseup', () => { el.style.filter = ''; });
            el.addEventListener('mouseleave', () => { el.style.filter = ''; });
        });

        // Random matrix glitch on card via rAF
        const card = document.querySelector('.future-card');
        if (card) {
            let last = 0;
            const tick = (now) => {
                if (FormUtils.prefersReducedMotion()) return;
                if (!document.body.contains(card)) return;
                if (now - last > 3000) {
                    last = now;
                    if (Math.random() < 0.15) {
                        card.style.filter = 'hue-rotate(90deg) saturate(1.5)';
                        card.style.transform = 'translate(1px, -1px)';
                        setTimeout(() => {
                            card.style.filter = '';
                            card.style.transform = '';
                        }, 100);
                    }
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
    }

    onSuccess() {
        this.form.style.transition = 'all 0.3s ease';
        this.form.style.transform = 'scale(0.9) rotateX(15deg)';
        this.form.style.opacity = '0';
        this.form.style.filter = 'blur(3px)';

        setTimeout(() => {
            this.form.style.display = 'none';
            this.hideOnSuccess.forEach(sel => {
                const el = this.root.querySelector(sel);
                if (el) el.style.display = 'none';
            });
            this.revealSuccess();
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => new RetroFutureLoginForm());
