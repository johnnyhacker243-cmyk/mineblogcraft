"""Extend the existing local Minecraft Unifont atlas for content characters.

Reads one explicit, user-authorized asset directory; never downloads or commits
Minecraft resources. Pillow required. Runtime retains a missing-glyph fallback.
"""
import argparse, hashlib, io, json, zipfile
from pathlib import Path
from PIL import Image

p=argparse.ArgumentParser()
p.add_argument('--assets',type=Path,required=True)
a=p.parse_args()
root=Path(__file__).resolve().parents[1]
source_hash='666999116c467f10622db1527a06ddc0a6efad2a'
data=(a.assets/'objects'/source_hash[:2]/source_hash).read_bytes()
assert hashlib.sha1(data).hexdigest()==source_hash,'Unexpected original font asset'
with zipfile.ZipFile(io.BytesIO(data)) as z:
    rows=z.read('unifont_all_no_pua-15.1.05.hex').decode('ascii').splitlines()
glyphs={int(row.split(':')[0],16):row.split(':')[1] for row in rows if int(row.split(':')[0],16)<65536}
out=root/'public/assets/inventory'
characters=set(json.loads((out/'font.json').read_text(encoding='utf-8')).keys())
for folder in ['src','public/content','public/data/rss']:
    for source in (root/folder).rglob('*'):
        if source.suffix in ['.json','.md','.ts','.tsx']:characters.update(source.read_text(encoding='utf-8'))
selected=sorted(code for code in glyphs if chr(code) in characters)
atlas=Image.new('RGBA',(256,((len(selected)+15)//16)*16));metadata={}
for i,code in enumerate(selected):
    bits=glyphs[code];w=len(bits)//4;pixels=bytes.fromhex(bits);x,y=(i%16)*16,(i//16)*16
    for yy in range(16):
        row=int.from_bytes(pixels[yy*(w//8):(yy+1)*(w//8)],'big')
        for xx in range(w):
            if row&(1<<(w-1-xx)):atlas.putpixel((x+xx,y+yy),(255,255,255,255))
    metadata[chr(code)]=[x,y,w]
atlas.save(out/'unifont.png')
(out/'font.json').write_text(json.dumps(metadata,ensure_ascii=False),encoding='utf-8')
revision=hashlib.sha256((out/'font.json').read_bytes()+(out/'unifont.png').read_bytes()).hexdigest()[:16]
(root/'src/config/inventory-font-version.json').write_text(json.dumps({'revision':revision})+'\n',encoding='utf-8')
print(f'Extended local original font atlas: {len(metadata)} glyphs; assets remain ignored by Git')
