// Gradient Wave Login Form
class GradientWaveLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            submitButtonSelector: '.gradient-button',
            hideOnSuccess: ['.social-login', '.signup-link'],
            validators: {
                email: FormUtils.validateEmail,
                password: (value) => {
                    if (!value) return { isValid: false, message: 'Password is required' };
                    if (value.length < 6) return { isValid: false, message: 'Password must be at least 6 characters long' };
                    return { isValid: true };
                },
            },
        });
        this.particleIntervals = [];
    }

    decorate() {
        this.injectKeyframes();
        this.setupCardTilt();
        this.animateParticles();
        this.setupRipples();
    }

    injectKeyframes() {
        if (document.getElementById('gradient-wave-keyframes')) return;
        const style = document.createElement('style');
        style.id = 'gradient-wave-keyframes';
        style.textContent = `
            @keyframes rippleAnimation { to { transform: scale(4); opacity: 0; } }
            @keyframes waveShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    setupCardTilt() {
        const card = document.querySelector('.login-card');
        if (!card) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const dx = (x - rect.width / 2) / (rect.width / 2);
            const dy = (y - rect.height / 2) / (rect.height / 2);
            card.style.transform = `perspective(1000px) rotateX(${dy * 5}deg) rotateY(${-dx * 5}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    }

    // Random particle drift — uses requestAnimationFrame instead of setInterval
    // so the animation pauses with the tab and is GC'd cleanly when the form is removed.
    animateParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            let last = 0;
            const tick = (now) => {
                if (!document.body.contains(particle)) return;
                if (now - last > 2000 + index * 500) {
                    last = now;
                    const rx = Math.random() * 20 - 10;
                    const ry = Math.random() * 20 - 10;
                    particle.style.transform = `translate(${rx}px, ${ry}px)`;
                }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    setupRipples() {
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => {
                this.createRipple(e, this.submitBtn.querySelector('.button-ripple') || this.submitBtn);
            });
        }
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.createRipple(e, btn));
        });
    }

    createRipple(event, container) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute; border-radius: 50%;
            background: rgba(255,255,255,0.3); transform: scale(0);
            animation: rippleAnimation 0.6s linear;
            left: ${event.clientX - rect.left - size / 2}px;
            top: ${event.clientY - rect.top - size / 2}px;
            width: ${size}px; height: ${size}px;
            pointer-events: none;
        `;
        container.style.position = container.style.position || 'relative';
        container.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }

    shakeForm() {
        if (this.submitBtn) {
            this.submitBtn.style.animation = 'waveShake 0.5s ease-in-out';
            this.submitBtn.addEventListener('animationend', () => {
                this.submitBtn.style.animation = '';
            }, { once: true });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new GradientWaveLoginForm());
