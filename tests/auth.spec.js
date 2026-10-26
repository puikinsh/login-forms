const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync } = require('node:fs');
const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
const flows = ['sign-up', 'reset-password', 'new-password'];

for (const slug of forms) {
    for (const flow of flows) {
        test(`${slug} ${flow}: validation, retry, accessible demo success`, async ({ page }) => {
            const errors = [];
            const requests = [];
            page.on('pageerror', error => errors.push(error.message));
            page.on('request', request => { if (request.method() !== 'GET') requests.push(request.url()); });
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await page.goto(`/forms/${slug}/${flow}.html`);
            const submit = page.locator('button[type="submit"]');
            await expect(submit).toBeEnabled();
            await expect(page.locator('.auth-demo').first()).toContainText('Nothing is saved');
            await submit.click();
            const fields = page.locator('form input');
            for (const field of await fields.all()) await expect(field).toHaveAttribute('aria-invalid', 'true');
            await expect(fields.first()).toBeFocused();
            if (flow !== 'new-password') {
                await page.locator('#email').fill('invalid');
                await submit.click();
                await expect(page.locator('#emailError')).toContainText('valid email');
                await page.locator('#email').fill('error@demo.com');
            }
            if (flow !== 'reset-password') {
                await expect(page.locator('#password')).toHaveAttribute('autocomplete', 'new-password');
                await page.locator('#password').fill('short');
                await submit.click();
                await expect(page.locator('#passwordError')).toContainText('15 characters');
                await page.locator('#passwordToggle').focus();
                await page.keyboard.press('Space');
                await expect(page.locator('#passwordToggle')).toHaveAttribute('aria-pressed', 'true');
                await expect(page.locator('#passwordToggle')).toBeFocused();
                await page.locator('#password').fill('demo-error-password');
            }
            await submit.click();
            await expect(submit).toBeDisabled();
            await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
            await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
            await expect(submit).toBeEnabled();
            await expect(fields.last()).toBeFocused();
            // Retry with a passphrase, preserving spaces and allowing paste/password managers.
            if (flow !== 'new-password') await page.locator('#email').fill('person@example.com');
            if (flow !== 'reset-password') await page.locator('#password').fill('  a long demo passphrase  ');
            await fields.last().press('Enter');
            await expect(page.locator('#successMessage')).toBeVisible();
            await expect(page.locator('#successMessage')).toBeFocused();
            await expect(page.locator('#successMessage')).toContainText('demo complete');
            await expect(page.locator('form')).toBeHidden();
            await expect(page.getByRole('alert')).toHaveCount(0);
            const successScan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
            expect(successScan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(n => n.target) }))).toEqual([]);
            if (flow === 'reset-password') {
                await page.getByRole('link', { name: 'Preview the new-password screen' }).click();
                await expect(page.locator('#password')).toBeVisible();
            }
            expect(requests).toEqual([]);
            expect(errors).toEqual([]);
            expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            for (const viewport of [{ width: 1200, height: 900 }, { width: 375, height: 812 }]) {
                await page.setViewportSize(viewport);
                await page.goto(`/forms/${slug}/${flow}.html`);
                await submit.click();
                expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
                const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
                expect(result.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
            }
        });
    }
    test(`${slug}: companion navigation and no-JavaScript fallback`, async ({ browser, page: livePage }) => {
        await livePage.goto(`/forms/${slug}/`);
        await livePage.locator('[data-action="signup"]').click();
        await expect(livePage).toHaveURL(/sign-up\.html$/);
        await livePage.getByRole('link', { name: 'Back to sign in', exact: true }).first().click();
        await livePage.locator('[data-action="forgot-password"]').click();
        await expect(livePage).toHaveURL(/reset-password\.html$/);
        const context = await browser.newContext({ javaScriptEnabled: false });
        const page = await context.newPage();
        try {
            await page.goto(`/forms/${slug}/`);
            await page.locator('[data-action="signup"]').click();
            await expect(page).toHaveURL(/sign-up\.html$/);
            await expect(page.locator('button[type="submit"]')).toBeDisabled();
            await expect(page.locator('noscript .auth-demo')).toBeVisible();
            expect(await page.locator('noscript .auth-demo').evaluate(node => node.textContent)).toContain('Enable JavaScript');
            await page.getByRole('link', { name: 'Reset password', exact: true }).click();
            await expect(page).toHaveURL(/reset-password\.html$/);
            await page.getByRole('link', { name: 'Back to sign in', exact: true }).first().click();
            await page.locator('[data-action="forgot-password"]').click();
            await expect(page).toHaveURL(/reset-password\.html$/);
        } finally { await context.close(); }
    });
}
