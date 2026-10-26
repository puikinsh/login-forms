// Racing Paddock: shared validation, keyboard behavior, and explicit demo flows.
class RacingPaddockLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new RacingPaddockLoginForm());
