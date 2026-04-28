// Travel Booking Login Form
class TravelBookingLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.divider', '.social-login', '.signup-link'],
            validators: {
                email: FormUtils.validateEmail,
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Password is required' };
                    if (v.length < 6) return { isValid: false, message: 'Password must be at least 6 characters long' };
                    return { isValid: true };
                },
            },
        });
    }

    decorate() {
        if (this.passwordToggle) {
            this.passwordToggle.addEventListener('click', () => {
                this.passwordToggle.style.transform = 'scale(0.9)';
                setTimeout(() => { this.passwordToggle.style.transform = 'scale(1)'; }, 150);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new TravelBookingLoginForm());
