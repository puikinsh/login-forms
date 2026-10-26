# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-10-26

The collection now ships 40 designs, each with four account screens, with no runtime dependencies.

### Twenty additional design studies

- Expanded the collection to 40 templates with original editorial, architectural, ceramics, darkroom, botanical, recording desk, museum ticket, fashion, orbital, travel, terminal, paper, motorsport, Bauhaus, journal, gallery, map, market, and kinetic typography compositions.
- Added all four matching screens, shared validation/demo behavior, SEO metadata, responsive local artwork, gallery entries, and standalone packages for every new design. Original designs, saved favorites, and named lists remain available together.
- Documented Framer and Dribbble research and composition rationale. No third-party artwork, fonts, runtime dependencies, or template code are redistributed.
- Replaced fixed gallery-count checks with inventory-based assertions and retained a per-template thumbnail transfer budget as the collection grows.

### Companion authentication screens

- Added matching sign-up, reset-request, and new-password pages to all 40 designs and standalone downloads.
- Connected existing sign-up/reset links, including navigation without JavaScript.
- Added accessible password-creation validation, explicit local demo disclosures, generic reset results, loading/success announcements, and retryable demo failures.
- Added cross-browser behavior, accessibility, offline-package, and desktop/mobile visual checks for the companion screens. CI runs browser/visual projects as separate jobs with per-project reports. No runtime dependencies added.


### Screenshots and visual regression

- Refreshed all 40 screenshots from current forms and added responsive 400/800px WebP gallery previews, preserving optimized PNGs for documentation/social/fallback use.
- Added repeatable capture/encoding, source freshness and image integrity checks, transfer budgets, and dense-screen/breakpoint selection tests.
- Added 332 desktop/mobile visual tests (1,240 comparisons) covering every form's initial/error layouts, the full gallery, and preview dialog. Frozen reference source is rendered in the same browser for portable expected/actual/diff checks; acceptance remains an explicit developer action.

### Gallery

- Added locally saved named shortlists with separate memberships, duplicate-name validation, rename/delete controls, and cross-tab updates. Shared named collections import as independent copies; list and comparison sharing includes the name and complete membership without exposing local IDs. No runtime dependencies added.

- Added per-card favorites, local persistence and cross-tab synchronization, combined favorites filtering, quick comparisons, and portable shortlist links with clipboard/manual-copy support. Shared lists merge into local favorites only when explicitly saved.
- Grouped the complete 40-form collection in both preview selectors, with favorites/shared picks first and all original and newer designs available regardless of gallery filters.

- Added synchronized side-by-side comparisons with two form selectors, independent values, per-form downloads, shareable comparison URLs, and a horizontally scrollable phone layout. The second iframe loads only on demand.

- Added shareable preview URLs for form, screen, and desktop/mobile view, with automatic restoration, filter preservation, Copy link/manual-copy fallback, and Back/Forward support without iframe history steps.

- Added a native screen selector to live previews for sign-in, sign-up, reset requests, and new-password screens, synchronized with navigation inside the demo. Desktop/mobile switching preserves entered values without reloading; screen loading is announced.

- Added search and category filters with result counts, empty states, and shareable filter URLs.
- Added on-demand desktop/mobile live previews with keyboard dismissal and focus restoration.
- Added complete standalone ZIP downloads for all 40 forms, with the shared JavaScript included.
- Added package freshness checks and cross-browser gallery/download tests. Gallery demo links and downloads still work without JavaScript.

### Fixed

- Fixed floating labels overlapping typed values, invalid-field labels dropping back over text, error blocks expanding positioned control backgrounds, and password-toggle animations replacing positioning transforms.
- Let validation text wrap in normal flow, removed empty error spacing, restored vertical scrolling for tall forms, and preserved the case of revealed credentials. Added all-screen geometry checks at desktop, zoom-equivalent, phone, and narrow-phone widths.

- Unified sign-in validation across all 20 templates: validate every field, accept existing passwords unchanged, and allow email addresses across domains.
- Restored native keyboard access and visible focus for custom checkboxes; labeled icon-only social controls and exposed password-toggle state.
- Associated errors with inputs, focused the first invalid field, announced loading, preserved authentication errors for retry, and focused success results.
- Bound reset, signup, and provider actions through explicit data attributes; scoped shared behavior to each form instance.
- Improved text/error contrast in affected designs and notifications; skipped decorative JavaScript effects for reduced-motion preferences.
- Used POST as the no-JavaScript fallback so credentials do not enter URL query strings.

### Added

- Optional asynchronous `authenticate(email, password, data)` integration callback and duplicate-submit protection.
- Development-only Playwright and axe checks across all templates in Chromium, Firefox, and WebKit, plus HTML, syntax, local-reference, and form-contract checks.
- GitHub Actions quality checks, pinned development dependencies, and contributor setup instructions. Distributed templates remain dependency-free.

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
