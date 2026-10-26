# Mono Journal

A full-width newspaper masthead, oversized issue number, editorial columns, and a reader access form.

## Files and local preview

Open `index.html` or serve the repository and visit `/forms/mono-journal/`.
`sign-up.html`, `reset-password.html`, and `new-password.html` match the sign-in design.
Keep `style.css`, `script.js`, and `../../shared/js/form-utils.js` available. The downloadable
ZIP rewrites the shared script path for a completely standalone, offline folder.
All artwork is original CSS/inline SVG; fonts are system stacks. No runtime packages.

## Behavior and integration

All authentication is a demonstration. No accounts, emails, password changes, sessions,
or redirects are created. Never enter a real password. Sign-in accepts any nonempty
password except `admin@demo.com` / `wrongpassword`. Creation requires at least 15
characters. Use `error@demo.com` on signup/reset or `demo-error-password` on the new
password screen to preview a temporary failure.

The per-design class extends `FormUtils.LoginFormBase`. Supply separate `authenticate`,
`createAccount`, `requestReset`, and `resetPassword` callbacks to integrate a real service;
servers own verification, reset tokens, sessions, and rate limiting. Labels remain above
fields; errors wrap in normal flow, passwords preserve case, and pages scroll at zoom.

## Design direction

A full-width newspaper masthead, oversized issue number, editorial columns, and a reader access form. See [research and composition notes](../../docs/design-research.md)
for the collection's visual references and rationale. This is an original composition,
not a redistributed third-party template or artwork.
