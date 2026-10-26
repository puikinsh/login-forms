const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { readdirSync, readFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');

const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
const visibleCards = page => page.locator('.form-card:visible');
// Frame enumeration can include Firefox's detached about:blank documents.
const previewDocument = page => page.frameLocator('#preview-frame').locator('html');

async function expectAccessible(page) {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }))).toEqual([]);
}

test('gallery combines search/category filters, handles no results, and restores URLs', async ({ page }) => {
    await page.goto('/');
    await expect(visibleCards(page)).toHaveCount(forms.length);
    await page.getByLabel('Search forms').fill('  NEON  ');
    await expect(visibleCards(page)).toHaveCount(2);
    await expect(page.locator('#gallery-results')).toHaveText(`2 forms of ${forms.length}`);
    await page.getByLabel('Category', { exact: true }).selectOption('themed');
    await expect(visibleCards(page)).toHaveCount(1);
    await expect(visibleCards(page)).toHaveAttribute('data-slug', 'neon-cyber');
    await page.reload();
    await expect(visibleCards(page)).toHaveCount(1);
    await expect(page.getByLabel('Category', { exact: true })).toHaveValue('themed');
    await page.getByLabel('Search forms').fill('no such design');
    await expect(visibleCards(page)).toHaveCount(0);
    await expect(page.locator('.category:visible')).toHaveCount(0);
    await expect(page.locator('#empty-state')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(visibleCards(page)).toHaveCount(forms.length);
    await expect(page.getByLabel('Search forms')).toBeFocused();
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
    await expect(page).toHaveURL(/\/$/);
    await page.getByLabel('Search forms').fill('particle celebration');
    await expect(visibleCards(page)).toHaveCount(1);
    await expect(visibleCards(page)).toHaveAttribute('data-slug', 'creative');
});

test('preview changes the actual viewport, preserves form state, and closes from inside the frame', async ({ page }) => {
    const demoRequests = [];
    page.on('request', request => {
        if (/\/forms\/.*\/index.html/.test(request.url())) demoRequests.push(request.url());
    });
    await page.goto('/');
    expect(demoRequests).toHaveLength(0);
    const opener = page.getByRole('button', { name: 'Preview Basic Form', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toHaveText('Basic Form preview');
    const frame = page.frameLocator('#preview-frame');
    await expect(frame.locator('#email')).toBeVisible();
    await expect.poll(() => previewDocument(page).evaluate(() => innerWidth)).toBe(1100);
    await frame.locator('#email').fill('person@example.com');
    await dialog.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expect.poll(() => previewDocument(page).evaluate(() => innerWidth)).toBe(375);
    await expect(frame.locator('#email')).toHaveValue('person@example.com');
    await expect(dialog.getByRole('button', { name: 'Mobile', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(demoRequests).toHaveLength(1);
    await frame.locator('#email').press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('#preview-frame')).not.toHaveAttribute('src');
});

test('gallery and mobile preview are accessible and fit a phone screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expectAccessible(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Preview Basic Form', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Mobile', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.frameLocator('#preview-frame').locator('#email')).toBeVisible();
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expectAccessible(page);
    await dialog.getByRole('button', { name: 'Close preview' }).click();
    await expect(dialog).toBeHidden();
});

for (const slug of forms) {
    test(`${slug} preview switches screens and follows the reset flow`, async ({ page }) => {
        const errors = [];
        const requests = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => {
            if (new URL(request.url()).pathname.includes('/forms/') && request.isNavigationRequest()) requests.push(request.url());
        });
        await page.goto('/');
        expect(requests).toEqual([]);
        await page.locator(`[data-preview="${slug}"]`).click();
        const screen = page.getByLabel('Screen', { exact: true });
        const frame = page.frameLocator('#preview-frame');
        await expect(screen).toHaveValue('signin');
        await expect(page.locator('#preview-status')).toHaveText('Sign in preview ready.');
        for (const [value, label, filename] of [
            ['signup', 'Sign up', 'sign-up.html'],
            ['request-reset', 'Reset password', 'reset-password.html'],
            ['new-password', 'New password', 'new-password.html'],
            ['signin', 'Sign in', 'index.html'],
        ]) {
            await screen.focus();
            await screen.selectOption(value);
            await expect(page.locator('#preview-status')).toHaveText(`${label} preview ready.`);
            await expect(screen).toBeFocused();
            await expect(page.locator('#preview-frame')).toHaveAttribute('title', new RegExp(label));
            expect(await previewDocument(page).evaluate(() => location.href)).toContain(`/forms/${slug}/${filename}`);
            expect(new URL(page.url()).searchParams.get('screen')).toBe(value);
            expect(new URL(page.url()).searchParams.get('preview')).toBe(slug);
            for (const [device, width] of [['Mobile', 375], ['Desktop', 1100]]) {
                await page.getByRole('button', { name: device, exact: true }).click();
                await expect.poll(() => previewDocument(page).evaluate(() => innerWidth)).toBe(width);
                expect(new URL(page.url()).searchParams.get('device')).toBe(device.toLowerCase());
                expect(await previewDocument(page).evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            }
        }
        // Follow native links, not just the outer switcher, through the complete reset journey.
        await frame.locator('[data-action="signup"]').click();
        await expect(screen).toHaveValue('signup');
        await frame.locator('#email').fill('person@example.com');
        const count = requests.length;
        await screen.selectOption('signup');
        await expect(frame.locator('#email')).toHaveValue('person@example.com');
        expect(requests).toHaveLength(count);
        await page.getByRole('button', { name: 'Mobile', exact: true }).click();
        await expect(frame.locator('#email')).toHaveValue('person@example.com');
        expect(requests).toHaveLength(count);
        await frame.getByRole('link', { name: 'Reset password', exact: true }).click();
        await expect(screen).toHaveValue('request-reset');
        await frame.locator('#email').fill('person@example.com');
        await frame.locator('button[type="submit"]').click();
        await frame.getByRole('link', { name: 'Preview the new-password screen' }).click();
        await expect(screen).toHaveValue('new-password');
        expect(new URL(page.url()).searchParams.get('screen')).toBe('new-password');
        await expect(page.locator('#preview-status')).toHaveText('New password preview ready.');
        await frame.locator('#password').press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.locator(`[data-preview="${slug}"]`)).toBeFocused();
        await page.locator('[data-preview="basic"]').click();
        await expect(screen).toHaveValue('signin');
        await expect(page.locator('#preview-status')).toHaveText('Sign in preview ready.');
        expect(await previewDocument(page).evaluate(() => location.href)).toContain('/forms/basic/index.html');
        expect(errors).toEqual([]);
    });
}

test('preview screen controls and all flows are accessible on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('[data-preview="basic"]').click();
    for (const screen of ['signin', 'signup', 'request-reset', 'new-password']) {
        await page.getByLabel('Screen', { exact: true }).selectOption(screen);
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        await expectAccessible(page);
        expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight + 1)).toBe(true);
    }
});

for (const [index, slug] of forms.entries()) {
    test(`${slug} shared preview restores after reload with a filtered-out card`, async ({ page }) => {
        const screen = ['signin', 'signup', 'request-reset', 'new-password'][index % 4];
        const device = index % 2 ? 'mobile' : 'desktop';
        await page.goto(`/?q=does-not-match&preview=${slug}&screen=${screen}&device=${device}`);
        for (let attempt = 0; attempt < 2; attempt++) {
            if (attempt) await page.reload();
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByLabel('Screen', { exact: true })).toHaveValue(screen);
            await expect(page.getByRole('button', { name: device === 'mobile' ? 'Mobile' : 'Desktop', exact: true })).toHaveAttribute('aria-pressed', 'true');
            await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
            await expect.poll(() => previewDocument(page).evaluate(() => innerWidth)).toBe(device === 'mobile' ? 375 : 1100);
            expect(await previewDocument(page).evaluate(() => location.href)).toContain(`/forms/${slug}/`);
        }
        await page.getByRole('button', { name: 'Close preview' }).click();
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.getByLabel('Search forms')).toBeFocused();
        expect(new URL(page.url()).searchParams.has('preview')).toBe(false);
        expect(new URL(page.url()).searchParams.has('screen')).toBe(false);
        expect(new URL(page.url()).searchParams.has('device')).toBe(false);
        await page.reload();
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.getByLabel('Search forms')).toHaveValue('does-not-match');
    });
}

test('shared previews restore every screen and device on a phone-sized gallery', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const [screen, file] of [['signin', 'index'], ['signup', 'sign-up'], ['request-reset', 'reset-password'], ['new-password', 'new-password']]) {
        for (const device of ['desktop', 'mobile']) {
            await page.goto(`/?preview=basic&screen=${screen}&device=${device}`);
            await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
            expect(await previewDocument(page).evaluate(() => location.href)).toContain(`/forms/basic/${file}.html`);
            await expect.poll(() => previewDocument(page).evaluate(() => innerWidth)).toBe(device === 'mobile' ? 375 : 1100);
        }
    }
});

test('preview URLs follow Back and Forward without adding an entry for each control change', async ({ page }) => {
    await page.goto('/?q=basic');
    await page.locator('[data-preview="basic"]').click();
    await page.getByLabel('Screen', { exact: true }).selectOption('signup');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
    const frame = page.frameLocator('#preview-frame');
    await frame.getByRole('link', { name: 'Reset password', exact: true }).click();
    await frame.locator('#email').fill('person@example.com');
    await frame.locator('button[type="submit"]').click();
    await frame.getByRole('link', { name: 'Preview the new-password screen' }).click();
    await expect(page.getByLabel('Screen', { exact: true })).toHaveValue('new-password');
    await page.goBack();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL(/\?q=basic$/);
    await page.goForward();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel('Screen', { exact: true })).toHaveValue('new-password');
    await expect(page.getByRole('button', { name: 'Mobile', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
});

test('copy preview links preserves filters and view without including form values', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async text => { window.copiedPreview = text; },
    } }));
    await page.goto('/?q=basic&category=minimal#collection');
    await page.locator('[data-preview="basic"]').click();
    await page.getByLabel('Screen', { exact: true }).selectOption('signup');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await page.frameLocator('#preview-frame').locator('#email').fill('private@example.com');
    await page.frameLocator('#preview-frame').locator('#password').fill('private demo passphrase');
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect(page.locator('#preview-status')).toHaveText('Preview link copied.');
    const copied = new URL(await page.evaluate(() => window.copiedPreview));
    expect(Object.fromEntries(copied.searchParams)).toEqual({ q: 'basic', category: 'minimal', preview: 'basic', screen: 'signup', device: 'mobile' });
    expect(copied.hash).toBe('#collection');
    expect(copied.href).not.toContain('private');
    await expect(page.locator('#preview-share-fallback')).toBeHidden();
    const recipient = await page.context().newPage();
    await recipient.goto(copied.href);
    await expect(recipient.getByLabel('Screen', { exact: true })).toHaveValue('signup');
    await expect(recipient.frameLocator('#preview-frame').locator('#email')).toHaveValue('');
    await recipient.close();
});

for (const unavailable of ['blocked', 'missing']) {
    test(`${unavailable} clipboard exposes an accessible selected link and resets when view changes`, async ({ page }) => {
        await page.addInitScript(unavailable => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: unavailable === 'missing' ? undefined : {
            writeText: async () => { throw new Error('Clipboard unavailable'); },
        } }), unavailable);
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/?preview=basic&screen=new-password&device=mobile');
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        await page.getByRole('button', { name: 'Copy link', exact: true }).click();
        const link = page.getByLabel('Preview link', { exact: true });
        await expect(link).toBeVisible();
        await expect(link).toBeFocused();
        await expect(link).toHaveValue(page.url());
        expect(await link.evaluate(input => input.selectionStart === 0 && input.selectionEnd === input.value.length)).toBe(true);
        await expect(page.locator('#preview-status')).toHaveText('Copy the selected preview link.');
        await expectAccessible(page);
        expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        await page.getByRole('button', { name: 'Desktop', exact: true }).click();
        await expect(link).toBeHidden();
    });

}

test('manual copying remains available when a slow preview finishes loading', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
    let finishLoading;
    const gate = new Promise(resolve => { finishLoading = resolve; });
    await page.route('**/forms/basic/sign-up.html', async route => {
        await gate;
        await route.continue();
    });
    try {
        await page.goto('/?preview=basic&screen=signup&device=mobile', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'true');
        await page.getByRole('button', { name: 'Copy link', exact: true }).click();
        await expect(page.getByLabel('Preview link', { exact: true })).toBeFocused();
        finishLoading();
        await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        await expect(page.getByLabel('Preview link', { exact: true })).toBeVisible();
        await expect(page.getByLabel('Preview link', { exact: true })).toHaveValue(page.url());
        await expect(page.locator('#preview-status')).toHaveText('Copy the selected preview link.');
    } finally { finishLoading(); }
});

test('invalid preview parameters are ignored or normalized without loading arbitrary URLs', async ({ page }) => {
    const requests = [];
    page.on('request', request => { if (request.isNavigationRequest() && request.frame() !== page.mainFrame()) requests.push(request.url()); });
    await page.goto('/?preview=../../outside&screen=https://example.com/&device=unknown');
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(requests).toEqual([]);
    await page.goto('/?preview=basic&screen=https://example.com/&device=unknown');
    await expect(page.getByLabel('Screen', { exact: true })).toHaveValue('signin');
    await expect(page.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
    expect(requests).toHaveLength(1);
    expect(requests[0]).toContain('/forms/basic/index.html');
    expect(new URL(page.url()).searchParams.get('screen')).toBe('signin');
    expect(new URL(page.url()).searchParams.get('device')).toBe('desktop');
});

test('demo and package links remain available without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
        await page.goto('http://127.0.0.1:8000/');
        await expect(visibleCards(page)).toHaveCount(forms.length);
        await expect(page.locator('.form-card [download]')).toHaveCount(forms.length);
        await expect(page.locator('.form-links a').filter({ hasText: 'Open demo' })).toHaveCount(forms.length);
        await expect(page.locator('.gallery-tools')).toBeHidden();
        await expect(page.locator('[data-preview]:visible')).toHaveCount(0);
    } finally {
        await context.close();
    }
});

test('gallery loads responsive WebP thumbnails within the transfer budget', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    try {
        const images = [];
        page.on('response', response => {
            if (/\/assets\/screenshots\//.test(response.url())) images.push(response);
        });
        await page.goto('http://127.0.0.1:8000/');
        await page.evaluate(async () => {
            document.querySelectorAll('.form-preview img').forEach(image => { image.loading = 'eager'; });
            await Promise.all([...document.querySelectorAll('.form-preview img')].map(image => image.decode()));
        });
        expect(images).toHaveLength(forms.length);
        expect(images.every(response => response.url().endsWith('-400.webp'))).toBe(true);
        const sizes = await Promise.all(images.map(async response => (await response.body()).length));
        expect(sizes.reduce((total, bytes) => total + bytes, 0)).toBeLessThan(forms.length * 5_000);
        for (const width of [780, 1024, 1200]) {
            await page.setViewportSize({ width, height: 900 });
            await page.locator('.form-preview img').first().evaluate(image => image.decode());
            const dimensions = await page.locator('.form-preview img').first().evaluate(image => ({ natural: image.naturalWidth, displayed: image.getBoundingClientRect().width, src: image.currentSrc }));
            expect(dimensions.src).toMatch(/-(400|800)\.webp$/);
            expect(dimensions.natural).toBeGreaterThanOrEqual(Math.floor(dimensions.displayed));
        }
        await page.getByLabel('Search forms').fill('basic');
        await expect(visibleCards(page)).toHaveCount(1);
        const filteredWidth = await page.locator('.form-card:visible img').evaluate(image => image.getBoundingClientRect().width);
        expect(filteredWidth).toBeLessThanOrEqual(400);
    } finally {
        await context.close();
    }
});

test('high-density mobile screens select the larger thumbnail', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
    try {
        const page = await context.newPage();
        await page.goto('http://127.0.0.1:8000/');
        await expect.poll(() => page.locator('.form-preview img').first().evaluate(image => image.currentSrc)).toMatch(/-800\.webp$/);
    } finally {
        await context.close();
    }
});

for (const slug of forms) {
    test(`downloaded ${slug} package runs by itself`, async ({ page }, testInfo) => {
        await page.goto('/');
        const downloadEvent = page.waitForEvent('download');
        await page.locator(`[data-slug="${slug}"] [download]`).click();
        const download = await downloadEvent;
        expect(download.suggestedFilename()).toBe(`${slug}.zip`);
        const zip = testInfo.outputPath(`${slug}.zip`);
        await download.saveAs(zip);
        const extracted = testInfo.outputPath('extracted');
        mkdirSync(extracted, { recursive: true });
        execFileSync('python3', ['-c', 'import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', zip, extracted]);
        expect(readFileSync(join(extracted, slug, 'form-utils.js'))).toEqual(readFileSync('shared/js/form-utils.js'));
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(pathToFileURL(join(extracted, slug, 'index.html')).href);
        await page.locator('#email').fill('person@example.com');
        await page.locator('#password').fill('existing password');
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('#successMessage')).toBeVisible();
        await expect(page.locator('#successMessage')).toBeFocused();
        for (const name of ['sign-up', 'reset-password', 'new-password']) {
            await page.goto(pathToFileURL(join(extracted, slug, `${name}.html`)).href);
            await expect(page.locator('button[type="submit"]')).toBeEnabled();
            if (name !== 'new-password') await page.locator('#email').fill('person@example.com');
            if (name !== 'reset-password') await page.locator('#password').fill('a long demo passphrase');
            await page.locator('button[type="submit"]').click();
            await expect(page.locator('#successMessage')).toBeFocused();
        }
        expect(errors).toEqual([]);
    });
}
