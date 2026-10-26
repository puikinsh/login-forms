const { test, expect } = require('@playwright/test');
const { resolve } = require('node:path');

test('authentication preserves passwords and scopes independent form instances', async ({ page }) => {
    await page.setContent(['first', 'second'].map(name => `
        <section id="${name}">
            <form id="${name}Form">
                <div class="form-group"><label for="${name}Email">Email</label><input name="email" id="${name}Email" aria-describedby="${name}EmailError"><span id="${name}EmailError"></span></div>
                <div class="form-group"><label for="${name}Password">Password</label><input name="password" id="${name}Password" type="password" aria-describedby="${name}PasswordError"><span id="${name}PasswordError"></span></div>
                <button type="submit">Sign in</button>
            </form>
            <button data-action="social" data-provider="Example">Example</button>
            <div id="${name}Success" tabindex="-1" style="display:none">Success</div>
        </section>`).join(''));
    await page.addScriptTag({ path: resolve('shared/js/form-utils.js') });
    await page.evaluate(() => {
        window.attempts = [];
        for (const name of ['first', 'second']) {
            new FormUtils.LoginFormBase({
                form: document.getElementById(name + 'Form'),
                successMessage: document.getElementById(name + 'Success'),
                authenticate: async (email, password, data) => {
                    window.attempts.push({ name, email, password, data });
                    throw new Error('Try again');
                },
            });
        }
    });
    await page.locator('#first button[type="submit"]').click();
    await expect(page.locator('#firstEmail')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#secondEmail')).not.toHaveAttribute('aria-invalid');
    await page.locator('#second [data-action="social"]').click();
    await expect(page.locator('#second .notification')).toHaveCount(1);
    await expect(page.locator('#first .notification')).toHaveCount(0);
    await page.locator('#firstEmail').fill('alice@company.lv');
    await page.locator('#firstPassword').fill('  exact password  ');
    await page.locator('#first button[type="submit"]').click();
    await expect(page.locator('#first .notification.error')).toBeVisible();
    expect(await page.evaluate(() => window.attempts)).toEqual([{
        name: 'first', email: 'alice@company.lv', password: '  exact password  ',
        data: { email: 'alice@company.lv', password: '  exact password  ' },
    }]);
    await page.clock.install();
    await page.clock.fastForward(10_000);
    await expect(page.locator('#first .notification.error')).toBeVisible();
});

test('a pending or completed login cannot submit twice', async ({ page }) => {
    await page.goto('/forms/basic/');
    await page.evaluate(() => {
        window.attemptCount = 0;
        // Use an isolated fixture without the template's own event listener.
        const root = document.createElement('section');
        root.innerHTML = '<form id="isolatedForm"><input name="email" value="person@example.com"><input name="password" type="password" value="a"><button type="submit">Submit</button></form><div id="isolatedSuccess" tabindex="-1">Success</div>';
        document.body.appendChild(root);
        window.isolated = new FormUtils.LoginFormBase({
            form: root.querySelector('form'),
            successMessage: root.querySelector('#isolatedSuccess'),
            authenticate: () => {
                window.attemptCount++;
                return new Promise(resolve => { window.finishLogin = resolve; });
            },
        });
    });
    await page.locator('#isolatedForm button').click();
    await page.evaluate(() => document.querySelector('#isolatedForm').requestSubmit());
    expect(await page.evaluate(() => window.attemptCount)).toBe(1);
    await expect(page.locator('#isolatedForm button')).toBeDisabled();
    await page.evaluate(() => window.finishLogin());
    await expect(page.locator('#isolatedSuccess')).toBeFocused();
    await page.evaluate(() => document.querySelector('#isolatedForm').requestSubmit());
    expect(await page.evaluate(() => window.attemptCount)).toBe(1);
});

test('creation validators count Unicode and do not change sign-in policy', async ({ page }) => {
    await page.goto('/forms/basic/sign-up.html');
    const results = await page.evaluate(() => ({
        short: FormUtils.validateNewPassword('😀'.repeat(14)).isValid,
        full: FormUtils.validateNewPassword('😀'.repeat(15)).isValid,
        spaces: FormUtils.validateNewPassword('  a long passphrase  ').isValid,
        long: FormUtils.validateNewPassword('a'.repeat(128)).isValid,
        login: FormUtils.validatePassword('a').isValid,
    }));
    expect(results).toEqual({ short: false, full: true, spaces: true, long: true, login: true });
});

for (const [flow, adapter] of [['signup', 'createAccount'], ['request-reset', 'requestReset'], ['reset-password', 'resetPassword']]) {
    test(`${adapter} receives unchanged credentials and prevents repeat submission`, async ({ page }) => {
        await page.goto('/forms/basic/');
        await page.evaluate(({ flow, adapter }) => {
            const root = document.createElement('section');
            root.innerHTML = `<form id="adapterForm" data-auth-flow="${flow}"><input name="email" value="person@example.com"><input name="password" type="password" value="  a long passphrase  "><button type="submit">Submit</button></form><div id="adapterSuccess" tabindex="-1">Complete</div>`;
            document.body.appendChild(root);
            window.calls = [];
            new FormUtils.LoginFormBase({
                form: root.querySelector('form'), successMessage: root.querySelector('#adapterSuccess'),
                authenticate: () => { throw new Error('Wrong adapter'); },
                [adapter]: (...args) => {
                    window.calls.push(args);
                    return new Promise(resolve => { window.finishAction = resolve; });
                },
            });
        }, { flow, adapter });
        await page.locator('#adapterForm button').click();
        await page.evaluate(() => document.querySelector('#adapterForm').requestSubmit());
        expect(await page.evaluate(() => window.calls)).toEqual([[
            'person@example.com', '  a long passphrase  ', { email: 'person@example.com', password: '  a long passphrase  ' },
        ]]);
        await page.evaluate(() => window.finishAction());
        await expect(page.locator('#adapterSuccess')).toBeFocused();
        await page.evaluate(() => document.querySelector('#adapterForm').requestSubmit());
        expect(await page.evaluate(() => window.calls.length)).toBe(1);
    });
}
