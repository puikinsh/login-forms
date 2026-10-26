// Corporate Login Form
class CorporateLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.sso-options', '.footer-links'],
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CorporateLoginForm());
