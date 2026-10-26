// Audio Console: shared validation, keyboard behavior, and explicit demo flows.
class AudioConsoleLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new AudioConsoleLoginForm());
