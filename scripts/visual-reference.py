#!/usr/bin/env python3
"""Freeze reviewed source/assets for same-browser visual comparisons, or verify the archive."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / 'tests/visual/reference.zip'
MANIFEST = ARCHIVE.with_name('reference.json')

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
if args.check:
    expected = json.loads(MANIFEST.read_text())
    with zipfile.ZipFile(ARCHIVE) as archive:
        if sorted(archive.namelist()) != sorted(expected):
            raise SystemExit('Visual reference inventory is corrupt. Restore or deliberately update it.')
        for name, digest in expected.items():
            if hashlib.sha256(archive.read(name)).hexdigest() != digest:
                raise SystemExit(f'Visual reference is corrupt: {name}')
    print(f'Verified {len(expected)} frozen visual reference files.')
else:
    files = [ROOT / 'index.html', ROOT / 'assets/js/gallery.js', ROOT / 'shared/js/form-utils.js']
    for folder in sorted((ROOT / 'forms').iterdir()):
        if folder.is_dir():
            files.extend(folder / name for name in ['index.html', 'sign-up.html', 'reset-password.html', 'new-password.html', 'style.css', 'script.js'])
    files.extend(sorted((ROOT / 'assets/screenshots').glob('*.png')))
    files.extend(sorted((ROOT / 'assets/screenshots').glob('*.webp')))
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    manifest = {}
    with zipfile.ZipFile(ARCHIVE, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(files):
            name = path.relative_to(ROOT).as_posix()
            data = path.read_bytes()
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
            manifest[name] = hashlib.sha256(data).hexdigest()
    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + '\n')
    print(f'Updated frozen visual reference ({len(files)} files, {ARCHIVE.stat().st_size // 1024} KiB). Review visual diffs before committing.')
