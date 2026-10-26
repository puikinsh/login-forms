const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync } = require('node:fs');
const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);

for (const [index, slug] of forms.entries()) {
    test(`${slug} compares with another design using synchronized screens and viewports`, async ({ page }) => {
        const peer = forms[(index + 1) % forms.length];
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('/');
        expect(page.frames()).toHaveLength(2); // Main page and the empty primary iframe only.
        await page.locator(`[data-preview="${slug}"]`).click();
        await page.getByLabel('Compare with', { exact: true }).selectOption(peer);
        await expect(page.getByRole('heading', { name: 'Compare forms', exact: true })).toBeVisible();
        for (const [screen, filename] of [['signin', 'index'], ['signup', 'sign-up'], ['request-reset', 'reset-password'], ['new-password', 'new-password']]) {
            await page.getByLabel('Screen', { exact: true }).selectOption(screen);
            await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
            for (const [selector, name] of [['#preview-frame', slug], ['#compare-frame', peer]]) {
                expect(page.locator(selector).contentFrame()).toBeTruthy();
                await expect.poll(() => page.locator(selector).evaluate(frame => frame.contentWindow.location.href)).toContain(`/forms/${name}/${filename}.html`);
            }
            for (const device of ['Mobile', 'Desktop']) {
                await page.getByRole('button', { name: device, exact: true }).click();
                for (const selector of ['#preview-frame', '#compare-frame']) {
                    await expect.poll(() => page.locator(selector).evaluate(frame => frame.contentWindow.innerWidth)).toBe(device === 'Mobile' ? 375 : 1100);
                }
            }
        }
        await page.getByLabel('Screen', { exact: true }).selectOption('signup');
        const first = page.frameLocator('#preview-frame');
        const second = page.frameLocator('#compare-frame');
        await first.locator('#email').fill('first@example.com');
        await second.locator('#email').fill('second@example.com');
        await page.getByRole('button', { name: 'Mobile', exact: true }).click();
        await expect(first.locator('#email')).toHaveValue('first@example.com');
        await expect(second.locator('#email')).toHaveValue('second@example.com');
        await second.getByRole('link', { name: 'Reset password', exact: true }).click();
        await expect(page.getByLabel('Screen', { exact: true })).toHaveValue('request-reset');
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        for (const selector of ['#preview-frame', '#compare-frame']) {
            await expect(page.locator(selector).contentFrame().locator('form')).toHaveAttribute('data-auth-flow', 'request-reset');
        }
        const url = new URL(page.url());
        expect(Object.fromEntries(url.searchParams)).toEqual({ preview: slug, compare: peer, screen: 'request-reset', device: 'mobile' });
        await page.reload();
        await expect(page.getByLabel('First form', { exact: true })).toHaveValue(slug);
        await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue(peer);
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        await page.getByLabel('Compare with', { exact: true }).selectOption('');
        await expect(page.locator('#compare-frame')).toHaveCount(0);
        expect(new URL(page.url()).searchParams.has('compare')).toBe(false);
        await first.locator('#email').press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        expect(errors).toEqual([]);
    });
}

test('comparison links copy both designs, support history, and reject invalid peers', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.copied = text; } } }));
    await page.goto('/?q=basic');
    await page.locator('[data-preview="basic"]').click();
    await page.getByLabel('Compare with', { exact: true }).selectOption('neon');
    await page.getByLabel('Screen', { exact: true }).selectOption('new-password');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(page.locator('#preview-status')).toHaveText('Preview link copied.');
    expect(new URL(await page.evaluate(() => window.copied)).searchParams.get('compare')).toBe('neon');
    await page.goBack();
    await expect(page.getByRole('dialog')).toBeHidden();
    await page.goForward();
    await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('neon');
    await expect(page.getByLabel('Screen', { exact: true })).toHaveValue('new-password');
    for (const peer of ['basic', '../../outside']) {
        await page.goto(`/?preview=basic&compare=${peer}&screen=signup&device=desktop`);
        await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('');
        await expect(page.locator('#compare-frame')).toHaveCount(0);
        expect(new URL(page.url()).searchParams.has('compare')).toBe(false);
    }
});

test('phone comparisons remain side by side in a labeled scroll region and are accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/?preview=basic&compare=neon&screen=signup&device=mobile');
    await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
    const bounds = await page.locator('.preview-pane:visible').evaluateAll(panes => panes.map(pane => pane.getBoundingClientRect().toJSON()));
    expect(bounds[1].left).toBeGreaterThanOrEqual(bounds[0].right);
    expect(Math.abs(bounds[0].top - bounds[1].top)).toBeLessThan(1);
    const canvases = await page.locator('.preview-pane:visible .preview-canvas').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
    expect(Math.abs(canvases[0] - canvases[1])).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.preview-stage').evaluate(stage => { stage.scrollLeft = stage.scrollWidth; });
    await expect(page.frameLocator('#compare-frame').locator('#email')).toBeVisible();
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(n => n.target) }))).toEqual([]);
});
