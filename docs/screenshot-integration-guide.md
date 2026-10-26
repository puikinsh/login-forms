# Screenshots and visual checks

Everything below is development-only. The gallery uses native `<picture>`/`srcset`, local files, and the existing lazy loading. Forms and downloaded packages do not load image tooling or test libraries.

## Refreshing screenshots

Use Node.js 24.8+, Python 3.9+, and the pinned development dependencies:

```sh
npm ci
npx playwright install chromium
npm run screenshots
npm run check
```

The capture script starts a local preview server if needed, visits all 40 current forms in Chromium at 1200 × 900, honors reduced motion, waits for fonts, and captures the whole page so taller designs are not cut off. It creates:

- `<slug>-400.webp`: standard gallery thumbnail.
- `<slug>-800.webp`: larger/denser gallery thumbnail.
- `<slug>.png`: refreshed 1200px-wide palette PNG for social metadata, README images, and browser fallback.
- `manifest.json`: source fingerprints, image hashes, dimensions, and byte sizes.

The 400px thumbnails use WebP quality 76; the 800px versions retain quality 82. Sharp is a pinned development dependency used only for resizing/encoding. Existing screenshots are replaced in place. No CDN, remote image service, or browser image-processing library is used.

Review the captures before committing them, especially gradients, text, and tall forms. `npm run check` validates every `srcset` candidate, dimensions and image hashes, source freshness, and the 75 KB per-WebP size limit. Browser tests verify that a 1× mobile viewport loads the 400px WebPs within a 5 KB-per-template aggregate budget (200 KB for 40 templates), that dense screens select 800px assets, and that responsive breakpoints do not select undersized thumbnails.

## Visual regression tests

```sh
npm run test:visual
npm run test:report
```

The two Chromium projects use desktop (1200 × 900) and mobile (375 × 812) viewports at 1× scale. They compare initial and invalid-submission layouts for every sign-in form, plus initial/error/success layouts for every companion sign-up, reset-request, and new-password screen, the full gallery, and all four live-preview screens, and the manual-copy fallback: 332 tests and 1,240 screenshot comparisons, including filled-error states, side-by-side comparisons, saved favorites, shared-shortlist/manual-copy states, and named-list editing, validation, deletion confirmation, and sharing. Only the fallback URL fields are masked because frozen-reference pages use a different URL prefix; functional tests verify its value. They also reject horizontal overflow. Form/gallery captures cover content below the fold; dialog captures use the viewport to match what users see; gallery images are fully decoded before comparison. Motion is reduced, CSS animations are disabled for capture, the pointer is moved out of controls, and carets are hidden.

### How the reference stays portable

`tests/visual/reference.zip` contains the last explicitly accepted HTML, CSS, JavaScript, and screenshot assets. `reference.json` records each file's hash. Tests extract this small archive into a temporary directory and serve it through an intercepted test-only URL. The current page and frozen reference are rendered in the **same browser/context**, with the same viewport, OS fonts, and device settings. No comparison is made between macOS-generated pixels and Linux-generated pixels.

Expected PNGs are rendered exclusively from the frozen reference into ignored `test-results/visual-reference/` files. Playwright then compares the current page with those images, allowing its standard per-pixel color tolerance but no changed pixels beyond that tolerance. Missing/corrupt references fail. Tests never replace the accepted reference with current source; `--update-snapshots` is explicitly rejected. Failures include expected, actual, and diff images in the Playwright HTML report, which CI uploads.

This avoids committing dozens of large PNG baselines or requiring Docker/a hosted visual-testing service. The reference is a regression fixture, not another shipped website or runtime dependency. Browser-engine upgrades can change both renders together; retain the existing cross-browser behavior/accessibility checks and manual visual review.

## Accepting an intentional change

1. Make the change, refresh screenshots with `npm run screenshots`, and refresh ZIPs with `npm run package:forms` if any form/shared runtime files changed.
2. Run `npm run test:visual` against the existing reference and inspect the visual diffs and actual pages.
3. Only after accepting those changes, run `npm run visual:update` to freeze the new reference.
4. Run `npm run check` and `npm test`. Commit the changed source, refreshed image assets/manifest, and reference ZIP/hash manifest together.

CI runs visual checks through `npm test` alongside the existing browser checks. It verifies reference integrity but never auto-approves a new reference. For a new template, add its gallery `<picture>`/download/preview entry and run the same capture/review/reference-update workflow.
