// Shared utilities for all login-form templates.
// Exposes the static `FormUtils` helpers and a `FormUtils.LoginFormBase` class
// that owns the form lifecycle so per-form scripts only override visual hooks.

class FormUtils {
    static validateEmail(value) {
        if (!value) {
            return { isValid: false, message: 'Email address is required' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        return { isValid: true };
    }

    static validatePassword(value) {
        if (!value) {
            return { isValid: false, message: 'Password is required' };
        }
        return { isValid: true };
    }

    // Creation rules never apply to existing sign-in passwords. Count Unicode code points.
    static validateNewPassword(value) {
        if (!value) return { isValid: false, message: 'New password is required' };
        if ([...value].length < 15) return { isValid: false, message: 'Use at least 15 characters for your new password' };
        return { isValid: true };
    }

    static simulateAuth(flow, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'error@demo.com' || (flow === 'reset-password' && password === 'demo-error-password')) {
                    reject(new Error('Demo service is temporarily unavailable. Please try again.'));
                } else {
                    resolve({ success: true, demo: true });
                }
            }, 800);
        });
    }

    static showError(fieldName, message, formGroupSelector = '.form-group') {
        const field = typeof fieldName === 'string' ? document.getElementById(fieldName) : fieldName;
        if (!field) return;
        const formGroup = field.closest(formGroupSelector);
        const errorElement = field.form?.querySelector(`[id="${field.id}Error"]`);

        field.setAttribute('aria-invalid', 'true');
        if (formGroup) formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        field.style.animation = 'shake 0.5s ease-in-out';
        field.addEventListener('animationend', () => {
            field.style.animation = '';
        }, { once: true });
    }

    static clearError(fieldName, formGroupSelector = '.form-group') {
        const field = typeof fieldName === 'string' ? document.getElementById(fieldName) : fieldName;
        if (!field) return;
        const formGroup = field.closest(formGroupSelector);
        const errorElement = field.form?.querySelector(`[id="${field.id}Error"]`);

        field.removeAttribute('aria-invalid');
        if (formGroup) formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    static showSuccess(fieldName) {
        const field = typeof fieldName === 'string' ? document.getElementById(fieldName) : fieldName;
        const wrapper = field?.closest('.input-wrapper');
        if (!wrapper) return;

        wrapper.style.borderColor = '#22c55e';
        setTimeout(() => { wrapper.style.borderColor = ''; }, 2000);
    }

    static simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@demo.com' && password === 'wrongpassword') {
                    reject(new Error('Invalid email or password'));
                } else {
                    resolve({ success: true, user: { email } });
                }
            }, 2000);
        });
    }

    // Build the toast with DOM APIs so untrusted `message` values can't inject HTML.
    static showNotification(message, type = 'info', container = null) {
        const target = container || document.querySelector('form');
        if (!target) return;

        const palette = {
            error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
            success: { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
            info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af' },
        };
        const c = palette[type] || palette.info;

        const wrapper = document.createElement('div');
        wrapper.className = `notification ${type}`;
        wrapper.setAttribute('role', type === 'error' ? 'alert' : 'status');

        const inner = document.createElement('div');
        inner.style.cssText = `
            background: ${c.bg};
            backdrop-filter: blur(10px);
            border: 1px solid ${c.border};
            border-radius: 12px;
            padding: 12px 16px;
            margin-top: 16px;
            color: ${c.text};
            text-align: center;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        inner.textContent = message;
        wrapper.appendChild(inner);

        target.appendChild(wrapper);

        if (type === 'error') return wrapper;
        setTimeout(() => {
            wrapper.style.animation = 'slideOut 0.3s ease';
            wrapper.addEventListener('animationend', () => wrapper.remove(), { once: true });
        }, 3000);
    }

    static setupFloatingLabels(form) {
        if (!form) return;
        form.querySelectorAll('input').forEach(input => {
            const sync = () => input.classList.toggle('has-value', input.value.trim() !== '');
            sync();
            input.addEventListener('input', sync);
        });
    }

    static setupPasswordToggle(passwordInput, toggleButton) {
        if (!passwordInput || !toggleButton) return;
        toggleButton.setAttribute('aria-pressed', 'false');
        toggleButton.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleButton.setAttribute('aria-pressed', String(isPassword));
            toggleButton.classList.toggle('toggle-active', isPassword);
            toggleButton.classList.toggle('show-password', isPassword);
            const text = toggleButton.querySelector('.toggle-text');
            if (text) text.textContent = isPassword ? 'HIDE' : 'SHOW';
            const eyeIcon = toggleButton.querySelector('.eye-icon');
            eyeIcon?.classList.toggle('show-password', isPassword);

            // Preserve each design's positioning transform (often translateY(-50%)).

            // Keep focus on the toggle so keyboard users can activate it again.
        });
    }

    static addEntranceAnimation(element, delay = 100) {
        if (!element || FormUtils.prefersReducedMotion()) return;
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    static addSharedAnimations() {
        if (document.getElementById('shared-animations')) return;
        const style = document.createElement('style');
        style.id = 'shared-animations';
        style.textContent = `
            @keyframes slideIn  { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideOut { from { opacity: 1; transform: translateY(0); }     to { opacity: 0; transform: translateY(-10px); } }
            @keyframes shake    { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            @keyframes checkmarkPop { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
            @keyframes successPulse { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
            @keyframes spin     { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }

            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Base class for every login form. Subclasses override hooks like `decorate`,
// `onSuccess`, `getElementsToHideOnSuccess`, and `onLoginError` instead of
// reimplementing the lifecycle.
FormUtils.LoginFormBase = class LoginFormBase {
    constructor(options = {}) {
        this.formId = options.formId || 'loginForm';
        this.form = options.form || document.getElementById(this.formId);
        if (!this.form) return;

        this.root = options.root || this.form.parentElement;
        this.flow = this.form.dataset.authFlow || 'login';
        this.authenticate = options.authenticate || FormUtils.simulateLogin;
        // Separate adapters keep reset tokens and account creation out of the login API.
        this.authAction = {
            signup: options.createAccount,
            'request-reset': options.requestReset,
            'reset-password': options.resetPassword,
        }[this.flow] || ((email, password) => FormUtils.simulateAuth(this.flow, email, password));
        this.submitBtn = options.submitButtonSelector
            ? this.form.querySelector(options.submitButtonSelector)
            : this.form.querySelector('button[type="submit"], .login-btn, .submit-btn, .signin-btn, .auth-btn');
        this.passwordInput = this.form.querySelector('input[type="password"]');
        this.passwordToggle =
            this.form.querySelector('[id="passwordToggle"]') ||
            this.form.querySelector('.password-toggle');
        this.successMessage = options.successMessage || this.root.querySelector('[id="successMessage"]');
        this.cardSelector = options.cardSelector || '.login-card, .form-card, .auth-card, .signin-card';
        this.formGroupSelector = options.formGroupSelector || '.form-group';
        this.hideOnSuccess = [...(options.hideOnSuccess || [])];
        if (this.flow !== 'login') this.hideOnSuccess.push('.auth-navigation[aria-label="Account"]');
        this.redirectMessage = options.redirectMessage || null;

        const loginValidators = { email: FormUtils.validateEmail, password: FormUtils.validatePassword };
        const flowValidators = this.flow === 'request-reset'
            ? { email: FormUtils.validateEmail }
            : this.flow === 'reset-password'
                ? { password: FormUtils.validateNewPassword }
                : { email: FormUtils.validateEmail, password: FormUtils.validateNewPassword };
        this.validators = options.validators || (this.flow === 'login' ? loginValidators : flowValidators);

        this.isSubmitting = false;
        this.init();
    }

    init() {
        FormUtils.addSharedAnimations();
        FormUtils.setupFloatingLabels(this.form);
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        this.status = document.createElement('div');
        this.status.className = 'form-status';
        this.status.setAttribute('role', 'status');
        this.status.setAttribute('aria-live', 'polite');
        this.status.setAttribute('aria-atomic', 'true');
        this.root.appendChild(this.status);
        this.bindCoreEvents();
        this.bindAuxLinks();
        this.bindKeyboardShortcuts();
        this.decorate();
        if (this.flow !== 'login' && this.submitBtn) this.submitBtn.disabled = false;
    }

    bindCoreEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(name => {
            const field = this.form.elements.namedItem(name);
            if (!field) return;
            field.addEventListener('blur', () => this.validateField(name));
            field.addEventListener('input', () => this.clearError(name));
            field.addEventListener('focus', (e) => this.onInputFocus(e));
            field.addEventListener('blur', (e) => this.onInputBlur(e));
        });

        const checkbox = this.form.elements.namedItem('remember');
        checkbox?.addEventListener('change', () => this.onRememberChange());
    }

    showError(name, message) {
        FormUtils.showError(this.form.elements.namedItem(name), message, this.formGroupSelector);
    }

    clearError(name) {
        FormUtils.clearError(this.form.elements.namedItem(name), this.formGroupSelector);
    }

    bindAuxLinks() {
        this.root.querySelectorAll('[data-action="forgot-password"]').forEach(link => {
            link.addEventListener('click', (e) => this.onForgotPassword(e));
        });
        this.root.querySelectorAll('[data-action="signup"]').forEach(link => {
            link.addEventListener('click', (e) => this.onSignupLink(e));
        });
        this.root.querySelectorAll('[data-action="social"]').forEach(btn => {
            btn.addEventListener('click', (e) => this.onSocialLogin(e));
        });
    }

    // Scoped to the form, not document — multiple form instances no longer stack handlers.
    bindKeyboardShortcuts() {
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.keys(this.validators).forEach(name => this.clearError(name));
            }
        });
    }

    // ---- hooks ----
    decorate() {}
    onInputFocus(e) { e.target.closest('.input-wrapper')?.classList.add('focused'); }
    onInputBlur(e)  { e.target.closest('.input-wrapper')?.classList.remove('focused'); }
    onRememberChange() {
        const mark = this.root.querySelector('.checkmark');
        if (!mark) return;
        mark.style.transform = 'scale(0.8)';
        setTimeout(() => { mark.style.transform = 'scale(1)'; }, 150);
    }
    onForgotPassword(e) {
        if (e.currentTarget.getAttribute('href') && e.currentTarget.getAttribute('href') !== '#') return;
        e.preventDefault();
        FormUtils.showNotification('Password reset link would be sent to your email', 'info', this.form);
    }
    onSignupLink(e) {
        if (e.currentTarget.getAttribute('href') && e.currentTarget.getAttribute('href') !== '#') return;
        e.preventDefault();
        FormUtils.showNotification('Demo: connect this link to your sign up page.', 'info', this.form);
    }
    onSocialLogin(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const provider = btn.dataset.provider
            || (btn.classList.contains('google-btn') ? 'Google'
              : btn.classList.contains('github-btn') ? 'GitHub'
              : btn.classList.contains('facebook-btn') ? 'Facebook'
              : btn.classList.contains('apple-btn') ? 'Apple'
              : 'provider');
        FormUtils.showNotification(`Demo: connect ${provider} sign-in to your authentication service.`, 'info', this.form);
    }

    // ---- lifecycle ----
    async handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting || this.hasSucceeded) return;
        if (this.validateForm()) {
            await this.submitForm();
        } else {
            this.shakeForm();
            this.form.querySelector('[aria-invalid="true"]')?.focus();
        }
    }

    validateForm() {
        const results = Object.keys(this.validators).map(name => this.validateField(name));
        return results.every(Boolean);
    }

    validateField(name) {
        const field = this.form.elements.namedItem(name);
        const validator = this.validators[name];
        if (!field || !validator) return true;

        const result = validator(name === 'password' ? field.value : field.value.trim(), field);
        if (result.isValid) {
            this.clearError(name);
            FormUtils.showSuccess(field);
        } else {
            this.showError(name, result.message);
        }
        return result.isValid;
    }

    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        this.form.addEventListener('animationend', () => {
            this.form.style.animation = '';
        }, { once: true });
    }

    async submitForm() {
        this.isSubmitting = true;
        this.submitBtn?.classList.add('loading');
        if (this.submitBtn) this.submitBtn.disabled = true;
        this.form.setAttribute('aria-busy', 'true');
        this.status.textContent = {
            login: 'Signing in…', signup: 'Creating demo account…',
            'request-reset': 'Previewing reset request…', 'reset-password': 'Previewing password reset…',
        }[this.flow];
        this.root.querySelectorAll('.notification.error').forEach(el => el.remove());

        try {
            const email = this.form.elements.namedItem('email')?.value.trim() || '';
            const password = this.form.elements.namedItem('password')?.value || '';
            const action = this.flow === 'login' ? this.authenticate : this.authAction;
            const result = await action(email, password, this.getFormData());
            this.hasSucceeded = true;
            if (this.flow === 'login') {
                this.onSuccess(result);
            } else {
                // Login-specific animation hooks may assume remember/social controls exist.
                this.form.reset();
                FormUtils.LoginFormBase.prototype.onSuccess.call(this, result);
            }
        } catch (error) {
            this.status.textContent = '';
            this.onLoginError(error?.message || 'Login failed. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.submitBtn?.classList.remove('loading');
            if (this.submitBtn) this.submitBtn.disabled = !!this.hasSucceeded;
            this.form.removeAttribute('aria-busy');
        }
    }

    // Default success behavior: fade out the form, fade in #successMessage.
    // Forms that want to hide additional elements override `getElementsToHideOnSuccess`
    // or pass `hideOnSuccess` in constructor options.
    onSuccess() {
        const elementsToHide = [...this.hideOnSuccess, ...this.getElementsToHideOnSuccess()];
        this.form.style.transition = 'all 0.3s ease';
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(-20px)';

        elementsToHide.forEach(sel => {
            const el = this.root.querySelector(sel);
            if (!el) return;
            el.style.transition = 'all 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-20px)';
        });

        setTimeout(() => {
            this.form.style.display = 'none';
            elementsToHide.forEach(sel => {
                const el = this.root.querySelector(sel);
                if (el) el.style.display = 'none';
            });
            this.revealSuccess();
        }, 300);
    }

    revealSuccess() {
        this.status.textContent = '';
        if (!this.successMessage) {
            this.status.textContent = 'Signed in successfully.';
            return;
        }
        this.successMessage.classList.add('show');
        this.successMessage.focus();
    }

    getElementsToHideOnSuccess() { return []; }

    onLoginError(message) {
        FormUtils.showNotification(message || 'Login failed. Please try again.', 'error', this.form);
        (this.passwordInput || this.form.elements.namedItem('email'))?.focus();
        const card = this.root.matches(this.cardSelector) ? this.root : this.root.querySelector(this.cardSelector);
        if (!card) return;
        card.style.animation = 'shake 0.5s ease-in-out';
        card.addEventListener('animationend', () => { card.style.animation = ''; }, { once: true });
    }

    getFormData() {
        return Object.fromEntries(new FormData(this.form).entries());
    }
};
