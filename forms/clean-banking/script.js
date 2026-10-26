// Clean Banking Login Form
class CleanBankingLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.security-notice'],
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CleanBankingLoginForm());
