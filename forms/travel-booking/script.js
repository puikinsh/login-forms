// Travel Booking Login Form
class TravelBookingLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
        });
    }

    decorate() {
        if (FormUtils.prefersReducedMotion()) return;
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => {
                this.passwordToggle.style.transform = 'scale(0.9)';
                setTimeout(() => { this.passwordToggle.style.transform = 'scale(1)'; }, 150);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new TravelBookingLoginForm());
