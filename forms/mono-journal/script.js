// Mono Journal: shared validation, keyboard behavior, and explicit demo flows.
class MonoJournalLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new MonoJournalLoginForm());
