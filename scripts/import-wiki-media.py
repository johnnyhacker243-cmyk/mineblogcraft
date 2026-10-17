"""Import exact vanilla textures/menu audio from the explicitly supplied client.
Output is local runtime media, excluded from Git; no media is downloaded.
"""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--jar', type=Path, required=True)
parser.add_argument('--assets', type=Path, required=True)
args = parser.parse_args()
assert hashlib.sha1(args.jar.read_bytes()).hexdigest() == '30c73b1c5da787909b2f73340419fdf13b9def88', 'Unexpected client'
root = Path(__file__).resolve().parents[1]
nodes = json.loads((root / 'src/data/wiki.json').read_text(encoding='utf-8'))
output = root / 'public/assets/inventory/wiki-icons'
output.mkdir(parents=True, exist_ok=True)
records = {}
with zipfile.ZipFile(args.jar) as jar:
    for key in sorted({node['iconKey'] for node in nodes}):
        path = f'assets/minecraft/textures/item/{key}.png'
        raw = jar.read(path)
        (output / f'{key}.png').write_bytes(raw)
        records[key] = {'source': path, 'sha256': hashlib.sha256(raw).hexdigest()}
(output / 'PROVENANCE.json').write_text(json.dumps(records, indent=2) + '\n', encoding='utf-8')
music = {
    'beginning_2': '87722a59c8d488370f3d430cd4c97a3161081785',
    'floating_trees': '15f38314274e759c44f50ac641d11bde12474a25',
    'moog_city_2': '783ddccf4681a0c50d3e651f4e6ac27a0f4ea76f',
    'mutation': 'c157c56846f0e50620f808fecd9d069423dd6c41',
}
sound = root / 'public/assets/sounds'
sound.mkdir(parents=True, exist_ok=True)
for name, digest in music.items():
    raw = (args.assets / 'objects' / digest[:2] / digest).read_bytes()
    assert hashlib.sha1(raw).hexdigest() == digest, f'Asset mismatch: {name}'
    (sound / f'menu-{name}.ogg').write_bytes(raw)
print(f'Imported {len(records)} vanilla item textures and {len(music)} exact menu tracks.')
