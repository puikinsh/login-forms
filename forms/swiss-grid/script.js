// Swiss Grid: shared validation, keyboard behavior, and explicit demo flows.
class SwissGridLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new SwissGridLoginForm());
