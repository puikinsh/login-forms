// Minimal Login Form
class MinimalLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
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
}

document.addEventListener('DOMContentLoaded', () => new MinimalLoginForm());
