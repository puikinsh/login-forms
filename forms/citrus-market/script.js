// Citrus Market: shared validation, keyboard behavior, and explicit demo flows.
class CitrusMarketLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new CitrusMarketLoginForm());
