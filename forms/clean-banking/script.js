// Clean Banking Login Form
class CleanBankingLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.security-notice'],
            validators: {
                email: FormUtils.validateEmail,
                password: (v) => {
                    if (!v) return { isValid: false, message: 'Password is required' };
                    if (v.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' };
                    return { isValid: true };
                },
            },
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CleanBankingLoginForm());
