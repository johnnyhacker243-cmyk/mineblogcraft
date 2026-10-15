"""Extract unchanged vanilla item PNGs from the explicitly supplied local client.

No download, redraw or redistribution. Output remains excluded from Git.
"""
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
assert hashlib.sha1(args.jar.read_bytes()).hexdigest() == expected, 'Unexpected Minecraft client'
icons = json.loads((root / 'config/blogIcons.json').read_text(encoding='utf-8'))
output = root / 'public/assets/inventory/blog-icons'
output.mkdir(parents=True, exist_ok=True)
provenance = {'clientSha1': expected, 'textures': {}}
with zipfile.ZipFile(args.jar) as client:
    for key, icon in icons.items():
        source = icon['source']
        assert source == f'assets/minecraft/textures/item/{key}.png'
        raw = client.read(source)
        assert raw.startswith(b'\x89PNG\r\n\x1a\n'), source
        (output / f'{key}.png').write_bytes(raw)
        provenance['textures'][key] = {'source': source, 'sha256': hashlib.sha256(raw).hexdigest()}
(output / 'PROVENANCE.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(icons)} unmodified vanilla item icons; output remains ignored by Git.')
