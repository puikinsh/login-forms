// Basic Login Form
class BasicLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.signup-link'],
        });
    }

    decorate() {
        FormUtils.addEntranceAnimation(this.form.closest('.login-card'), 100);
    }
}

document.addEventListener('DOMContentLoaded', () => new BasicLoginForm());
