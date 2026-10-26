import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const base = 'http://127.0.0.1:8000';
const output = 'assets/screenshots';
const forms = (await readdir('forms', { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
const profile = { viewport: { width: 1200, height: 900 }, thumbnails: [400, 800], quality: 82, smallQuality: 76, pngWidth: 1200 };
const digest = data => createHash('sha256').update(data).digest('hex');
const inputHash = async slug => digest(Buffer.concat([
    Buffer.from(JSON.stringify(profile)),
    ...await Promise.all([`forms/${slug}/index.html`, `forms/${slug}/style.css`, `forms/${slug}/script.js`, 'shared/js/form-utils.js'].map(file => readFile(file))),
]));

if (process.argv.includes('--check')) {
    const manifest = JSON.parse(await readFile(`${output}/manifest.json`, 'utf8'));
    if (JSON.stringify(manifest.profile) !== JSON.stringify(profile)) throw new Error('Screenshot settings changed. Run npm run screenshots.');
    if (Object.keys(manifest.forms).sort().join() !== forms.join()) throw new Error('Screenshot collection differs from templates. Run npm run screenshots.');
    for (const slug of forms) {
        const entry = manifest.forms[slug];
        if (entry.inputHash !== await inputHash(slug)) throw new Error(`${slug}: screenshot is stale. Run npm run screenshots.`);
        for (const [name, info] of Object.entries(entry.files)) {
            const data = await readFile(`${output}/${name}`);
            const metadata = await sharp(data).metadata();
            if (digest(data) !== info.sha256 || metadata.width !== info.width || metadata.height !== info.height) throw new Error(`${name}: screenshot is missing or changed. Run npm run screenshots.`);
            if (name.endsWith('.webp') && data.length > 75_000) throw new Error(`${name}: thumbnail exceeds the 75 KB budget.`);
        }
    }
    console.log(`Verified fresh screenshots and responsive assets for ${forms.length} templates.`);
} else {
    let server;
    let browser;
    try {
        try { await fetch(base); } catch {
            server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'ignore' });
            for (let attempt = 0; attempt < 50; attempt++) {
                await delay(100);
                try { if ((await fetch(base)).ok) break; } catch { /* Server is still starting. */ }
            }
        }
        browser = await chromium.launch();
        const page = await browser.newPage({ viewport: profile.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
        const manifest = { profile, forms: {} };
        for (const slug of forms) {
            await page.goto(`${base}/forms/${slug}/`);
            await page.locator('form').waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);
            const original = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
            const variants = {
                [`${slug}.png`]: await sharp(original).resize({ width: profile.pngWidth }).png({ palette: true, quality: 90, effort: 8, dither: 0.8 }).toBuffer(),
            };
            for (const width of profile.thumbnails) {
                variants[`${slug}-${width}.webp`] = await sharp(original).resize({ width }).webp({ quality: width === 400 ? profile.smallQuality : profile.quality, effort: 6 }).toBuffer();
            }
            const files = {};
            for (const [name, data] of Object.entries(variants)) {
                await writeFile(`${output}/${name}`, data);
                const { width, height } = await sharp(data).metadata();
                files[name] = { width, height, bytes: data.length, sha256: digest(data) };
            }
            manifest.forms[slug] = { inputHash: await inputHash(slug), files };
        }
        await writeFile(`${output}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
        const galleryBytes = (await Promise.all(forms.map(slug => stat(`${output}/${slug}-400.webp`)))).reduce((sum, file) => sum + file.size, 0);
        console.log(`Refreshed ${forms.length} screenshots; all 400px gallery thumbnails total ${Math.round(galleryBytes / 1024)} KiB.`);
    } finally {
        await browser?.close();
        server?.kill();
    }
}
