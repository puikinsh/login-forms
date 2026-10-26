// Terminal Cloud: shared validation, keyboard behavior, and explicit demo flows.
class TerminalCloudLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new TerminalCloudLoginForm());
