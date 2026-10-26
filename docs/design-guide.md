# Designing and integrating a template

The collection contains 40 designs and 160 account screens. Each design has its
own HTML and CSS, with shared validation and demo behavior. The distributed forms
need no package installation, build step, CDN, external font, or runtime framework.

## Files and portability

```text
forms/<slug>/
    index.html             Sign in
    sign-up.html           Account creation demo
    reset-password.html    Reset request demo
    new-password.html      New-password demo
    style.css              This design's layout and artwork
    script.js              LoginFormBase subclass and visual hooks
    README.md              Design and integration notes
shared/js/form-utils.js     Shared behavior for repository copies
```

Copy a complete design folder together with `shared/js/form-utils.js`, preserving
its relative path. Alternatively, download `downloads/<slug>.zip`: it contains the
four pages, CSS, per-design script, a local `form-utils.js`, and a package README.
Extract the whole folder and open `index.html`; the script paths are already
rewritten. Direct-file form demos work offline. Use the gallery over local HTTP
for same-origin iframe access, reliable History API behavior, and clipboard APIs.

The gallery is `index.html` plus `assets/js/gallery.js`. Screenshot assets belong
in `assets/screenshots/`; there is no shared template stylesheet or external font
folder to copy. Each template's layout stays in its own `style.css`.

## Visual design

Preserve the design's composition, typography, color hierarchy, and responsive
identity when editing a template. CSS variables are available in most designs;
some older rules use direct color values. Keep system font stacks and local
artwork. The twenty additional studies use original inline SVG/CSS scenes; see
[research and composition notes](design-research.md).

Use normal document flow for labels, errors, help text, and success messages.
A positioned control wrapper must enclose only the input, toggle, and decoration;
keep validation messages outside that wrapper. Reserve text space for the
password toggle and never transform credential case. Tall pages must scroll.
Floating labels are design-specific; labels above fields are equally supported.

## Shared behavior and DOM contract

Load `../../shared/js/form-utils.js` before `script.js`. Each design instantiates a
subclass of `FormUtils.LoginFormBase` on `DOMContentLoaded`. Keep:

- Form `#loginForm`, named fields `#email` and `#password`, optional `#remember`.
- `.form-group` wrappers and errors `#emailError` / `#passwordError`, referenced
  by the corresponding input's `aria-describedby`.
- Password button `#passwordToggle`, accessible name/state, and an `.eye-icon`
  where that design uses it.
- Focusable result `#successMessage`, displayed through its `.show` class.
- Behavior hooks `data-action` and `data-provider` independently of visual classes.

The base class supports selector overrides for designs with different markup.
Prefer constructor options or hooks such as `decorate`, `onSuccess`, and
`getElementsToHideOnSuccess` over duplicating validation or the submit lifecycle.
Use text DOM APIs when presenting service responses.

## Validation and authentication integration

These screens demonstrate interfaces. They do not create accounts, send emails,
change passwords, create sessions, or redirect to a protected app. Sign-in accepts
an email and any nonempty password without trimming or creation-strength rules.
The exact `admin@demo.com` / `wrongpassword` combination demonstrates rejection.

Companion screens use `data-auth-flow="signup"`, `"request-reset"`, or
`"reset-password"`. New passwords require at least 15 characters; spaces and paste
are supported. `error@demo.com` demonstrates a signup/reset-request service error;
`demo-error-password` demonstrates a new-password service error. Companion submit
buttons stay disabled without JavaScript and display explicit demo disclosures.

Pass separate asynchronous adapters to your subclass:

```js
super({
    authenticate: async (email, password, data) => { /* Existing-account sign-in. */ },
    createAccount: async (email, password, data) => { /* Account creation. */ },
    requestReset: async (email, password, data) => { /* Generic reset response. */ },
    resetPassword: async (email, password, data) => { /* Verify a real reset token. */ },
});
```

Replace each comment with your service integration; the snippets are adapter
signatures, not a functioning authentication backend. Resolve after a successful
operation, or reject with a safe user-facing `Error`. The server owns validation,
credential verification, sessions, rate limiting, and expiring single-use reset
tokens. Replace demo notices and success copy when integrating a real service.

## Gallery, sharing, and local collections

Add each design once to the gallery with its category, `data-slug`, preview action,
screenshot variants, source links, and ZIP download. Both selectors derive their
inventory from all cards, regardless of gallery filters. Favorites and the active
shortlist are prioritized while every design remains selectable.

Supported URL parameters:

| Parameter | Meaning |
| --- | --- |
| `q`, `category` | Gallery search and category |
| `preview`, `compare` | First and optional second design slug |
| `screen` | `signin`, `signup`, `request-reset`, or `new-password` |
| `device` | `desktop` or `mobile` |
| `shortlist`, `name` | Comma-separated shared design slugs and optional list name |
| `collection` | `all`, `favorites`, `shortlist`, or local `saved` list view |
| `list` | Browser-local named-list ID; portable share links omit this ID |

`login-forms:favorites:v1` stores favorite slugs in localStorage.
`login-forms:lists:v1` stores named-list IDs, names, memberships, and a local
selection. Storage failures keep collections usable for the visit and show a
message; clipboard failures expose a selectable link. Incoming shared lists do
not overwrite local data. Saving a shared named copy is explicit. Names are limited
to 60 characters and checked for duplicates; deletion requires confirmation.
No entered form credentials are saved or included in URLs.

## Verification and publishing

Run `npm run check` and the relevant browser checks after changes. The complete
`npm test` suite covers all templates in Chromium, Firefox, and WebKit, including
validation, keyboard controls, demo failures/retry, accessibility scans, and
geometry at 1200, 640, 375, and 320px. `npm run test:gallery` covers filtering,
collections, comparisons, sharing, and offline downloads. Automated checks do not
replace visual, zoom, autofill, or screen-reader review.

After template/shared-runtime edits, rebuild ZIPs with `npm run package:forms` and
refresh screenshots with `npm run screenshots`. Inspect intentional visual changes
before accepting them with `npm run visual:update`. Keep generated assets in the
submission. See the [screenshot guide](screenshot-integration-guide.md) and
[publishing checklist](publishing.md) for the release sequence.
