#!/usr/bin/env python3
"""Build deterministic, self-contained downloads using only Python's standard library."""
import argparse
import io
from pathlib import Path
import re
import zipfile
import zlib

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'downloads'


def package(folder):
    slug = folder.name
    markup = (folder / 'index.html').read_text()
    shared_reference = '../../shared/js/form-utils.js'
    if markup.count(shared_reference) != 1:
        raise ValueError(f'{slug}: expected one shared JavaScript reference')
    markup = markup.replace(shared_reference, 'form-utils.js')
    title = re.search(r'<title>(.*?)</title>', markup).group(1)
    readme = f'''# {title}

Extract the whole `{slug}/` folder, then open `index.html` in a browser.
Everything required is included. No installation, build step, CDN, or internet connection is needed.

## Included files

- `index.html`: sign in
- `sign-up.html`: account creation demo
- `reset-password.html`: reset request demo
- `new-password.html`: new-password demo
- `style.css`: this design's styling
- `script.js`: this design's behavior
- `form-utils.js`: shared validation, accessibility, and login lifecycle
- `README.md`: these instructions

Keep these files together when moving or hosting the form. You can also serve this
folder with `python3 -m http.server 8000` and visit http://localhost:8000/.

## Demo and integration

Sign-in, reset, signup, and provider actions are demonstrations. Any valid email and
nonempty password succeeds except `admin@demo.com` with `wrongpassword`, which shows
an error. Never enter real credentials into a demo. The other screens create no
accounts, send no email, change no passwords, and save nothing. New passwords
require at least 15 characters; spaces and paste are supported. Use `error@demo.com`
on sign-up/reset requests or `demo-error-password` on the new-password screen to
preview a temporary service error, then edit the value and retry.

To connect your backend, pass an asynchronous `authenticate(email, password, data)`
callback in the `super({{ ... }})` options in `script.js`. Resolve on successful
sign-in and reject with a safe user-facing Error on failure. Passwords are passed
unchanged. The server owns credential verification, session security, and rate limits.

For the companion screens, supply separate asynchronous `createAccount(email, password, data)`,
`requestReset(email, password, data)`, and `resetPassword(email, password, data)` options.
The reset adapter must obtain a token from your real reset flow and verify it on the
server before changing any password. Use generic reset responses, expiring single-use
tokens, server-side validation, rate limits, and secure session handling. Client-side
checks are usability helpers. Replace demo notices, labels, and success copy when
integrating your service. These demo screens are not production authentication.

Customize colors in `style.css` and labels in `index.html`.

Created by Aigars Silkalns for Colorlib.
Source and documentation: https://github.com/puikinsh/login-forms/tree/main/forms/{slug}
Collection: https://puikinsh.github.io/login-forms/
'''
    files = {
        'index.html': markup.encode(),
        **{name: (folder / name).read_text().replace(shared_reference, 'form-utils.js').encode() for name in ['sign-up.html', 'reset-password.html', 'new-password.html']},
        'style.css': (folder / 'style.css').read_bytes(),
        'script.js': (folder / 'script.js').read_bytes(),
        'form-utils.js': (ROOT / 'shared/js/form-utils.js').read_bytes(),
        'README.md': readme.encode(),
    }
    result = io.BytesIO()
    with zipfile.ZipFile(result, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, content in sorted(files.items()):
            info = zipfile.ZipInfo(f'{slug}/{name}', date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    return result.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if committed downloads differ from source')
    args = parser.parse_args()
    folders = sorted(path for path in (ROOT / 'forms').iterdir() if path.is_dir())
    expected = {f'{folder.name}.zip' for folder in folders}
    errors = []
    if not args.check:
        OUTPUT.mkdir(exist_ok=True)
    for folder in folders:
        target = OUTPUT / f'{folder.name}.zip'
        content = package(folder)
        if args.check:
            # Compare contents, not compressor output, across Python/zlib versions.
            try:
                with zipfile.ZipFile(target) as actual, zipfile.ZipFile(io.BytesIO(content)) as wanted:
                    fresh = actual.namelist() == wanted.namelist() and all(
                        actual.read(name) == wanted.read(name) for name in wanted.namelist()
                    )
            except (OSError, zipfile.BadZipFile, RuntimeError, NotImplementedError, zlib.error):
                fresh = False
            if not fresh:
                errors.append(f'{target.relative_to(ROOT)} is missing or stale')
        else:
            target.write_bytes(content)
    extras = {path.name for path in OUTPUT.glob('*.zip')} - expected
    errors.extend(f'downloads/{name} has no matching template' for name in sorted(extras))
    if errors:
        raise SystemExit('\n'.join(errors) + '\nRun npm run package:forms and commit the updated ZIP files.')
    print(f'{"Verified" if args.check else "Built"} {len(folders)} standalone form packages.')


if __name__ == '__main__':
    main()
