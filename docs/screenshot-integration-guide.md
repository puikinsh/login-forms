# Screenshot Workflow

Each form in [`forms/`](../forms/) has a matching screenshot at `assets/screenshots/<form-slug>.png`. They're referenced by:

- The gallery [`index.html`](../index.html) (every `.form-preview` card)
- [`README.md`](../README.md) gallery table
- Each form's `<meta property="og:image">` for social sharing

Screenshots are stored at **1400px wide** PNGs (resized from 3144×2086 originals for ~70% size reduction). The aspect ratio is the original capture aspect (varies by form, typically 3:2).

## Adding a screenshot for a new form

1. Capture the form at 1200×800 viewport (or whatever framing looks balanced).
2. Save the PNG as `assets/screenshots/<slug>.png` where `<slug>` matches the directory name in `forms/`.
3. Resize to 1400px wide:

   ```bash
   sips --resampleWidth 1400 assets/screenshots/<slug>.png --out assets/screenshots/<slug>.png
   ```

4. Reference it in:
   - The gallery card in [`index.html`](../index.html)
   - The gallery table in [`README.md`](../README.md)
   - The form's existing `og:image` meta tag (set by the meta-injection in `forms/<slug>/index.html`)

## Bulk re-resize

To shrink all screenshots back to 1400px wide (useful after replacing a few originals):

```bash
for f in assets/screenshots/*.png; do
  sips --resampleWidth 1400 "$f" --out "$f"
done
```

## Optional: Puppeteer-based automation

If capturing 20 screenshots by hand becomes painful, a Puppeteer script can drive a headless Chromium against each form. The repo doesn't ship one — node tooling is intentionally avoided per the project's "no build step" rule.
