// Terrace Travel: shared validation, keyboard behavior, and explicit demo flows.
class TerraceTravelLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new TerraceTravelLoginForm());
