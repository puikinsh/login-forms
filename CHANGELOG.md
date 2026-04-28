# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-04-28

A foundational refactor focused on code reuse, accessibility, security, and performance. Every visible feature is preserved; the rewrite is internal.

### Added

- **`FormUtils.LoginFormBase` class** in `shared/js/form-utils.js`. Owns the form lifecycle (validation, submit, error display, success transition, keyboard shortcuts, password toggle, floating labels, social/forgot/signup link handling) so per-form scripts only override visual hooks.
- **Per-form SEO metadata** — every form's `index.html` now includes a unique `meta description`, `meta author`, canonical URL, Open Graph (`og:title` / `og:description` / `og:image` / `og:url`), and Twitter Card tags.
- **SVG favicon** (inline data URI) on every form — no extra HTTP request, no binary asset to track.
- **`:focus-visible` keyboard focus rings** appended to every form's CSS. Mouse users see no change; keyboard users finally get a visible focus indicator.
- **Global `prefers-reduced-motion: reduce` support** injected via `FormUtils.addSharedAnimations()`. Animations collapse to ~0 ms when the user prefers reduced motion.
- **Demo credentials documented** in the README so users know which input combination triggers the error path (`admin@demo.com` / `wrongpassword`).
- **CHANGELOG.md** (this file) — a record of changes over time.

### Changed

- **All 20 form scripts refactored** to extend `LoginFormBase`. Per-form sizes dropped from 105–542 lines down to **14–115 lines**. Total per-form JavaScript: **5,366 → 1,025 lines** (-81%). Including the shared utilities: **5,604 → 1,416 lines** (-75%).
- **Screenshots resized** from 3144×2086 to 1400 px wide. Total assets: **28 MB → 8.9 MB** (-68%). Display fidelity in the gallery and READMEs is unchanged at typical viewport widths.
- **`form-utils.js` showNotification API** now accepts an optional `formGroupSelector` so forms with non-default field wrappers (`.organic-field`, `.smart-field`, `.cyber-field`, etc.) work without subclass overrides.
- **`docs/screenshot-integration-guide.md` rewritten** to describe the current workflow. Removed outdated references to "Preview Coming Soon" placeholders, an unused `assets/previews/` thumbnail directory, and a Puppeteer script that didn't exist.
- **README structure refreshed** with an Architecture section, an updated feature list, and revised Performance / Accessibility / Security details.

### Fixed

- **XSS in `FormUtils.showNotification`** (`shared/js/form-utils.js`). The previous implementation set `innerHTML` from a template string that interpolated the caller-provided `message` argument. Since `message` is sourced from server error responses in real deployments, an attacker controlling that response could inject HTML/script. The toast now builds its DOM with `createElement` and uses `textContent` for the message.
- **Document-level keyboard listener leak.** Several forms previously bound `keydown` to `document` with no cleanup, meaning each new form instance stacked another global handler. Listeners are now scoped to the form element.
- **Unbounded `setInterval` in particle/glitch animations** (`gradient-wave`, `neon-cyber`, `retro-future`) replaced with `requestAnimationFrame` loops that exit when their target node leaves the DOM. No more accumulating timers on long-lived pages or hot reloads.
- **`setTimeout` chains racing CSS transitions** replaced with `animationend` listeners (`{ once: true }`) for shake, slide-out, and reset animations. The animation completes on its actual end, not on a guessed delay.
- **Unguarded DOM lookups.** `FormUtils.showError` and `clearError` now null-check `getElementById` and `closest()` results. Removing or renaming a field no longer throws inside the validator.
- **Missing `-webkit-backdrop-filter` companions** added to 11 declarations across 6 forms (`creative`, `glassmorphism`, `gradient-wave`, `neon`, `retro-future`, `soft-minimalism`). Restores correct rendering on Safari 15.4–16.3.

### Security

- See `Fixed` — the `showNotification` change is the security-relevant fix.

---

## [1.1.0] — 2025-08-05

### Added

- Screenshots for all 20 forms (`assets/screenshots/`) and gallery cards in `index.html` and the README.
- Live demo links to GitHub Pages on every form card.
- Initial `docs/screenshot-integration-guide.md`.

### Changed

- README expanded with the full gallery table, category breakdown, and customization guide.
- Minor visual tweaks across several forms.

---

## [1.0.0] — 2025-07-29

Initial public release.

### Added

- 20 self-contained login form templates (`forms/<slug>/`):
  - **Modern & Stylish:** Glassmorphism, Neon Minimalist, Gradient Wave, Neumorphism
  - **Corporate & Clean:** Corporate Professional, Material Design, Clean Banking, Modern SaaS
  - **Minimal & Simple:** Basic, Minimal Clean, Soft Minimalism, Brutalist
  - **Creative & Artistic:** Creative Portal, Retro Future, Elegant Portfolio
  - **Themed & Unique:** AI Assistant, Eco Wellness, Neon Cyber, Minimal Music, Travel Booking
- `shared/js/form-utils.js` — initial validation and notification helpers.
- Top-level `index.html` gallery showcasing all forms with categories.
- `docs/design-guide.md` — design principles for new contributions.
