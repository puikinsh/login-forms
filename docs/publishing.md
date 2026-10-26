# Publishing the login-form collection

## Documentation and generated files

For each release, keep the README counts, gallery/categories, design guide,
per-design notes, screenshot guide, and changelog aligned with the actual `forms/`
inventory. There are 40 templates and 160 account screens in 2.1.0. Do not describe
the demo adapter as production authentication or infer a license from another pack.

1. Run `npm ci` with Node.js 24.8+ and Python 3.9+ available.
2. If templates or the shared runtime changed, run `npm run package:forms`.
3. Run `npm run screenshots` after visual/source changes; review the captures.
4. Run `npm run check` and the affected browser tests. Full CI runs `npm test`
   across separate Chromium, Firefox, WebKit, desktop-visual, and mobile-visual jobs.
5. Compare visual changes against the frozen reference. Inspect expected/actual
   differences before deliberate acceptance with `npm run visual:update`.
6. Include the deterministic ZIPs, responsive images/manifest, and reviewed visual
   reference in the Git submission. Exclude dependencies, test reports, OS files,
   temporary screenshots, and credentials.

## GitHub and live gallery

The repository is [puikinsh/login-forms](https://github.com/puikinsh/login-forms).
Use a `codex/` branch and a pull request for a reviewable submission. Describe the
shipped behavior and report checks actually completed; distinguish local results
from GitHub CI. Attach all generated files to the same change as their sources.

GitHub Pages currently publishes the repository root from `main`:
[Live gallery](https://puikinsh.github.io/login-forms/). A branch push or open PR
does not update that site. After CI passes and the change lands on `main`, verify
Pages deployment, a new-design preview, companion links, and at least one ZIP from
the public URL before linking the new features in published articles. If GitHub
Pages settings change, re-read the repository's Pages configuration.

Use the version/date in the changelog when publishing a GitHub release. Source
archives include development files; per-design ZIPs in `downloads/` are the
standalone user packages. No Node.js installation is required to use those ZIPs.

## Colorlib content

Check the live content before editing. Suggested maintenance targets:

- [HTML/CSS login roundup](https://colorlib.com/wp/html5-and-css3-login-forms/):
  update the bundle/tutorial from 20 to 40 designs, explain the four screens and
  standalone ZIP option, and link to the gallery and repository. If adding the
  bundle as a counted list entry, update the article count consistently.
- [Registration roundup](https://colorlib.com/wp/free-bootstrap-registration-forms/):
  add a related resource for matching signup/sign-in/recovery screens. Do not
  change the ranked-entry count for a related-resource paragraph.
- [Bootstrap form roundup](https://colorlib.com/wp/bootstrap-form-templates/):
  add a relevant authentication resource without implying these standalone pages
  are Bootstrap components or changing unrelated template descriptions.
- [Login template archive](https://colorlib.com/wp/cat/login-forms/):
  update the category introduction if editorial access permits. Linking a bundle
  does not add forty product entries to the archive's own result count.

Preserve unrelated entries, affiliate links, product licenses, and taxonomy counts.
State that accounts, sessions, and recovery emails require a real backend. Describe
system fonts/local assets, original CSS/SVG studies, named shortlists/favorites,
comparison links, and desktop/mobile screen previews accurately. Do not imply this
bundle includes passkey, magic-link, OTP, or SSO services.

Before saving a live edit, retain the original content/revision and verify that the
source has not changed since it was read. After saving, reload the public page,
check the changed wording and links, and record the affected URLs and publication
status. A prepared local patch is not a published update.
