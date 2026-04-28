// Neon Cyber Login Form
class NeonCyberLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.neon-button',
            formGroupSelector: '.cyber-field',
            cardSelector: '.cyber-terminal',
            hideOnSuccess: ['.matrix-social', '.matrix-signup', '.cyber-divider'],
            validators: {
                email: (v) => {
                    if (!v) return { isValid: false, message: '[ ERROR: EMAIL_REQUIRED ]' };
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { isValid: false, message: '[ ERROR: INVALID_FORMAT ]' };
                    return { isValid: true };
                },
                password: (v) => {
                    if (!v) return { isValid: false, message: '[ ERROR: ACCESS_CODE_REQUIRED ]' };
                    if (v.length < 6) return { isValid: false, message: '[ ERROR: CODE_TOO_SHORT ]' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        if (!document.getElementById('neon-cyber-keyframes')) {
            const style = document.createElement('style');
            style.id = 'neon-cyber-keyframes';
            style.textContent = `
                @keyframes textGlitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 1px); }
                    40% { transform: translate(2px, -1px); }
                    60% { transform: translate(-1px, 2px); }
                    80% { transform: translate(1px, -2px); }
                }
            `;
            document.head.appendChild(style);
        }

        // Cyber-scan effect on field focus
        [this.form.querySelector('#email'), this.form.querySelector('#password')].forEach(input => {
            if (!input) return;
            input.setAttribute('placeholder', ' ');
            input.addEventListener('focus', () => {
                const scanner = input.closest('.cyber-field')?.querySelector('.cyber-scanner');
                if (scanner) scanner.style.opacity = '1';
            });
            input.addEventListener('blur', () => {
                const scanner = input.closest('.cyber-field')?.querySelector('.cyber-scanner');
                if (scanner) scanner.style.opacity = '0.3';
            });
        });

        // Random title glitch using requestAnimationFrame
        const titleGlitch = document.querySelector('.title-glitch');
        if (titleGlitch) {
            let last = 0;
            const tick = (now) => {
                if (!document.body.contains(titleGlitch)) return;
                if (now - last > 2000) {
                    last = now;
                    if (Math.random() < 0.1) {
                        titleGlitch.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                        titleGlitch.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                        setTimeout(() => {
                            titleGlitch.style.transform = '';
                            titleGlitch.style.filter = '';
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
        this.form.style.transform = 'scale(0.9)';
        this.form.style.opacity = '0';
        this.form.style.filter = 'blur(2px)';

        setTimeout(() => {
            this.form.style.display = 'none';
            this.hideOnSuccess.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.style.display = 'none';
            });
            this.successMessage?.classList.add('show');
            setTimeout(() => {
                const successTitle = document.querySelector('.success-title');
                if (successTitle) {
                    successTitle.style.animation = 'textGlitch 0.5s ease-in-out';
                    successTitle.addEventListener('animationend', () => {
                        successTitle.style.animation = '';
                    }, { once: true });
                }
            }, 1500);
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => new NeonCyberLoginForm());
