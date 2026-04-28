// Neon Minimalist Login Form
class NeonLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
            cardSelector: '.login-card',
        });
    }

    decorate() {
        const card = document.querySelector('.login-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }

        // Mouse-tracking parallax for glow orbs
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.glow-orb');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                orb.style.transform = `translate(${(x - 0.5) * speed * 20}px, ${(y - 0.5) * speed * 20}px)`;
            });
        });

        // Neon glow on social button hover
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.boxShadow = '';
            });
        });
    }

    onInputFocus(e) {
        super.onInputFocus(e);
        e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.1)';
    }

    onInputBlur(e) {
        super.onInputBlur(e);
        e.target.style.boxShadow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => new NeonLoginForm());
