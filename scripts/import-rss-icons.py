"""Import unmodified vanilla item icons from the user's explicit local client."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--jar', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
expected = '30c73b1c5da787909b2f73340419fdf13b9def88'
if hashlib.sha1(args.jar.read_bytes()).hexdigest() != expected:
    raise ValueError('Unexpected Minecraft client')
icons = json.loads((root / 'config/rssIcons.json').read_text(encoding='utf-8'))
output = root / 'public/assets/inventory/rss-icons'
output.mkdir(parents=True, exist_ok=True)
provenance = {'clientSha1': expected, 'textures': {}}
with zipfile.ZipFile(args.jar) as client:
    for key, icon in icons.items():
        source = icon['source']
        if source != f'assets/minecraft/textures/item/{key}.png':
            raise ValueError('Invalid original item path')
        raw = client.read(source)
        if not raw.startswith(b'\x89PNG\r\n\x1a\n'):
            raise ValueError('Invalid PNG')
        (output / f'{key}.png').write_bytes(raw)
        provenance['textures'][key] = {'source': source, 'sha256': hashlib.sha256(raw).hexdigest()}
(output / 'PROVENANCE.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(icons)} original RSS item icons (ignored local resources).')
