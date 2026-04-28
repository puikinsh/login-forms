// Creative Portal Login Form
class CreativeLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.creative-social', '.signup-link'],
            validators: {
                email: (v) => {
                    if (!v) return { isValid: false, message: 'Your creative email is required' };
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { isValid: false, message: 'Please enter a valid email address' };
                    return { isValid: true };
                },
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Your creative password is required' };
                    if (v.length < 6) return { isValid: false, message: 'Password needs at least 6 characters to unlock creativity' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        this.injectKeyframes();

        // Floating shapes parallax
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const mx = e.clientX / window.innerWidth;
            const my = e.clientY / window.innerHeight;
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.5;
                shape.style.transform = `translate(${(mx - 0.5) * speed * 20}px, ${(my - 0.5) * speed * 20}px)`;
            });
        });

        // Card tilt
        const card = document.querySelector('.login-card');
        if (card) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                card.style.transform = `perspective(1000px) rotateX(${(dy / rect.height) * -10}deg) rotateY(${(dx / rect.width) * 10}deg)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        }
    }

    injectKeyframes() {
        if (document.getElementById('creative-keyframes')) return;
        const style = document.createElement('style');
        style.id = 'creative-keyframes';
        style.textContent = `
            @keyframes sparkleFloat {
                0% { opacity: 1; transform: translateY(0) scale(0); }
                50% { opacity: 1; transform: translateY(-20px) scale(1); }
                100% { opacity: 0; transform: translateY(-40px) scale(0); }
            }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
            @keyframes explode {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
                100% { opacity: 0; transform: translate(var(--ex), var(--ey)) scale(0); }
            }
        `;
        document.head.appendChild(style);
    }

    onInputFocus(e) {
        super.onInputFocus(e);
        const wrapper = e.target.closest('.input-wrapper');
        if (!wrapper) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: absolute; width: 4px; height: 4px;
                    background: #667eea; border-radius: 50%;
                    pointer-events: none;
                    top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
                    animation: sparkleFloat 1s ease-out forwards; z-index: 10;
                `;
                wrapper.appendChild(sparkle);
                sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
            }, i * 100);
        }
    }

    onSuccess() {
        super.onSuccess();
        setTimeout(() => this.celebrate(), 350);
    }

    celebrate() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6c5ce7', '#feca57'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const ex = (Math.random() * 600 - 300) + 'px';
                const ey = (Math.random() * 600 - 300) + 'px';
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed; width: 8px; height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%; pointer-events: none;
                    top: 50%; left: 50%; z-index: 1000;
                    --ex: ${ex}; --ey: ${ey};
                    animation: explode ${Math.random() * 2 + 1}s ease-out forwards;
                `;
                document.body.appendChild(particle);
                particle.addEventListener('animationend', () => particle.remove(), { once: true });
            }, i * 50);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new CreativeLoginForm());
