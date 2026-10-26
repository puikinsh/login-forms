const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync } = require('node:fs');
const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const key = 'login-forms:favorites:v1';
const favorite = (page, slug) => page.locator(`[data-slug="${slug}"] .favorite-toggle`);
const visibleCards = page => page.locator('.form-card:visible');

async function fallbackClipboard(page) {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
        writeText: async () => { throw new Error('Unavailable'); },
    } }));
}

async function accessible(page) {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([]);
}

test('favorites persist, combine filters, and restore focus when removing the last match', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#compare-favorites')).toBeDisabled();
    await favorite(page, 'basic').click();
    await favorite(page, 'neon').click();
    await expect(page.locator('#favorites-count')).toHaveText('2 favorites');
    await page.reload();
    await expect(favorite(page, 'basic')).toHaveAttribute('aria-pressed', 'true');
    await page.getByLabel('Show', { exact: true }).selectOption('favorites');
    await expect(visibleCards(page)).toHaveCount(2);
    await page.getByLabel('Search forms').fill('basic');
    await expect(visibleCards(page)).toHaveCount(1);
    await favorite(page, 'basic').press('Space');
    await expect(visibleCards(page)).toHaveCount(0);
    await expect(page.getByLabel('Show', { exact: true })).toBeFocused();
    await expect(page.locator('#empty-state')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(visibleCards(page)).toHaveCount(forms.length);
    await expect(favorite(page, 'neon')).toHaveAttribute('aria-pressed', 'true');
    await favorite(page, 'basic').click();
    await page.getByRole('button', { name: 'Compare favorites', exact: true }).click();
    await expect(page.getByLabel('First form', { exact: true })).toHaveValue('neon');
    await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('basic');
    await page.getByRole('button', { name: 'Close preview' }).click();
    await favorite(page, 'basic').click();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual(['neon']);
});

test('both selectors always include every original and newer form, with favorites first', async ({ page }) => {
    await page.goto('/?q=basic&category=minimal');
    await favorite(page, 'basic').click();
    await page.locator('[data-preview="basic"]').click();
    for (const id of ['preview-form', 'compare-form']) {
        const values = await page.locator(`#${id} option`).evaluateAll(options => options.map(option => option.value).filter(Boolean).sort());
        expect(values).toEqual(forms);
        await expect(page.locator(`#${id} optgroup`).first()).toHaveAttribute('label', 'Favorites / shortlist');
    }
    await page.getByLabel('Compare with', { exact: true }).selectOption('corporate');
    await expect(page.frameLocator('#compare-frame').locator('#email')).toBeVisible();
});

test('favorites launch comparison and preserve shortlist when sharing preview links', async ({ page }) => {
    await fallbackClipboard(page);
    await page.goto('/?shortlist=basic,neon&collection=shortlist');
    await page.getByRole('button', { name: 'Compare shortlist', exact: true }).click();
    await expect(page.getByLabel('First form', { exact: true })).toHaveValue('neon');
    await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('basic');
    await page.getByLabel('Screen', { exact: true }).selectOption('signup');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    const url = new URL(await page.getByLabel('Preview link', { exact: true }).inputValue());
    expect(url.searchParams.get('shortlist')).toBe('basic,neon');
    expect(url.searchParams.get('screen')).toBe('signup');
    expect(url.searchParams.get('device')).toBe('mobile');
    await page.goto(url.href);
    await expect(page.frameLocator('#preview-frame').locator('#email')).toBeVisible();
    await expect(page.frameLocator('#compare-frame').locator('#email')).toBeVisible();
    await page.getByRole('button', { name: 'Close preview' }).click();
    await expect(visibleCards(page)).toHaveCount(2);
});

test('shared shortlists do not replace local favorites and can be explicitly saved', async ({ page }) => {
    await fallbackClipboard(page);
    await page.goto('/');
    await favorite(page, 'corporate').click();
    await page.goto('/?shortlist=basic,neon,basic,unknown,%3Cscript%3E&collection=shortlist');
    await expect(visibleCards(page)).toHaveCount(2);
    await expect(page.locator('#favorites-count')).toHaveText('1 favorite');
    await expect(favorite(page, 'basic')).toHaveAttribute('aria-pressed', 'false');
    await page.getByRole('button', { name: 'Save shared shortlist' }).click();
    await expect(page.locator('#favorites-count')).toHaveText('3 favorites');
    await expect(page.getByRole('button', { name: 'Save shared shortlist' })).toBeDisabled();
    await page.getByRole('button', { name: 'Share shortlist', exact: true }).click();
    await expect(page.getByLabel('Shortlist link', { exact: true })).toBeFocused();
    const url = new URL(await page.getByLabel('Shortlist link', { exact: true }).inputValue());
    expect(url.searchParams.get('shortlist').split(',').sort()).toEqual(['basic', 'neon']);
    await page.reload();
    await expect(visibleCards(page)).toHaveCount(2);
    await page.getByLabel('Show', { exact: true }).selectOption('favorites');
    await expect(visibleCards(page)).toHaveCount(3);
});

test('sharing favorites clears search filters and supports clipboard success', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
        writeText: async value => { window.copiedShortlist = value; },
    } }));
    await page.goto('/?q=basic#collection');
    await favorite(page, 'basic').click();
    await page.getByRole('button', { name: 'Share favorites', exact: true }).click();
    await expect(page.locator('#favorites-status')).toHaveText('Shortlist link copied.');
    const link = new URL(await page.evaluate(() => window.copiedShortlist));
    expect(link.searchParams.get('shortlist')).toBe('basic');
    expect(link.searchParams.get('collection')).toBe('shortlist');
    expect(link.searchParams.has('q')).toBe(false);
    expect(link.hash).toBe('#collection');
    await page.goto(link.href);
    await expect(visibleCards(page)).toHaveCount(1);
});

test('favorites work and remain shareable when storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new Error('Blocked'); };
        Storage.prototype.setItem = () => { throw new Error('Blocked'); };
    });
    await fallbackClipboard(page);
    await page.goto('/');
    await favorite(page, 'basic').click();
    await expect(favorite(page, 'basic')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#favorites-status')).toContainText('last for this visit');
    await page.getByRole('button', { name: 'Share favorites', exact: true }).click();
    await expect(page.getByLabel('Shortlist link', { exact: true })).toBeVisible();
});

test('invalid local and shared values are ignored without breaking the full collection', async ({ page }) => {
    await page.addInitScript(key => localStorage.setItem(key, '{broken'), key);
    await page.goto('/?shortlist=unknown,%3Cimg%3E&collection=shortlist');
    await expect(visibleCards(page)).toHaveCount(forms.length);
    await expect(page.locator('#favorites-count')).toHaveText('0 favorites');
    await favorite(page, 'basic').click();
    await expect(page.locator('#favorites-count')).toHaveText('1 favorite');
});

test('favorites synchronize across tabs without losing the active preview selection', async ({ page, context }) => {
    await page.goto('/?preview=basic&compare=corporate');
    const other = await context.newPage();
    await other.goto('/');
    await favorite(other, 'neon').click();
    await expect(page.locator('#favorites-count')).toHaveText('1 favorite');
    await expect(page.getByLabel('First form', { exact: true })).toHaveValue('basic');
    await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('corporate');
    await expect(page.locator('#compare-form option[value="basic"]')).toBeDisabled();
    await other.evaluate(() => localStorage.clear());
    await expect(page.locator('#favorites-count')).toHaveText('0 favorites');
});

test('shared shortlist and manual sharing fit mobile and are accessible', async ({ page }) => {
    await fallbackClipboard(page);
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto('/?shortlist=basic,neon&collection=shortlist');
    await page.getByRole('button', { name: 'Share shortlist', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await accessible(page);
    await page.getByRole('button', { name: 'Compare shortlist', exact: true }).click();
    await expect(page.frameLocator('#compare-frame').locator('#email')).toBeVisible();
    await accessible(page);
});
