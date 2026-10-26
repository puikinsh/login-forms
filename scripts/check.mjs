import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { HtmlValidate } from 'html-validate';

const root = resolve('.');
const forms = (await readdir('forms', { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name);
const validator = new HtmlValidate({
    rules: {
        'close-order': 'error',
        'no-dup-id': 'error',
        'no-dup-attr': 'error',
        'input-missing-label': 'error',
        'attr-quotes': 'error',
        'valid-id': 'error',
        'wcag/h32': 'error',
        'wcag/h37': 'error',
    },
});
let failures = 0;
const fail = message => { console.error(message); failures++; };
for (const file of ['shared/js/form-utils.js', 'assets/js/contact-form.js', 'assets/js/gallery.js', 'scripts/screenshots.mjs', ...forms.map(name => `forms/${name}/script.js`), 'playwright.config.js', 'tests/forms.spec.js', 'tests/auth.spec.js', 'tests/gallery.spec.js', 'tests/comparison.spec.js', 'tests/favorites.spec.js', 'tests/named-lists.spec.js', 'tests/layout.spec.js', 'tests/visual.spec.js', 'tests/shared.spec.js', 'scripts/serve.mjs', 'scripts/check.mjs']) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) fail(result.stderr);
}
for (const file of ['index.html', ...forms.flatMap(name => ['index.html', 'sign-up.html', 'reset-password.html', 'new-password.html'].map(page => `forms/${name}/${page}`))]) {
    const source = await readFile(file, 'utf8');
    const report = await validator.validateString(source, file);
    for (const result of report.results) {
        for (const message of result.messages) fail(`${file}:${message.line}: ${message.message} (${message.ruleId})`);
    }
    const references = [...source.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
    for (const [, value] of source.matchAll(/srcset="([^"]+)"/g)) {
        references.push(...value.split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    }
    for (const reference of references) {
        if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
        const target = resolve(dirname(file), decodeURIComponent(reference.split(/[?#]/)[0]));
        if (!target.startsWith(root + '/')) { fail(`${file}: reference outside project: ${reference}`); continue; }
        try { await access(target); } catch { fail(`${file}: missing ${reference}`); }
    }
    if (/<script[^>]+src=["'](?:https?:)?\/\//i.test(source) || /<link[^>]+(?:rel="stylesheet"[^>]+href="(?:https?:)?\/\/|href="(?:https?:)?\/\/[^"]*"[^>]+rel="stylesheet")/i.test(source)) fail(`${file}: external runtime dependency`);
    if (file === 'index.html') continue;
    if (!/<form[^>]*method="post"/i.test(source)) fail(`${file}: use POST to avoid credentials in fallback URLs`);
    for (const name of (file.endsWith('/reset-password.html') ? ['email'] : file.endsWith('/new-password.html') ? ['password'] : ['email', 'password'])) {
        const input = source.match(new RegExp(`<input[^>]*id="${name}"[^>]*>`))?.[0] || '';
        const describedBy = input.match(/aria-describedby="([^"]+)"/)?.[1].split(/\s+/) || [];
        if (!describedBy.includes(`${name}Error`)) fail(`${file}: ${name} must reference its error`);
    }
    const flow = file.endsWith('/sign-up.html') ? 'signup' : file.endsWith('/reset-password.html') ? 'request-reset' : file.endsWith('/new-password.html') ? 'reset-password' : null;
    if (flow) {
        if (!source.includes(`data-auth-flow="${flow}"`)) fail(`${file}: missing flow hook`);
        if (!/<button[^>]*type="submit"[^>]*\bdisabled\b/.test(source)) fail(`${file}: companion demo must not submit without JavaScript`);
        if (flow !== 'request-reset' && !source.includes('autocomplete="new-password"')) fail(`${file}: missing password-manager hint`);
        if (!source.includes('Nothing is saved.')) fail(`${file}: missing explicit demo notice`);
    }
    if (source.indexOf('../../shared/js/form-utils.js') > source.indexOf('src="script.js"')) fail(`${file}: shared script must load first`);
    for (const asset of ['style.css', 'script.js', 'README.md']) await access(join(dirname(file), asset)).catch(() => fail(`${file}: missing ${asset}`));
}
const gallery = await readFile('index.html', 'utf8');
const listed = [...gallery.matchAll(/class="form-card" data-slug="([^"]+)"/g)].map(match => match[1]);
if (listed.length !== forms.length || new Set(listed).size !== forms.length || forms.some(name => !listed.includes(name))) fail('Gallery must list every form exactly once.');
for (const name of forms) {
    if (!gallery.includes(`href="downloads/${name}.zip"`)) fail(`Gallery: missing ${name} download`);
    if (!gallery.includes(`data-preview="${name}"`)) fail(`Gallery: missing ${name} preview`);
}
if (failures) process.exitCode = 1;
else console.log(`Checked ${forms.length} templates: HTML structure, JavaScript syntax, local references, and form contracts.`);
