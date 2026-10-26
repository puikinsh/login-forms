const { test: base, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const { readdirSync, readFileSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { join, resolve, dirname, sep, extname } = require('node:path');
const { tmpdir } = require('node:os');

const forms = readdirSync('forms', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp' };
const options = { fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' };

const test = base.extend({
    referenceRoot: [async ({}, use) => {
        execFileSync('python3', ['scripts/visual-reference.py', '--check']);
        const root = mkdtempSync(join(tmpdir(), 'login-visual-'));
        try {
            execFileSync('python3', ['-c', 'import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', 'tests/visual/reference.zip', root]);
            await use(root);
        } finally {
            rmSync(root, { recursive: true, force: true });
        }
    }, { scope: 'worker' }],
    reference: async ({ context, referenceRoot }, use) => {
        const page = await context.newPage();
        await page.route('**/__visual_reference__/**', async route => {
            const relative = decodeURIComponent(new URL(route.request().url()).pathname.slice('/__visual_reference__/'.length));
            let file = resolve(referenceRoot, relative || '.');
            try {
                if (file !== referenceRoot && !file.startsWith(referenceRoot + sep)) throw new Error('Invalid reference path');
                if (statSync(file).isDirectory()) file = join(file, 'index.html');
                await route.fulfill({ body: readFileSync(file), contentType: types[extname(file)] || 'application/octet-stream' });
            } catch {
                await route.fulfill({ status: 404, body: 'Missing frozen reference' });
            }
        });
        await use(page);
        await page.close();
    },
});

async function ready(page) {
    await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode()));
    });
    await page.mouse.move(0, 0);
}

async function compare(page, reference, testInfo, name, { masks = [], fullPage = true } = {}) {
    // Never create the expected image from the current page or allow CLI auto-approval.
    expect(testInfo.config.updateSnapshots, 'Use npm run visual:update after reviewing intentional changes.').toBe('none');
    await ready(reference);
    const expected = testInfo.snapshotPath(name);
    mkdirSync(dirname(expected), { recursive: true });
    writeFileSync(expected, await reference.screenshot({ ...options, fullPage, mask: masks.map(selector => reference.locator(selector)) }));
    await ready(page);
    await expect(page).toHaveScreenshot(name, { ...options, fullPage, mask: masks.map(selector => page.locator(selector)), maxDiffPixels: 0, threshold: 0.2 });
}

for (const slug of forms) {
    test(`${slug} layout and validation`, async ({ page, reference }, testInfo) => {
        await reference.goto(`/__visual_reference__/forms/${slug}/`);
        await page.goto(`/forms/${slug}/`);
        await expect(reference.locator('form')).toBeVisible();
        await expect(page.locator('form')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await compare(page, reference, testInfo, `${slug}-idle.png`);
        await reference.locator('button[type="submit"]').click();
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
        await expect(page.locator('#password')).toHaveAttribute('aria-invalid', 'true');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await compare(page, reference, testInfo, `${slug}-errors.png`);
        for (const target of [reference, page]) {
            await target.locator('#email').fill('short');
            await target.locator('#password').fill('short');
            await target.locator('button[type="submit"]').click();
            await target.locator('h1, h2').first().click();
        }
        await compare(page, reference, testInfo, `${slug}-filled-errors.png`);
    });
}

for (const slug of forms) {
    for (const screen of ['sign-up', 'reset-password', 'new-password']) {
        test(`${slug} ${screen} layouts`, async ({ page, reference }, testInfo) => {
            await reference.goto(`/__visual_reference__/forms/${slug}/${screen}.html`);
            await page.goto(`/forms/${slug}/${screen}.html`);
            for (const target of [reference, page]) await expect(target.locator('button[type="submit"]')).toBeEnabled();
            await compare(page, reference, testInfo, `${slug}-${screen}-idle.png`);
            for (const target of [reference, page]) {
                await target.locator('button[type="submit"]').click();
                for (const field of await target.locator('form input').all()) await expect(field).toHaveAttribute('aria-invalid', 'true');
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await compare(page, reference, testInfo, `${slug}-${screen}-errors.png`);
            for (const target of [reference, page]) {
                if (screen !== 'new-password') await target.locator('#email').fill('short');
                if (screen !== 'reset-password') await target.locator('#password').fill('short');
                await target.locator('button[type="submit"]').click();
                await target.locator('h1, h2').first().click();
            }
            await compare(page, reference, testInfo, `${slug}-${screen}-filled-errors.png`);
            for (const target of [reference, page]) {
                if (screen !== 'new-password') await target.locator('#email').fill('person@example.com');
                if (screen !== 'reset-password') await target.locator('#password').fill('a long demo passphrase');
                await target.locator('button[type="submit"]').click();
                await expect(target.locator('#successMessage')).toBeFocused();
            }
            await compare(page, reference, testInfo, `${slug}-${screen}-success.png`);
        });
    }
}

test('complete gallery layout', async ({ page, reference }, testInfo) => {
    await reference.goto('/__visual_reference__/');
    await page.goto('/');
    await expect(page.locator('[data-preview]:visible')).toHaveCount(forms.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await compare(page, reference, testInfo, 'gallery.png');
});

test('live preview dialog layout', async ({ page, reference }, testInfo) => {
    await reference.goto('/__visual_reference__/?q=basic');
    await page.goto('/?q=basic');
    for (const target of [reference, page]) {
        await target.getByRole('button', { name: 'Preview Basic Form', exact: true }).click();
        await expect(target.frameLocator('#preview-frame').locator('#email')).toBeVisible();
    }
    for (const screen of ['signin', 'signup', 'request-reset', 'new-password']) {
        for (const target of [reference, page]) {
            await target.getByLabel('Screen', { exact: true }).selectOption(screen);
            await expect(target.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        }
        await compare(page, reference, testInfo, `preview-${screen}.png`, { fullPage: false });
    }
});


test('shared preview manual-copy layout', async ({ page, reference }, testInfo) => {
    for (const [target, prefix] of [[reference, '/__visual_reference__/'], [page, '/']]) {
        await target.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
            writeText: async () => { throw new Error('Unavailable'); },
        } }));
        await target.goto(`${prefix}?preview=corporate&screen=signup&device=mobile`);
        await expect(target.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
        await target.getByRole('button', { name: 'Copy link', exact: true }).click();
        await expect(target.getByLabel('Preview link', { exact: true })).toBeFocused();
        expect(await target.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    // Frozen references use a different URL prefix; functional checks verify the actual link.
    await compare(page, reference, testInfo, 'preview-share-fallback.png', { masks: ['#preview-link'], fullPage: false });
});


test('side-by-side comparison layouts', async ({ page, reference }, testInfo) => {
    for (const [target, prefix] of [[reference, '/__visual_reference__/'], [page, '/']]) {
        await target.goto(`${prefix}?preview=basic&compare=neon&screen=signin&device=desktop`);
        await expect(target.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
    }
    for (const device of ['Desktop', 'Mobile']) {
        for (const screen of ['signin', 'signup', 'request-reset', 'new-password']) {
            for (const target of [reference, page]) {
                await target.getByRole('button', { name: device, exact: true }).click();
                await target.getByLabel('Screen', { exact: true }).selectOption(screen);
                await expect(target.locator('.preview-stage')).toHaveAttribute('aria-busy', 'false');
            }
            await compare(page, reference, testInfo, `comparison-${device}-${screen}.png`, { fullPage: false });
        }
    }
});

test('shared shortlist and favorites layouts', async ({ page, reference }, testInfo) => {
    for (const [target, prefix] of [[reference, '/__visual_reference__/'], [page, '/']]) {
        await target.addInitScript(() => {
            localStorage.setItem('login-forms:favorites:v1', JSON.stringify(['basic', 'neon']));
            Object.defineProperty(navigator, 'clipboard', { value: {
                writeText: async () => { throw new Error('Unavailable'); },
            } });
        });
        await target.goto(`${prefix}?shortlist=basic,neon&collection=shortlist`);
        await expect(target.locator('.form-card:visible')).toHaveCount(2);
    }
    await compare(page, reference, testInfo, 'favorites-shortlist.png');
    for (const target of [reference, page]) {
        await target.getByRole('button', { name: 'Share shortlist', exact: true }).click();
        await expect(target.getByLabel('Shortlist link', { exact: true })).toBeFocused();
    }
    await compare(page, reference, testInfo, 'shortlist-share-fallback.png', { masks: ['#shortlist-link'] });
});

test('named list management layouts', async ({ page, reference }, testInfo) => {
    for (const [target, prefix] of [[reference, '/__visual_reference__/'], [page, '/']]) {
        await target.addInitScript(() => {
            localStorage.setItem('login-forms:lists:v1', JSON.stringify({
                lists: [{ id: 'list-demo', name: 'Client project', forms: ['basic', 'neon'] }], selected: 'list-demo',
            }));
            Object.defineProperty(navigator, 'clipboard', { value: {
                writeText: async () => { throw new Error('Unavailable'); },
            } });
        });
        await target.goto(`${prefix}?collection=saved&list=list-demo`);
        await expect(target.locator('.form-card:visible')).toHaveCount(2);
    }
    await compare(page, reference, testInfo, 'named-list.png');
    for (const target of [reference, page]) {
        await target.getByRole('button', { name: 'Rename', exact: true }).click();
        await target.getByLabel('List name', { exact: true }).fill(' ');
        await target.getByRole('button', { name: 'Save name', exact: true }).click();
    }
    await compare(page, reference, testInfo, 'named-list-error.png');
    for (const target of [reference, page]) {
        await target.locator('#cancel-list-editor').click();
        await target.getByRole('button', { name: 'Delete', exact: true }).click();
    }
    await compare(page, reference, testInfo, 'named-list-delete.png');
    for (const target of [reference, page]) {
        await target.locator('#cancel-delete-list').click();
        await target.getByRole('button', { name: 'Share list', exact: true }).click();
        await expect(target.getByLabel('Shortlist link', { exact: true })).toBeFocused();
    }
    await compare(page, reference, testInfo, 'named-list-share.png', { masks: ['#shortlist-link'] });
});
