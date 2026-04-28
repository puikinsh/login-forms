// Corporate Login Form
const corporateValidators = {
    email: (value) => {
        if (!value) return { isValid: false, message: 'Business email is required' };
        const businessEmailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil)$/i;
        if (!businessEmailRegex.test(value)) {
            return { isValid: false, message: 'Please enter a valid business email address' };
        }
        const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = value.split('@')[1]?.toLowerCase();
        if (personalDomains.includes(domain)) {
            return { isValid: false, message: 'Please use your business email address' };
        }
        return { isValid: true };
    },
    password: (value) => {
        if (!value) return { isValid: false, message: 'Password is required' };
        if (value.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
            return { isValid: false, message: 'Password must contain uppercase, lowercase, number, and special character' };
        }
        return { isValid: true };
    },
};

class CorporateLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            validators: corporateValidators,
            hideOnSuccess: ['.sso-options', '.footer-links'],
        });
    }

    decorate() {
        document.querySelectorAll('.sso-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.classList.contains('azure-btn') ? 'Azure AD' : 'Okta';
                FormUtils.showNotification(`Connecting to ${provider}...`, 'info', this.form);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CorporateLoginForm());
