const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync } = require('node:fs');
const formCount = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).length;
const key = 'login-forms:lists:v1';
const favorite = (page, slug) => page.locator(`[data-slug="${slug}"] .favorite-toggle`);
const member = (page, slug) => page.locator(`[data-slug="${slug}"] .list-toggle`);
const visible = page => page.locator('.form-card:visible');
async function create(page, name) {
    await page.getByRole('button', { name: 'New list', exact: true }).click();
    await page.getByLabel('List name', { exact: true }).fill(name);
    await page.getByRole('button', { name: 'Create list', exact: true }).click();
}
async function clipboardFallback(page) {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
        writeText: async () => { throw new Error('Unavailable'); },
    } }));
}
async function accessible(page) {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([]);
}

test('multiple named lists persist independently and keep favorites intact', async ({ page }) => {
    await page.goto('/');
    await favorite(page, 'basic').click();
    await favorite(page, 'neon').click();
    await create(page, 'Work');
    await expect(visible(page)).toHaveCount(2);
    const work = await page.getByLabel('Named list', { exact: true }).inputValue();
    await create(page, 'Personal');
    const personal = await page.getByLabel('Named list', { exact: true }).inputValue();
    expect(personal).not.toBe(work);
    await member(page, 'neon').click();
    await expect(visible(page)).toHaveCount(1);
    await expect(page.getByLabel('Show', { exact: true })).toBeFocused();
    await page.getByLabel('Named list', { exact: true }).selectOption(work);
    await expect(visible(page)).toHaveCount(2);
    await page.reload();
    await expect(page.getByLabel('Named list', { exact: true })).toHaveValue(work);
    await expect(visible(page)).toHaveCount(2);
    await page.getByLabel('Named list', { exact: true }).selectOption(personal);
    await expect(visible(page)).toHaveCount(1);
    await expect(page.locator('#favorites-count')).toHaveText('2 favorites');
});

test('an empty list can be populated from the full gallery and compared', async ({ page }) => {
    await page.goto('/');
    await create(page, 'New project');
    await expect(visible(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Compare list', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Add forms', exact: true }).click();
    await expect(visible(page)).toHaveCount(formCount);
    await member(page, 'basic').click();
    await member(page, 'corporate').click();
    await page.getByLabel('Show', { exact: true }).selectOption('saved');
    await expect(visible(page)).toHaveCount(2);
    await page.getByRole('button', { name: 'Compare list', exact: true }).click();
    await expect(page.getByLabel('First form', { exact: true })).toHaveValue('corporate');
    await expect(page.getByLabel('Compare with', { exact: true })).toHaveValue('basic');
    await expect(page.locator('#preview-form option')).toHaveCount(formCount);
    await expect(page.frameLocator('#compare-frame').locator('#email')).toBeVisible();
});

test('rename validates empty and duplicate names and renders names as text', async ({ page }) => {
    await page.goto('/');
    await create(page, 'Work');
    await create(page, 'Personal');
    await page.getByRole('button', { name: 'Rename', exact: true }).click();
    await page.getByLabel('List name', { exact: true }).fill('   ');
    await page.getByRole('button', { name: 'Save name', exact: true }).click();
    await expect(page.locator('#list-name-error')).toHaveText('Enter a list name.');
    await expect(page.getByLabel('List name', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await page.getByLabel('List name', { exact: true }).fill(' work ');
    await page.getByRole('button', { name: 'Save name', exact: true }).click();
    await expect(page.locator('#list-name-error')).toContainText('already uses');
    await page.getByLabel('List name', { exact: true }).fill('<img src=x onerror=alert(1)>');
    await page.getByRole('button', { name: 'Save name', exact: true }).click();
    await expect(page.locator('#saved-list option:checked')).toHaveText('<img src=x onerror=alert(1)>');
    await expect(page.locator('#named-list-help img')).toHaveCount(0);
    await expect(page.getByLabel('Named list', { exact: true })).toBeFocused();
    await page.reload();
    await expect(page.locator('#saved-list option:checked')).toHaveText('<img src=x onerror=alert(1)>');
});

test('delete requires explicit confirmation and preserves other lists and favorites', async ({ page }) => {
    await page.goto('/');
    await favorite(page, 'basic').click();
    await create(page, 'Keep');
    await create(page, 'Delete me');
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.locator('#cancel-delete-list').click();
    await expect(page.locator('#saved-list option')).toHaveCount(3);
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Delete list', exact: true }).click();
    await expect(page.getByLabel('Named list', { exact: true })).toBeFocused();
    await expect(page.locator('#saved-list option')).toHaveCount(2);
    await expect(visible(page)).toHaveCount(formCount);
    await expect(page.locator('#favorites-count')).toHaveText('1 favorite');
    await page.reload();
    await expect(page.locator('#saved-list option')).toHaveText(['Choose a list', 'Keep']);
});

test('named list sharing is portable and imports into a separate named copy', async ({ page, browser }) => {
    await clipboardFallback(page);
    await page.goto('/?shortlist=basic,neon&collection=shortlist&name=Original');
    await page.getByRole('button', { name: 'New list', exact: true }).click();
    await expect(page.getByLabel('List name', { exact: true })).toHaveValue('Original');
    await page.getByRole('button', { name: 'Create list', exact: true }).click();
    await page.getByRole('button', { name: 'Share list', exact: true }).click();
    const link = await page.getByLabel('Shortlist link', { exact: true }).inputValue();
    const url = new URL(link);
    expect(url.searchParams.get('name')).toBe('Original');
    expect(url.searchParams.has('list')).toBe(false);
    expect(url.searchParams.get('collection')).toBe('shortlist');
    const context = await browser.newContext();
    const recipient = await context.newPage();
    await recipient.goto(link);
    await expect(visible(recipient)).toHaveCount(2);
    await expect(recipient.locator('#shared-list-label')).toContainText('Original');
    await expect(recipient.locator('#saved-list option')).toHaveCount(1);
    await expect(recipient.locator('#favorites-count')).toHaveText('0 favorites');
    await create(recipient, 'My copy');
    await expect(recipient.locator('#saved-list option:checked')).toHaveText('My copy');
    await expect(visible(recipient)).toHaveCount(2);
    await context.close();
});

test('named list creation and sharing work with blocked storage', async ({ page }) => {
    await clipboardFallback(page);
    await page.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new Error('Blocked'); };
        Storage.prototype.setItem = () => { throw new Error('Blocked'); };
    });
    await page.goto('/?shortlist=basic,neon&collection=shortlist');
    await create(page, 'Temporary');
    await expect(page.locator('#favorites-status')).toContainText('last for this visit');
    await page.getByRole('button', { name: 'Share list', exact: true }).click();
    await expect(page.getByLabel('Shortlist link', { exact: true })).toBeFocused();
});

test('cross-tab rename, membership, and deletion refresh the selected list safely', async ({ page, context }) => {
    await page.goto('/?shortlist=basic,neon&collection=shortlist');
    await create(page, 'Shared local');
    const other = await context.newPage();
    await other.goto(page.url());
    await other.getByRole('button', { name: 'Rename', exact: true }).click();
    await other.getByLabel('List name', { exact: true }).fill('Renamed elsewhere');
    await other.getByRole('button', { name: 'Save name', exact: true }).click();
    await expect(page.locator('#saved-list option:checked')).toHaveText('Renamed elsewhere');
    await member(other, 'neon').click();
    await expect(visible(page)).toHaveCount(1);
    await other.getByRole('button', { name: 'Delete', exact: true }).click();
    await other.getByRole('button', { name: 'Delete list', exact: true }).click();
    await expect(visible(page)).toHaveCount(formCount);
    await expect(page.locator('#delete-list')).toBeDisabled();
});

test('corrupt saved lists and unknown local IDs recover to the full gallery', async ({ page }) => {
    await page.addInitScript(key => localStorage.setItem(key, JSON.stringify({ lists: [null, { id: '<bad>', name: 'X' },
        { id: 'good', name: 'Okay', forms: ['basic', 'unknown', 'basic'] }, { id: 'good', name: 'Duplicate' }], selected: 'missing' })), key);
    await page.goto('/?collection=saved&list=missing');
    await expect(visible(page)).toHaveCount(formCount);
    await expect(page.locator('#saved-list option')).toHaveText(['Choose a list', 'Okay']);
    await page.getByLabel('Named list', { exact: true }).selectOption('good');
    await expect(visible(page)).toHaveCount(1);
});

test('named list editing, errors, and sharing are accessible and fit a phone', async ({ page }) => {
    await clipboardFallback(page);
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto('/?shortlist=basic,neon&collection=shortlist');
    await create(page, 'A'.repeat(60));
    await accessible(page);
    await page.getByRole('button', { name: 'Rename', exact: true }).click();
    await page.getByLabel('List name', { exact: true }).fill(' ');
    await page.getByRole('button', { name: 'Save name', exact: true }).click();
    await accessible(page);
    await page.getByLabel('List name', { exact: true }).press('Escape');
    await expect(page.getByRole('button', { name: 'Rename', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Share list', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await accessible(page);
});

test('comparison copy links include the complete named list and screen/device settings', async ({ page, browser }) => {
    await clipboardFallback(page);
    await page.goto('/?shortlist=basic,neon,corporate&collection=shortlist');
    await create(page, 'Candidates');
    await page.getByRole('button', { name: 'Compare list', exact: true }).click();
    await page.getByLabel('Screen', { exact: true }).selectOption('signup');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    const url = new URL(await page.getByLabel('Preview link', { exact: true }).inputValue());
    expect(url.searchParams.get('shortlist').split(',').sort()).toEqual(['basic', 'corporate', 'neon']);
    expect(url.searchParams.get('name')).toBe('Candidates');
    expect(url.searchParams.has('list')).toBe(false);
    const context = await browser.newContext();
    const recipient = await context.newPage();
    await recipient.goto(url.href);
    await expect(recipient.getByLabel('Screen', { exact: true })).toHaveValue('signup');
    await expect(recipient.getByRole('button', { name: 'Mobile', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(recipient.frameLocator('#compare-frame').locator('#email')).toBeVisible();
    await recipient.getByRole('button', { name: 'Close preview' }).click();
    await expect(visible(recipient)).toHaveCount(3);
    await context.close();
});
