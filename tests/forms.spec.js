const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync } = require('node:fs');

async function expectAccessible(page) {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
}

const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);

for (const name of forms) {
    test.describe(name, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`/forms/${name}/`);
        });

        test('runs without runtime packages or script errors with normal motion', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            const errors = [];
            const external = [];
            page.on('pageerror', error => errors.push(error.message));
            page.on('request', request => {
                if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:8000/')) external.push(request.url());
            });
            await page.reload();
            await page.locator('#email').fill('person@example.com');
            await page.locator('#password').fill('existing password');
            await page.locator('#passwordToggle').click();
            await expect(page.locator('#password')).toHaveAttribute('type', 'text');
            expect(errors).toEqual([]);
            expect(external).toEqual([]);
        });

        test('reports all errors and supports keyboard controls', async ({ page, browserName }) => {
            const email = page.locator('#email');
            const password = page.locator('#password');
            await page.locator('button[type="submit"]').click();
            await expect(email).toHaveAttribute('aria-invalid', 'true');
            await expect(password).toHaveAttribute('aria-invalid', 'true');
            await expect(email).toBeFocused();
            for (const field of [email, password]) {
                const errorId = await field.getAttribute('aria-describedby');
                await expect(page.locator(`[id="${errorId}"]`)).not.toBeEmpty();
            }
            await expectAccessible(page);
            await email.fill('alice@company.lv');
            await password.fill('a');
            const toggle = page.locator('#passwordToggle');
            await toggle.focus();
            await page.keyboard.press('Space');
            await expect(password).toHaveAttribute('type', 'text');
            await expect(toggle).toHaveAttribute('aria-pressed', 'true');
            await expect(toggle).toBeFocused();
            await page.keyboard.press('Space');
            await expect(password).toHaveAttribute('type', 'password');
            await expect(toggle).toHaveAttribute('aria-pressed', 'false');
            // macOS WebKit follows the OS keyboard-navigation setting; Option-Tab includes all controls.
            // https://github.com/microsoft/playwright/issues/41808
            await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
            await expect(page.locator('#remember')).toBeFocused();
            await page.keyboard.press('Space');
            await expect(page.locator('#remember')).toBeChecked();
        });

        test('failure is announced, remains available, and can be retried', async ({ page }) => {
            await page.locator('#email').fill('admin@demo.com');
            await page.locator('#password').fill('wrongpassword');
            const submit = page.locator('button[type="submit"]');
            await submit.click();
            await expect(submit).toBeDisabled();
            await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
            await expect(page.locator('.form-status')).toHaveText('Signing in…');
            await expect(page.getByRole('alert')).toContainText('Invalid email or password');
            await expect(submit).toBeEnabled();
            await expectAccessible(page);
            await expect(page.locator('form')).not.toHaveAttribute('aria-busy');
            await expect(page.locator('#password')).toBeFocused();
            await page.locator('#password').fill('a');
            await page.locator('#password').press('Enter');
            await expect(page.locator('#successMessage')).toBeVisible();
            await expect(page.locator('#successMessage')).toBeFocused();
            await expect(page.locator('form')).toBeHidden();
            await expect(page.getByRole('alert')).toHaveCount(0);
            await expectAccessible(page);
        });

        test('every auxiliary action produces accessible demo feedback', async ({ page }) => {
            const actions = page.locator('[data-action="social"]');
            for (let index = 0; index < await actions.count(); index++) {
                await actions.nth(index).click();
                await expect(page.locator('.notification').last()).toBeVisible();
                await expect(page.locator('.notification').last()).toHaveAttribute('role', 'status');
            }
        });

        test('has accessible controls and fits a narrow viewport', async ({ page }) => {
            await expectAccessible(page);
            await page.setViewportSize({ width: 375, height: 812 });
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.reload();
            await expect(page.locator('#email')).toBeVisible();
            await expect(page.locator('#password')).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await expectAccessible(page);
            expect(errors).toEqual([]);
        });
    });
}
