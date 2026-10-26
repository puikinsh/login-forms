# Repository guidance

## Project and local preview

This repository is a static gallery of 40 login form templates built with plain HTML, CSS, and JavaScript. The shipped templates have no build step or runtime dependencies. Node.js 24.8+ and npm are used only for development checks; keep frameworks, bundlers, and third-party runtime code out of the distributed forms.

From the repository root, run:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000/` for the gallery or `http://localhost:8000/forms/<name>/` for a template.

## Repository layout

- `index.html`: static gallery, with inline CSS, template links/categories, and preview dialog. `assets/js/gallery.js` adds filtering and on-demand live previews.
- `downloads/<name>.zip`: committed standalone packages generated with `npm run package:forms` (Python 3.9+ standard library only). Each includes the shared script at a rewritten local path.
- `forms/<name>/`: each template contains `index.html`, `sign-up.html`, `reset-password.html`, `new-password.html`, `style.css`, `script.js`, and `README.md`.
- `shared/js/form-utils.js`: shared validation, notifications, animations, and `FormUtils.LoginFormBase`.
- `assets/screenshots/`: refreshed PNGs for social/README/fallback use, 400/800px WebP gallery thumbnails, and a source/image hash manifest. Generate with `npm run screenshots`; do not hand-edit derived assets.
- `tests/visual/reference.zip` and `reference.json`: explicitly accepted visual reference source/assets. Run `npm run test:visual` before changing them; inspect diffs and actual layouts before `npm run visual:update`. See `docs/screenshot-integration-guide.md`.
- `assets/js/contact-form.js`: separate contact-form behavior; inspect its consumers before changing it.
- `docs/design-guide.md` and `docs/screenshot-integration-guide.md`: design and screenshot documentation. Check instructions against current source; some documentation predates the shared base class.

## Implementation conventions

Use four-space indentation and match the surrounding code. Keep each template's styling in its own `style.css` and preserve its distinct visual design. Use local assets, system font stacks, and relative paths so templates work offline and under the GitHub Pages project path.

Per-template JavaScript extends `FormUtils.LoginFormBase` and instantiates its class on `DOMContentLoaded`. Prefer constructor options and hooks such as `decorate`, `onSuccess`, and `getElementsToHideOnSuccess` over duplicating the login lifecycle. Load `../../shared/js/form-utils.js` before the template's `script.js`. Copying a template into another project also requires the shared script or an updated script reference.

Preserve the shared DOM contract unless a template explicitly configures alternatives:

- Form `#loginForm`, inputs `#email` and `#password`, and optional checkbox `#remember`.
- `.form-group` wrappers with error elements named `#<fieldName>Error` and `.input-wrapper` input containers.
- Password button `#passwordToggle` with an `.eye-icon` child.
- Success element `#successMessage`, revealed through the `.show` class.

Keep `data-action`/`data-provider` behavior hooks independent of styling classes. Sign-in passwords are required but must not be trimmed or checked against password-creation rules. Keep labels, appropriate autocomplete attributes, `novalidate` for JavaScript validation, accessible names on icon controls, visible keyboard focus, and reduced-motion support. Render user-supplied notification text through DOM text APIs rather than HTML interpolation.

Authentication, social login, signup, and password reset are demonstrations. Companion pages use `data-auth-flow` (`signup`, `request-reset`, `reset-password`), separate callback options, and 15-character creation validation. Never apply creation rules to sign-in. Keep their no-JavaScript submit guard and explicit demo disclosures. `FormUtils.simulateLogin` waits about two seconds and rejects the exact combination `admin@demo.com` / `wrongpassword`. Do not imply these demos provide production authentication.

## Adding or changing templates

For a new template, follow an existing template's companion-screen structure and the shared DOM contract. Add its screenshot, metadata, canonical/social URLs, and gallery entry. Update the root README gallery and category lists when adding, removing, or renaming templates. Keep per-template documentation consistent with changed behavior. Run `npm run package:forms` after any template/shared-runtime changes and commit the resulting ZIPs; `npm run check` rejects stale downloads. Add category/slug attributes, preview actions, and download links for new gallery cards.

Changes to shared JavaScript affect every template; examine template overrides and verify representative designs as well as the directly affected template. Avoid unrelated bulk reformatting or visual changes.

## Verification

Install development dependencies with `npm ci`, then install browser engines with `npx playwright install chromium firefox webkit`. Run `npm run check` for syntax, HTML, references, and form contracts, and `npm test` for all templates across Chromium, Firefox, and WebKit. `npm run test:chromium` is a faster focused run. CI runs all checks, including desktop/mobile visual projects. `npm run check` also rejects stale screenshots and corrupt visual references. Never auto-update the visual reference to hide a regression; deliberate, reviewed updates use `npm run visual:update`. Gallery tests also download/extract every package and open it directly, check filtering, preview screen switching, native reset-flow navigation, live viewport switching, shareable preview restoration/copy fallback, Back/Forward navigation, synchronized two-form comparisons, local favorites, named-list creation/rename/delete/membership, and shareable shortlists (including blocked-storage/clipboard and complete-selector checks), and all-screen geometry checks, and verify no-JavaScript fallback. Run `npm run test:gallery` for that scope. Browser tests include keyboard operation, validation, failure/retry, loading/success, auxiliary actions, mobile overflow, and axe accessibility checks. Also manually check visual design, zoom, password-manager autofill, and screen-reader announcements; automated checks do not prove accessibility compliance.

If Node.js is available, `node --check path/to/script.js` checks JavaScript syntax without installing dependencies. Run `git diff --check` before finishing and report what was actually verified. Documentation-only edits do not require browser testing.

Do not add OS metadata or temporary screenshot folders. Respect `.gitignore`, which excludes `.DS_Store`, `CLAUDE.md`, `login-form-screenshots/`, and `colorlib-blog-post.html`.
