// Atelier Fashion: shared validation, keyboard behavior, and explicit demo flows.
class AtelierFashionLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new AtelierFashionLoginForm());
