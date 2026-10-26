// Gallery Frame: shared validation, keyboard behavior, and explicit demo flows.
class GalleryFrameLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({ hideOnSuccess: ['.auth-demo', '.auth-navigation[aria-label="Account"]'] });
    }
}

document.addEventListener('DOMContentLoaded', () => new GalleryFrameLoginForm());
