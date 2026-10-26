const AxeBuilder = require('@axe-core/playwright').default;
const { test, expect } = require('@playwright/test');
const { readdirSync } = require('node:fs');
const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);

async function settled(page) {
    await page.waitForFunction(() => [...document.querySelectorAll('form [id$="Error"]')].filter(error => error.textContent).every(error => +getComputedStyle(error).opacity >= 0.99));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function geometry(page) {
    return page.evaluate(() => {
        const failures = [];
        const rect = element => element.getBoundingClientRect();
        const overlaps = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
        const controls = [...document.querySelectorAll('form input:not([type="checkbox"]), button[type="submit"], #passwordToggle, label[for="email"], label[for="password"], .auth-help, .auth-demo, .form-options, nav')].filter(node => rect(node).height);
        if (document.documentElement.scrollWidth > innerWidth) failures.push('Horizontal page overflow');
        for (const error of document.querySelectorAll('form [id$="Error"]')) {
            if (!error.textContent) continue;
            const er = rect(error);
            for (const control of controls) if (overlaps(er, rect(control))) failures.push(`${error.id} overlaps ${control.id || control.className || control.tagName}`);
            if (er.left < -1 || er.right > innerWidth + 1) failures.push(`${error.id} is clipped horizontally`);
        }
        for (const input of document.querySelectorAll('form input:not([type="checkbox"])')) {
            if (!input.value) continue;
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) continue;
            const ir = rect(input), css = getComputedStyle(input);
            const pt = parseFloat(css.paddingTop), pb = parseFloat(css.paddingBottom);
            const lh = parseFloat(css.lineHeight) || parseFloat(css.fontSize) * 1.2;
            const top = ir.top + parseFloat(css.borderTopWidth) + pt + Math.max(0, (input.clientHeight - pt - pb - lh) / 2);
            const text = { left: ir.left + parseFloat(css.paddingLeft), right: ir.right - parseFloat(css.paddingRight), top: top + 2, bottom: top + lh - 2 };
            if (overlaps(rect(label), text)) failures.push(`${input.id} label overlaps its value`);
        }
        const toggle = document.getElementById('passwordToggle'), password = document.getElementById('password');
        if (toggle && password) {
            const a = rect(toggle), b = rect(password);
            if (a.top < b.top - 1 || a.bottom > b.bottom + 1) failures.push('Password toggle extends outside the input');
        }
        return failures;
    });
}

for (const slug of forms) {
    test(`${slug} keeps controls, labels, and validation messages separate at every screen size`, async ({ page }) => {
        test.setTimeout(90_000);
        for (const width of [1200, 640, 375, 320]) {
            await page.setViewportSize({ width, height: 900 });
            for (const screen of ['index', 'sign-up', 'reset-password', 'new-password']) {
                await page.goto(`/forms/${slug}/${screen}.html`);
                await page.locator('button[type="submit"]').click();
                await settled(page);
                expect(await geometry(page), `${screen}, ${width}px, empty errors`).toEqual([]);
                for (const input of await page.locator('form input:not([type="checkbox"])').all()) await input.fill('short');
                await page.locator('button[type="submit"]').click();
                await page.locator('h1, h2').first().click();
                await settled(page);
                expect(await geometry(page), `${screen}, ${width}px, filled errors`).toEqual([]);
                if (width === 375) {
                    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
                    expect(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })), `${screen}, filled errors`).toEqual([]);
                }
                if (screen !== 'reset-password') {
                    await page.locator('#passwordToggle').focus();
                    await page.keyboard.press('Space');
                    await expect(page.locator('#password')).toHaveAttribute('type', 'text');
                    await expect(page.locator('#password')).toHaveCSS('text-transform', 'none');
                    expect(await geometry(page), `${screen}, ${width}px, revealed password`).toEqual([]);
                }
                if (width <= 375) {
                    await page.evaluate(() => {
                        for (const input of document.querySelectorAll('form input:not([type="checkbox"])')) FormUtils.showError(input, 'Please check this field and try again. This longer validation message must wrap without covering nearby controls or hiding the next field.');
                    });
                    await settled(page);
                    expect(await geometry(page), `${screen}, ${width}px, wrapped messages`).toEqual([]);
                }
            }
        }
    });
}
